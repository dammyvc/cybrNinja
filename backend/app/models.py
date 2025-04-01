from flask import current_app
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from openai import OpenAI
from utils.logger import get_logger
from datetime import datetime
import json
from random import sample

mongo = PyMongo()
openai_client = None
app_logger = get_logger()

DIFFICULTY_BY_RANK = {"Genin": "easy", "Chunin": "medium", "Special Jonin": "medium", "Jonin": "hard", "Kage": "hard"}

def init_app(app):
    global mongo, openai_client
    mongo.init_app(app)
    api_key = app.config.get("OPENAI_API_KEY")
    
    if not api_key:
        
        raise ValueError("OPENAI_API_KEY is missing")
    openai_client = OpenAI(api_key=api_key)
    

def get_user_from_db(mongo_id):
    try:
        user = mongo.db.users.find_one(
            {"_id": ObjectId(mongo_id)},
            {
                "_id": 0, 
                "user_id": 1, 
                "username": 1, 
                "email": 1, 
                "password": 1, 
                "avatar": 1, 
                "xp": 1, 
                "rank_id": 1, 
                "streak_id": 1, 
                "achievements": 1, 
                "past_mistakes": 1,
                "resource_visits": 1,
                "profile_updated": 1,
                "last_trivia_date": 1,
            }
        )
    except Exception as e:
        app_logger.error(f"Invalid MongoDB ID: {str(e)}")
        return None
    return user

def get_rank_details(rank_id):
    if not rank_id:
        return None
    try:
        rank = mongo.db.ranks.find_one({"rank_id": rank_id}, {"_id": 0})
        return rank
    except Exception as e:
        app_logger.error(f"Error fetching rank details for rank_id {rank_id}: {str(e)}")
        return None

def get_streak_details(streak_id):
    if not streak_id:
        return None
    try:
        streak = mongo.db.streaks.find_one({"streak_id": streak_id}, {"_id": 0})
        return streak
    except Exception as e:
        app_logger.error(f"Error fetching streak details for streak_id {streak_id}: {str(e)}")
        return None

def get_achievement_details(achievement_id):
    try:
        achievement = mongo.db.achievements.find_one({"achievement_id": achievement_id}, {"_id": 0})
        return achievement
    except Exception as e:
        app_logger.error(f"Error fetching achievement details for achievement_id {achievement_id}: {str(e)}")
        return None

def get_leaderboard_position(user_id):
    try:
        leaderboard = list(mongo.db.leaderboards.find().sort("xp", -1))
        for position, entry in enumerate(leaderboard, start=1):
            user_id_int = int(entry["user_id"])
            if user_id_int == user_id:
                return position
        return None
    except Exception as e:
        app_logger.error(f"Error calculating leaderboard position for user_id {user_id}: {str(e)}")
        return None

def get_quizzes_taken(user_id):
    try:
        user_id_str = str(user_id)
        count = mongo.db.attempts.count_documents({"user_id": user_id_str})
        return count
    except Exception as e:
        app_logger.error(f"Error counting quizzes taken for user_id {user_id}: {str(e)}")
        return 0

def create_quiz(mongo_id):
    user = get_user_from_db(mongo_id)
    if not user:
        raise ValueError("User not found")

    rank = get_rank_details(user["rank_id"])
    if not rank:
        raise ValueError("Rank not found")

    difficulty = DIFFICULTY_BY_RANK[rank["title"]]
    
    available_questions = list(mongo.db.questions.find({"difficulty": difficulty}, {"_id": 0}))
    selected_questions = sample(available_questions, min(10, len(available_questions)))
    questions = [q["question_id"] for q in selected_questions]

    quiz_id = f"quiz{mongo.db.quizzes.count_documents({}) + 1}"
    quiz = {
        "quiz_id": quiz_id,
        "title": "Phishing Quiz",
        "difficulty_level": difficulty,
        "time_limit": 600,
        "created_at": datetime.utcnow().isoformat(),
        "questions": questions
    }
    mongo.db.quizzes.insert_one(quiz)
    return quiz_id

def get_quiz(quiz_id):
    quiz = mongo.db.quizzes.find_one({"quiz_id": quiz_id}, {"_id": 0})
    if not quiz:
        return None
    questions = [mongo.db.questions.find_one({"question_id": qid}, {"_id": 0}) for qid in quiz["questions"]]
    return {"quiz": quiz, "questions": questions}

def save_attempt(mongo_id, quiz_id, question_attempts, time_taken):
    user = get_user_from_db(mongo_id)
    if not user:
        raise ValueError("User not found")

    attempt_id = f"a{mongo.db.attempts.count_documents({}) + 1}"
    score = sum(1 for q in question_attempts if q["is_correct"])
    xp_earned = 10 * score
    attempt = {
        "attempt_id": attempt_id,
        "user_id": str(user["user_id"]),
        "quiz_id": quiz_id,
        "question_attempts": question_attempts,
        "score": score,
        "xp_earned": xp_earned,
        "streak_bonus": 0,
        "completed_at": datetime.utcnow().isoformat(),
        "time_taken": time_taken
    }
    mongo.db.attempts.insert_one(attempt)

    new_xp = user["xp"] + xp_earned
    current_rank = get_rank_details(user["rank_id"])
    new_rank = current_rank

    next_ranks = mongo.db.ranks.find({"xp_required": {"$gt": current_rank["xp_required"]}}).sort("xp_required", 1)
    for rank in next_ranks:
        if new_xp >= rank["xp_required"]:
            new_rank = rank
        else:
            break

    past_mistakes = user.get("past_mistakes", [])
    for attempt in question_attempts:
        if not attempt["is_correct"]:
            if attempt["question_id"] not in past_mistakes:
                past_mistakes.append(attempt["question_id"])

    mongo.db.users.update_one(
        {"_id": ObjectId(mongo_id)},
        {"$set": {"xp": new_xp, "rank_id": new_rank["rank_id"], "past_mistakes": past_mistakes}}
    )

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
    
    return {"attempt_id": attempt_id, "xp_earned": xp_earned, "new_rank": new_rank["title"]}

def update_leaderboard_positions():
    try:
        
        leaderboard_entries = list(mongo.db.leaderboards.find().sort([("xp_total", -1), ("last_updated", 1)]))
        
        
        for position, entry in enumerate(leaderboard_entries, start=1):
            mongo.db.leaderboards.update_one(
                {"user_id": entry["user_id"]},
                {
                    "$set": {
                        "rank_position": position,
                        "last_updated": datetime.utcnow().isoformat()
                    }
                }
            )
        app_logger.info(f"Updated {len(leaderboard_entries)} leaderboard positions")
    except Exception as e:
        app_logger.error(f"Error updating leaderboard positions: {str(e)}")