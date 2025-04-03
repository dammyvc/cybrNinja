from flask import Blueprint, jsonify, request, current_app
from .models import mongo, get_user_from_db, get_rank_details, get_achievement_details, update_user_achievements, check_achievements_after_quiz, check_achievements_after_rank_update
from .models import get_leaderboard_position, get_quizzes_taken, create_quiz, get_quiz, save_attempt, update_leaderboard_positions
from .auth import requires_auth
import re
import bcrypt
from utils.logger import get_logger
from bson.objectid import ObjectId
import asyncio
import json
from datetime import datetime, timedelta
import uuid
from azure.storage.blob import generate_blob_sas, BlobSasPermissions
import mimetypes
from io import BytesIO

app_logger = get_logger()

# Define blueprints
app = Blueprint('app', __name__)
quiz_bp = Blueprint('quiz', __name__)
blob_bp = Blueprint("blob", __name__)

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
    user["achievements_count"] = len(user["achievements"]) if "achievements" in user else 0
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

@blob_bp.route("/api/generate-upload-url", methods=["POST"])
@requires_auth
def generate_upload_url():
    payload = request.user
    blob_service_client = current_app.blob_service_client
    container_name = current_app.container_name  # Should be "avatars"

    try:
        data = request.get_json()
        mime_type = data.get("mimeType")

        if not mime_type or not mime_type.startswith("image/"):
            return jsonify({"error": "Invalid or missing MIME type"}), 400

        extension = mimetypes.guess_extension(mime_type) or ".png"
        mongo_id_str = payload["sub"].split("|")[1]
        filename = f"/avatar-{uuid.uuid4().hex}{extension}"

        blob_url = f"https://{current_app.config['AZURE_STORAGE_ACCOUNT_NAME']}.blob.core.windows.net/{container_name}/{filename}"
        print(f"Generated upload URL: {blob_url}")  # Debug log

        return jsonify({"uploadUrl": blob_url, "blobName": filename})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/update-profile", methods=["PUT"])
