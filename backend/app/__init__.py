# from flask import Flask
# from flask_pymongo import PyMongo
# from .config import Config
# from flask_cors import CORS
# from .routes import app as routes_app  # Import the blueprint from routes

# # Initialize the app
# app = Flask(__name__)

# # Set up MongoDB and Auth0
# app.config.from_object(Config)
# mongo = PyMongo(app)
# CORS(app)

# # Register blueprint for routes
# app.register_blueprint(routes_app)

# # Return the app instance
# def create_app():
#     return app

from flask import Flask
from flask_cors import CORS
from .config import Config
from .models import mongo
from .routes import app as routes_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    mongo.init_app(app)
    
    # Enable CORS for Next.js origin
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    
    app.register_blueprint(routes_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)