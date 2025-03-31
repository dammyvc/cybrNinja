from flask import Blueprint, jsonify, request
from .models import mongo, get_user_from_db, get_rank_details, get_streak_details, get_achievement_details
from .models import get_leaderboard_position, get_quizzes_taken, create_quiz, get_quiz, save_attempt, update_leaderboard_positions
from .auth import requires_auth
import re
import bcrypt
from utils.logger import get_logger
from bson.objectid import ObjectId
import asyncio

app_logger = get_logger()

# Define blueprints
app = Blueprint('app', __name__)
quiz_bp = Blueprint('quiz', __name__)

# General Routes
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
    
    user["rank"] = get_rank_details(user["rank_id"]) if user["rank_id"] else None
    user["streak"] = get_streak_details(user["streak_id"]) if user["streak_id"] else None
    if "achievements" in user and user["achievements"]:
        for achievement in user["achievements"]:
            achievement["details"] = get_achievement_details(achievement["achievement_id"])
    else:
        user["achievements"] = []
    user["leaderboard_position"] = get_leaderboard_position(user["user_id"])
    user["quizzes_taken"] = get_quizzes_taken(user["user_id"])
    return jsonify(user)

@app.route("/api/leaderboard", methods=["GET"])
def get_leaderboard():
    try:
        
        leaderboard_entries = list(mongo.db.leaderboards.find().sort("rank_position", 1).limit(10))

        
        leaderboard_data = []
        for entry in leaderboard_entries:
            user = mongo.db.users.find_one({"user_id": entry["user_id"]}, {"username": 1})
            leaderboard_data.append({
                "rank": entry["rank_position"],
                "name": f"@{user['username']}" if user else f"@{entry['user_id']}",
                "xp": entry["xp_total"]
            })

        return jsonify(leaderboard_data)
    except Exception as e:
        app_logger.error(f"Error fetching leaderboard: {str(e)}")
        return jsonify({"error": "Failed to fetch leaderboard"}), 500

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

        update_data = {"username": username, "email": email, "avatar": avatar}

        if new_password:
            if not old_password:
                return jsonify({"error": "Current password is required to change password"}), 400
            if re.search(r"(.)\1{2,}", new_password):
                return jsonify({"error": "Password cannot have more than 2 identical characters in a row"}), 400
            if not re.search(r"[!@#$%^&*]", new_password):
                return jsonify({"error": "Password must contain special characters"}), 400
            if not (re.search(r"[a-z]", new_password) and re.search(r"[A-Z]", new_password) and re.search(r"[0-9]", new_password)):
                return jsonify({"error": "Password must contain lower case, upper case, and numbers"}), 400
            if len(new_password) < 8:
                return jsonify({"error": "Password must be at least 8 characters long"}), 400
            if not bcrypt.checkpw(old_password.encode("utf-8"), user["password"].encode("utf-8")):
                return jsonify({"error": "Current password is incorrect"}), 401
            hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
            update_data["password"] = hashed_password.decode("utf-8")

        existing_user = mongo.db.users.find_one({"$or": [{"username": username}, {"email": email}], "_id": {"$ne": mongo_id}})
        if existing_user:
            if existing_user["username"] == username:
                return jsonify({"error": "Username already exists"}), 409
            if existing_user["email"] == email:
                return jsonify({"error": "Email already exists"}), 409

        result = mongo.db.users.update_one({"_id": mongo_id}, {"$set": update_data})
        if result.modified_count == 0:
            return jsonify({"error": "No changes made to the profile"}), 400
        return jsonify({"message": "Profile updated successfully"})
    except Exception as e:
        app_logger.error(f"Error updating profile: {str(e)}")
        return jsonify({"error": "Failed to update profile"}), 500

# Quiz Routes
@quiz_bp.route("/quizzes/phishing/start", methods=["POST"])
@requires_auth
def start_quiz():
    payload = request.user
    try:
        mongo_id_str = payload["sub"].split("|")[1]
        mongo_id = ObjectId(mongo_id_str)
    except (IndexError, ValueError) as e:
        app_logger.error(f"Invalid sub format or ObjectId: {payload['sub']} - {str(e)}")
        return jsonify({"error": "Invalid user ID format"}), 400

    try:
        quiz_id = create_quiz(mongo_id)
        return jsonify({"quiz_id": quiz_id})
    except ValueError as e:
        app_logger.error(f"Error starting quiz: {str(e)}")
        return jsonify({"error": str(e)}), 404

@quiz_bp.route("/quizzes/<quiz_id>", methods=["GET"])
@requires_auth
def get_quiz_route(quiz_id):
    quiz_data = get_quiz(quiz_id)
    if not quiz_data:
        app_logger.warning(f"Quiz not found: {quiz_id}")
        return jsonify({"error": "Quiz not found"}), 404
    return jsonify(quiz_data)

@quiz_bp.route("/quizzes/attempt", methods=["POST"])
@requires_auth
def submit_attempt():
    payload = request.user
    try:
        mongo_id_str = payload["sub"].split("|")[1]
        mongo_id = ObjectId(mongo_id_str)
    except (IndexError, ValueError) as e:
        app_logger.error(f"Invalid sub format or ObjectId: {payload['sub']} - {str(e)}")
        return jsonify({"error": "Invalid user ID format"}), 400

    data = request.json
    try:
        result = save_attempt(
            mongo_id=mongo_id,
            quiz_id=data["quiz_id"],
            question_attempts=data["question_attempts"],
            time_taken=data["time_taken"]
        )
        return jsonify(result)
    except ValueError as e:
        app_logger.error(f"Error saving attempt: {str(e)}")
        return jsonify({"error": str(e)}), 400

# Endpoint to sync existing users to the leaderboard
@app.route("/api/leaderboard/sync", methods=["POST"])
def sync_leaderboard():
    try:
        # Fetch all users
        users = mongo.db.users.find({}, {"user_id": 1, "xp": 1})
        count = 0

        for user in users:
            user_id = str(user["user_id"])
            xp = user.get("xp", 0)

            # Check if the user is already in the leaderboard
            existing_entry = mongo.db.leaderboards.find_one({"user_id": user_id})
            if not existing_entry:
                # Generate a unique leaderboard_id
                leaderboard_count = mongo.db.leaderboards.count_documents({})
                leaderboard_id = f"lb_{leaderboard_count + 1}"

                # Insert the user into the leaderboard
                mongo.db.leaderboards.insert_one({
                    "leaderboard_id": leaderboard_id,
                    "user_id": user_id,
                    "rank_position": 0,  # Will be updated by update_leaderboard_positions
                    "xp_total": xp,
                    "last_updated": datetime.utcnow().isoformat()
                })
                count += 1

        # Update leaderboard positions
        update_leaderboard_positions()

        return jsonify({"message": f"Synced {count} users to the leaderboard"})
    except Exception as e:
        app_logger.error(f"Error syncing leaderboard: {str(e)}")
        return jsonify({"error": "Failed to sync leaderboard"}), 500

# Endpoint to trigger leaderboard position update
@app.route("/api/leaderboard/update-positions", methods=["POST"])
def trigger_leaderboard_update():
    try:
        update_leaderboard_positions()
        return jsonify({"message": "Leaderboard positions updated successfully"})
    except Exception as e:
        app_logger.error(f"Error updating leaderboard positions: {str(e)}")
        return jsonify({"error": "Failed to update leaderboard positions"}), 500