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