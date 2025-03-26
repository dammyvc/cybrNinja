from flask import Blueprint, jsonify, request
from .models import mongo
import re
import bcrypt
from .auth import requires_auth
from .models import get_user_from_db, get_rank_details, get_streak_details, get_achievement_details
from .models import get_leaderboard_position, get_quizzes_taken
from utils.logger import get_logger
from bson.objectid import ObjectId

app_logger = get_logger()

# Define the blueprint for the routes
app = Blueprint('app', __name__)

@app.route("/")
def home():
    return jsonify({"message": "CybrNinja Backend Running"}), 200

@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    payload = request.user
    try:
        mongo_id_str = payload["sub"].split("|")[1]
        mongo_id = ObjectId(mongo_id_str) 
    except (IndexError, ValueError) as e:
        app_logger.error(f"Invalid sub format or ObjectId: {payload['sub']} - {str(e)}")
        return jsonify({"error": "Invalid user ID format"}), 400
    
    app_logger.debug(f"Querying MongoDB with _id: {mongo_id}")
    user = get_user_from_db(mongo_id)
    if not user:
        app_logger.warning(f"User not found for _id: {mongo_id}")
        return jsonify({"error": "User not found"}), 404
    # Enrich the user data
    # 1. Fetch rank details
    user["rank"] = get_rank_details(user["rank_id"]) if user["rank_id"] else None

    # 2. Fetch streak details
    user["streak"] = get_streak_details(user["streak_id"]) if user["streak_id"] else None

    # 3. Fetch achievement details
    if "achievements" in user and user["achievements"]:
        for achievement in user["achievements"]:
            achievement["details"] = get_achievement_details(achievement["achievement_id"])
    else:
        user["achievements"] = []

    # 4. Calculate leaderboard position
    user["leaderboard_position"] = get_leaderboard_position(user["user_id"])

    # 5. Calculate number of quizzes taken
    user["quizzes_taken"] = get_quizzes_taken(user["user_id"])
    return jsonify(user)

# Update user profile
@app.route("/api/auth/update-profile", methods=["PUT"])
@requires_auth  
def update_profile():
    
    payload = request.user
    try:
        mongo_id_str = payload["sub"].split("|")[1]
        mongo_id = ObjectId(mongo_id_str)
    except (IndexError, ValueError) as e:
        app_logger.error(f"Invalid sub format or ObjectId: {payload['sub']} - {str(e)}")
        return jsonify({"error": "Invalid user ID format"}), 400

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username")
    email = data.get("email")
    avatar = data.get("avatar")
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    if not username or not email:
        return jsonify({"error": "Username and email are required"}), 400

    try:
        user = mongo.db.users.find_one({"_id": mongo_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        update_data: dict = {
            "username": username,
            "email": email,
            "avatar": avatar,
        }

        # Handle password update if provided
        if new_password:
            if not old_password:
                return jsonify({"error": "Current password is required to change password"}), 400

            if re.search(r"(.)\1{2,}", new_password):
                return jsonify({"error": "Password cannot have more than 2 identical characters in a row"}), 400
    
            if not re.search(r"[!@#$%^&*]", new_password):
                return jsonify({"error": "Password must contain special characters"}), 400
    
            if not (re.search(r"[a-z]", new_password) and 
            re.search(r"[A-Z]", new_password) and 
            re.search(r"[0-9]", new_password)):
                return jsonify({"error": "Password must contain lower case, upper case, and numbers"}), 400
    
            if len(new_password) < 8:
                return jsonify({"error": "Password must be at least 8 characters long"}), 400

            # Verify the old password
            if not bcrypt.checkpw(old_password.encode("utf-8"), user["password"].encode("utf-8")):
                return jsonify({"error": "Current password is incorrect"}), 401

            # Hash the new password
            hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
            update_data["password"] = hashed_password.decode("utf-8")

        # Check for duplicate username or email (excluding the current user)
        existing_user = mongo.db.users.find_one(
            {
                "$or": [{"username": username}, {"email": email}],
                "_id": {"$ne": mongo_id},
            }
        )
        if existing_user:
            if existing_user["username"] == username:
                return jsonify({"error": "Username already exists"}), 409
            if existing_user["email"] == email:
                return jsonify({"error": "Email already exists"}), 409

        # Update the user in the database
        result = mongo.db.users.update_one(
            {"_id": mongo_id},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            return jsonify({"error": "No changes made to the profile"}), 400

        return jsonify({"message": "Profile updated successfully"})
    except Exception as e:
        app_logger.error(f"Error updating profile: {str(e)}")
        return jsonify({"error": "Failed to update profile"}), 500