@requires_auth
def update_profile():
    
    payload = request.user

    try:
        mongo_id = ObjectId(payload["sub"].split("|")[1])
    except (IndexError, ValueError):
        return jsonify({"error": "Invalid user ID format"}), 400

    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")
    avatar_url = data.get("avatarUrl")

    if not username or not email:
        return jsonify({"error": "Username and email are required"}), 400

    try:
        user = mongo.db.users.find_one({"_id": mongo_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        update_data = {"username": username, "email": email}

        # Store avatar URL permanently
        if avatar_url:
            update_data["avatar"] = avatar_url  

        # Password update logic
        if new_password:
            if not old_password:
                return jsonify({"error": "Current password is required to change password"}), 400
            if len(new_password) < 8 or not (
                re.search(r"[a-z]", new_password) and
                re.search(r"[A-Z]", new_password) and
                re.search(r"[0-9]", new_password) and
                re.search(r"[!@#$%^&*]", new_password)
            ):
                return jsonify({"error": "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters"}), 400
            if re.search(r"(.)\1{2,}", new_password):
                return jsonify({"error": "Password cannot have more than 2 identical characters in a row"}), 400
            if not bcrypt.checkpw(old_password.encode("utf-8"), user["password"].encode("utf-8")):
                return jsonify({"error": "Current password is incorrect"}), 401

            hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            update_data["password"] = hashed_password

        # Ensure username and email are unique
        existing_user = mongo.db.users.find_one(
            {"$or": [{"username": username}, {"email": email}], "_id": {"$ne": mongo_id}}
        )
        if existing_user:
            return jsonify({"error": "Username or email already exists"}), 409

        # Update MongoDB
        result = mongo.db.users.update_one({"_id": mongo_id}, {"$set": update_data})
        if result.modified_count == 0:
            return jsonify({"error": "No changes made to the profile"}), 400

        response = {"message": "Profile updated successfully"}
        if "avatar" in update_data:
            response["avatarUrl"] = update_data["avatar"]

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Failed to update profile: {str(e)}"}), 500

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

    attempt_data = request.get_json()
    if not attempt_data or "quiz_id" not in attempt_data or "question_attempts" not in attempt_data:
        return jsonify({"error": "Invalid attempt data"}), 400

    try:
        # Save the quiz attempt
        user = get_user_from_db(mongo_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        attempt_data["user_id"] = user["user_id"]
        attempt_data["created_at"] = datetime.utcnow().isoformat()
        attempt_result = save_attempt(
            mongo_id=mongo_id,
            quiz_id=attempt_data["quiz_id"],
            question_attempts=attempt_data["question_attempts"],
            time_taken=attempt_data["time_taken"]
        )

        # Calculate XP earned from the quiz
        quiz_xp_earned = attempt_result["xp_earned"]

        # Update user's XP with quiz XP
        mongo.db.users.update_one(
            {"_id": mongo_id},
            {"$inc": {"xp": quiz_xp_earned}}
        )

        # Check for quiz-related achievements
        quiz_data = get_quiz(attempt_data["quiz_id"])
        if not quiz_data:
            return jsonify({"error": "Quiz not found"}), 404

        new_quiz_achievements = check_achievements_after_quiz(mongo_id, quiz_data, attempt_data)

        # Refresh user data after quiz XP update
        user = get_user_from_db(mongo_id)

        # Check for rank-related achievements
        current_rank = get_rank_details(user["rank_id"])
        new_rank = current_rank["title"]
        for rank in mongo.db.ranks.find({"xp_threshold": {"$lte": user["xp"]}}, {"_id": 0}).sort("xp_threshold", -1):
            new_rank = rank["title"]
            mongo.db.users.update_one(
                {"_id": mongo_id},
                {"$set": {"rank_id": rank["rank_id"]}}
            )
            break

        new_rank_achievements = check_achievements_after_rank_update(mongo_id, new_rank)

        # Combine all new achievements
        new_achievements = new_quiz_achievements + new_rank_achievements

        # Calculate total achievement XP
        achievement_xp = sum(ach["xp_reward"] for ach in new_achievements)

        # Update user's XP with achievement XP
        if achievement_xp > 0:
            mongo.db.users.update_one(
                {"_id": mongo_id},
                {"$inc": {"xp": achievement_xp}}
            )

        # Refresh user data after all XP updates
        user = get_user_from_db(mongo_id)

        # Update leaderboard with total XP
        total_xp = user["xp"]
        mongo.db.leaderboards.update_one(
            {"user_id": user["user_id"]},
            {
                "$set": {
                    "xp_total": total_xp,
                    "last_updated": datetime.utcnow().isoformat()
                }
            },
            upsert=True
        )

        # Update leaderboard positions
        update_leaderboard_positions()

        # Calculate total XP earned for the response
        total_xp_earned = quiz_xp_earned + achievement_xp

        return jsonify({
            "xp_earned": total_xp_earned,  # Total XP (quiz + achievements)
            "quiz_xp": quiz_xp_earned,    # Quiz XP for clarity
            "achievement_xp": achievement_xp,  # Achievement XP for clarity
            "new_rank": new_rank,
            "new_achievements": new_achievements
        })
    except Exception as e:
        app_logger.error(f"Error submitting quiz attempt: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/leaderboard/sync", methods=["POST"])
def sync_leaderboard():
    try:
        
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
                leaderboard_id = f"lb_{user_id}"

                # Insert the user into the leaderboard
                mongo.db.leaderboards.insert_one({
                    "leaderboard_id": leaderboard_id,
                    "user_id": user_id,
                    "rank_position": 0,  
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


@app.route("/api/leaderboard/update-positions", methods=["POST"])
def trigger_leaderboard_update():
    try:
        update_leaderboard_positions()
        return jsonify({"message": "Leaderboard positions updated successfully"})
    except Exception as e:
        app_logger.error(f"Error updating leaderboard positions: {str(e)}")
        return jsonify({"error": "Failed to update leaderboard positions"}), 500

@app.route("/api/trivia-question", methods=["GET"])
def get_trivia_question():
    try:
        prompt = """
        Generate a cybersecurity trivia question with 4 multiple-choice answers. The question should be suitable for a daily trivia challenge and focus on topics like phishing, malware, social engineering, or password security. Provide the question, the 4 answer options, and indicate the correct answer.

        Format the response as JSON:
        {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A"
        }
        """
        response = current_app.openai_client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        trivia_data = json.loads(response.choices[0].message.content)
        return jsonify(trivia_data)
    except Exception as e:
        app_logger.error(f"Error generating trivia question: {str(e)}")
        return jsonify({
            "error": f"Failed to generate trivia question: {str(e)}"
        }), 500

@app.route("/api/check-trivia", methods=["GET"])
@requires_auth
def check_trivia():
    payload = request.user
    try:
        mongo_id_str = payload["sub"].split("|")[1]
        mongo_id = ObjectId(mongo_id_str)
    except (IndexError, ValueError) as e:
        app_logger.error(f"Invalid sub format or ObjectId: {payload['sub']} - {str(e)}")
        return jsonify({"error": "Invalid user ID format"}), 400

    try:
        user = mongo.db.users.find_one({"_id": mongo_id}, {"last_trivia_date": 1})
        if not user:
            return jsonify({"error": "User not found"}), 404

        last_trivia_date = user.get("last_trivia_date")

        
        if not last_trivia_date:
            return jsonify({"hasAnsweredToday": False})

        last_date = datetime.fromisoformat(last_trivia_date.split("T")[0])
        today = datetime.utcnow()
        has_answered_today = last_date.date() == today.date()

        return jsonify({"hasAnsweredToday": has_answered_today})
    except Exception as e:
        app_logger.error(f"Error checking trivia status: {str(e)}")
        return jsonify({"error": "Failed to check trivia status"}), 500

@app.route("/api/update-xp", methods=["POST"])
@requires_auth
def update_xp():
    payload = request.user
    try:
        mongo_id_str = payload["sub"].split("|")[1]
        mongo_id = ObjectId(mongo_id_str)
    except (IndexError, ValueError) as e:
        app_logger.error(f"Invalid sub format or ObjectId: {payload['sub']} - {str(e)}")
        return jsonify({"error": "Invalid user ID format"}), 400

    data = request.get_json()
    xp_to_add = data.get("xpToAdd")

    if not isinstance(xp_to_add, int) or xp_to_add <= 0:
        return jsonify({"error": "xpToAdd must be a positive integer"}), 400

    try:
        user = mongo.db.users.find_one({"_id": mongo_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        new_xp = user["xp"] + xp_to_add

        # Update user's XP and last_trivia_date
        mongo.db.users.update_one(
            {"_id": mongo_id},
            {
                "$set": {
                    "xp": new_xp,
                    "last_trivia_date": datetime.utcnow().isoformat()
                }
            }
        )

        # Update leaderboard
        mongo.db.leaderboards.update_one(
            {"user_id": str(user["user_id"])},
            {
                "$set": {
                    "xp_total": new_xp,
                    "last_updated": datetime.utcnow().isoformat()
                }
            },
            upsert=True
        )

        # Update leaderboard positions
        update_leaderboard_positions()

        return jsonify({"message": "XP updated successfully", "new_xp": new_xp})
    except Exception as e:
        app_logger.error(f"Error updating XP: {str(e)}")
        return jsonify({"error": "Failed to update XP"}), 500


@quiz_bp.route("/quizzes/statistics", methods=["GET"])
@requires_auth
def get_quiz_statistics():
    payload = request.user
    try:
        mongo_id_str = payload["sub"].split("|")[1]
        mongo_id = ObjectId(mongo_id_str)
    except (IndexError, ValueError) as e:
        app_logger.error(f"Invalid sub format or ObjectId: {payload['sub']} - {str(e)}")
        return jsonify({"error": "Invalid user ID format"}), 400

    try:
        user = get_user_from_db(mongo_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_id_str = str(user["user_id"])

        # Get the year from query parameters (default to current year)
        year = int(request.args.get("year", datetime.utcnow().year))

        # Fetch quiz attempts for the user within the specified year
        attempts = mongo.db.attempts.find(
            {
                "user_id": user_id_str,
                "created_at": {
                    "$gte": f"{year}-01-01T00:00:00",
                    "$lt": f"{year+1}-01-01T00:00:00"
                }
            },
            {"_id": 0, "created_at": 1}
        )

        
        monthly_stats = {}
        for attempt in attempts:
            try:
                
                if "created_at" not in attempt or not isinstance(attempt["created_at"], str):
                    app_logger.warning(f"Invalid or missing created_at in attempt: {attempt}")
                    continue

                
                timestamp = attempt["created_at"]
                if not timestamp.endswith("Z") and "+" not in timestamp:
                    timestamp += "+00:00"

                
                created_at = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
                month_key = created_at.strftime("%b") 
                monthly_stats[month_key] = monthly_stats.get(month_key, 0) + 1
            except ValueError as ve:
                app_logger.error(f"Invalid timestamp format in attempt: {attempt['created_at']} - {str(ve)}")
                continue

        # Convert to the format expected by the frontend
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        data = [
            {
                "name": month,
                "questions": (monthly_stats.get(month, 0) * 10)
            }
            for month in months
        ]

        return jsonify({"data": data})

    except Exception as e:
        app_logger.error(f"Error fetching quiz statistics for user_id {mongo_id}: {str(e)}")
        return jsonify({"error": "Failed to fetch quiz statistics"}), 500