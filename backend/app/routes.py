from flask import Blueprint, jsonify, request
from .auth import requires_auth
from .models import get_user_from_db
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
        print(mongo_id_str)  # "67dcc4ceab5ee09091dedaa5"
        mongo_id = ObjectId(mongo_id_str)
        print(mongo_id)  # Convert to ObjectId
    except (IndexError, ValueError) as e:
        app_logger.error(f"Invalid sub format or ObjectId: {payload['sub']} - {str(e)}")
        return jsonify({"error": "Invalid user ID format"}), 400
    
    app_logger.debug(f"Querying MongoDB with _id: {mongo_id}")
    user = get_user_from_db(mongo_id)
    if not user:
        app_logger.warning(f"User not found for _id: {mongo_id}")
        return jsonify({"error": "User not found"}), 404
    return jsonify(user)
