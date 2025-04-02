import os
from dotenv import load_dotenv

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

    #AZURE SETUP
    AZURE_STORAGE_ACCOUNT_NAME = os.getenv("AZURE_STORAGE_ACCOUNT_NAME")
    AZURE_STORAGE_KEY = os.getenv("AZURE_STORAGE_KEY")
    AZURE_CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME", "avatars")