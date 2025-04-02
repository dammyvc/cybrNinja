from flask import Flask
from flask_cors import CORS
from .config import Config
from .models import mongo, init_app
from .routes import app as routes_bp, quiz_bp
from openai import OpenAI


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for Next.js origin
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    # Initialize MongoDB and OpenAI
    init_app(app)
    app.openai_client = OpenAI(api_key=app.config["OPENAI_API_KEY"])

    # Register blueprints
    app.register_blueprint(routes_bp)
    app.register_blueprint(quiz_bp, url_prefix="/api")

    return app