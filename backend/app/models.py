from flask import current_app
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

mongo = PyMongo()  

def get_user_from_db(mongo_id):
    try:
        user = mongo.db.users.find_one(
            {"_id": ObjectId(mongo_id)},
            {   "_id": 0, 
                "user_id": 1,  
                "username": 1,
                "email": 1,
                "password": 1,  
                "avatar": 1,
                "xp": 1,
                "rank_id": 1,
                "streak_id": 1,
                "achievements": 1
            }
        )
    except Exception as e:
        current_app.logger.error(f"Invalid MongoDB ID: {str(e)}")
        return None
    return user

# Helper function to get rank details
def get_rank_details(rank_id):
    if not rank_id:
        return None
    try:
        rank = mongo.db.ranks.find_one(
            {"rank_id": rank_id},
            {"_id": 0}
        )
        return rank
    except Exception as e:
        logger.error(f"Error fetching rank details for rank_id {rank_id}: {str(e)}")
        return None

# Helper function to get streak details
def get_streak_details(streak_id):
    if not streak_id:
        return None
    try:
        streak = mongo.db.streaks.find_one(
            {"streak_id": streak_id},
            {"_id": 0}
        )
        return streak
    except Exception as e:
        logger.error(f"Error fetching streak details for streak_id {streak_id}: {str(e)}")
        return None

# Helper function to get achievement details
def get_achievement_details(achievement_id):
    try:
        achievement = mongo.db.achievements.find_one(
            {"achievement_id": achievement_id},
            {"_id": 0}
        )
        return achievement
    except Exception as e:
        logger.error(f"Error fetching achievement details for achievement_id {achievement_id}: {str(e)}")
        return None

# Helper function to get leaderboard position
def get_leaderboard_position(user_id):
    try:
        # Find all users sorted by XP in descending order
        leaderboard = list(mongo.db.leaderboard.find().sort("xp", -1))
        # Find the position of the user
        for position, entry in enumerate(leaderboard, start=1):
            if entry["user_id"] == user_id:
                return position
        return None  # User not found in leaderboard
    except Exception as e:
        logger.error(f"Error calculating leaderboard position for user_id {user_id}: {str(e)}")
        return None

# Helper function to get number of quizzes taken
def get_quizzes_taken(user_id):
    try:
        count = mongo.db.attempts.count_documents({"user_id": user_id})
        return count
    except Exception as e:
        logger.error(f"Error counting quizzes taken for user_id {user_id}: {str(e)}")
        return 0