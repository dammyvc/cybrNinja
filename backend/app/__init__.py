from flask import Flask
from flask_cors import CORS
from .config import Config
from .models import mongo, init_app
from .routes import app as routes_bp, quiz_bp
from openai import OpenAI
from azure.storage.blob import BlobServiceClient


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for Next.js origin
    CORS(app, resources={r"/api/*": {"origins": "https://cybr-ninja.vercel.app/"}})

    # Initialize MongoDB and OpenAI
    init_app(app)
    app.openai_client = OpenAI(api_key=app.config["OPENAI_API_KEY"])

    #AZURE
    connection_string = f"DefaultEndpointsProtocol=https;AccountName={app.config['AZURE_STORAGE_ACCOUNT_NAME']};AccountKey={app.config['AZURE_STORAGE_KEY']};EndpointSuffix=core.windows.net"
    app.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    app.container_name = app.config["AZURE_CONTAINER_NAME"]

    # Register blueprints
    app.register_blueprint(routes_bp)
    app.register_blueprint(quiz_bp, url_prefix="/api")

    return app