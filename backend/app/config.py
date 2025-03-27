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