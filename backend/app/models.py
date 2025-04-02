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

def has_achievement(user, achievement_id):
    if not user or "achievements" not in user:
        return False
    return any(ach["achievement_id"] == achievement_id for ach in user["achievements"])

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
            
            if entry["user_id"] == user_id:
                return position
        return None
    except Exception as e:
        app_logger.error(f"Error calculating leaderboard position for user_id {user_id}: {str(e)}")
        return None

def get_quizzes_taken(user_id):
    try:
        count = mongo.db.attempts.count_documents({"user_id": user_id})
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
        "completed_at": datetime.utcnow().isoformat(),
        "time_taken": time_taken
    }
    mongo.db.attempts.insert_one(attempt)

    # Update past mistakes
    past_mistakes = user.get("past_mistakes", [])
    for attempt in question_attempts:
        if not attempt["is_correct"]:
            if attempt["question_id"] not in past_mistakes:
                past_mistakes.append(attempt["question_id"])

    mongo.db.users.update_one(
        {"_id": ObjectId(mongo_id)},
        {"$set": {"past_mistakes": past_mistakes}}
    )

    return {"attempt_id": attempt_id, "xp_earned": xp_earned}

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

def update_user_achievements(mongo_id, new_achievements):
    try:
        for achievement in new_achievements:
            mongo.db.users.update_one(
                {"_id": mongo_id},
                {
                    "$push": {
                        "achievements": {
                            "achievement_id": achievement["achievement_id"],
                            "earned_at": datetime.utcnow().isoformat()
                        }
                    },
                    "$inc": {"xp": achievement["xp_reward"]}
                }
            )
            app_logger.info(f"Achievement {achievement['achievement_id']} awarded to user {mongo_id}")
    except Exception as e:
        app_logger.error(f"Error updating achievements for user {mongo_id}: {str(e)}")
        raise

def check_achievements_after_quiz(mongo_id, quiz_data, attempt_data):
    user = get_user_from_db(mongo_id)
    if not user:
        raise ValueError("User not found")

    new_achievements = []
    quizzes_taken = get_quizzes_taken(user["user_id"])
    correct_answers = sum(1 for attempt in attempt_data["question_attempts"] if attempt["is_correct"])
    total_questions = len(attempt_data["question_attempts"])
    is_phishing_quiz = quiz_data["quiz"]["title"] == "Phishing Quiz"

    # Achievement: First Steps (Completed your first quiz)
    if quizzes_taken == 1 and not has_achievement(user, "ach_001"):
        achievement = get_achievement_details("ach_001")
        new_achievements.append(achievement)

    # Achievement: Quiz Novice (Completed 5 quizzes)
    if quizzes_taken >= 5 and not has_achievement(user, "ach_002"):
        achievement = get_achievement_details("ach_002")
        new_achievements.append(achievement)

    # Achievement: Quiz Master (Completed 20 quizzes)
    if quizzes_taken >= 20 and not has_achievement(user, "ach_003"):
        achievement = get_achievement_details("ach_003")
        new_achievements.append(achievement)

    
    if is_phishing_quiz and correct_answers == total_questions and not has_achievement(user, "ach_006"):
        achievement = get_achievement_details("ach_006")
        new_achievements.append(achievement)

    
    if new_achievements:
        update_user_achievements(mongo_id, new_achievements)

    return new_achievements

def check_achievements_after_rank_update(mongo_id, new_rank):
    
    user = get_user_from_db(mongo_id)
    if not user:
        raise ValueError("User not found")

    new_achievements = []

    # Achievement: Rank Up (Reached the rank of Genin)
    if new_rank == "Chunin" and not has_achievement(user, "ach_007"):
        achievement = get_achievement_details("ach_007")
        new_achievements.append(achievement)

    # Update the user's achievements if any new ones were earned
    if new_achievements:
        update_user_achievements(mongo_id, new_achievements)

    return new_achievements