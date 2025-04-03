import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

# Load environment variables
load_dotenv()

class Config:
    # MongoDB configuration
    MONGO_URI = os.getenv("MONGO_URI")
    
    # Auth0 configuration
    AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
    AUTH0_API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE")
    AUTH0_ISSUER = f"https://{AUTH0_DOMAIN}/"

    #OPENAI Setup
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    #CLOUDINARY
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True
    )
