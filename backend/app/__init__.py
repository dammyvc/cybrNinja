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
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    CORS(app, resources={r"/api/*": {"origins": frontend_url}})

    # Initialize MongoDB and OpenAI
    init_app(app)
    app.openai_client = OpenAI(api_key=app.config["OPENAI_API_KEY"])

    # Register blueprints
    app.register_blueprint(routes_bp)
    app.register_blueprint(quiz_bp, url_prefix="/api")

    return app