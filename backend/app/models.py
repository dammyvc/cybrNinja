from flask import current_app
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

mongo = PyMongo()  # Keep this, but initialize it later with the app

def get_user_from_db(mongo_id):
    try:
        user = mongo.db.users.find_one(
            {"_id": ObjectId(mongo_id)},
            {"_id": 0, "username": 1, "email": 1, "avatar": 1}
        )
    except Exception as e:
        current_app.logger.error(f"Invalid MongoDB ID: {str(e)}")
        return None
    return user