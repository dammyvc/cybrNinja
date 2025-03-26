import jwt
import requests
from functools import wraps
from flask import request, jsonify
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from .config import Config
from utils.logger import get_logger

app_logger = get_logger()

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        app_logger.debug(f"Authorization header: {auth_header}")
    
        if not auth_header:
            app_logger.error("No authorization token provided")
            return jsonify({"error": "No authorization token provided"}), 401

        parts = auth_header.split()
        if parts[0].lower() != "bearer" or len(parts) != 2:
            app_logger.error("Invalid authorization header format")
            return jsonify({"error": "Invalid authorization header"}), 401

        token = parts[1]
        app_logger.debug(f"Received token: {token}")  # Log full token
        jwks_url = f"https://{Config.AUTH0_DOMAIN}/.well-known/jwks.json"
        app_logger.debug(f"Fetching JWKS from: {jwks_url}")
    
        try:
            response = requests.get(jwks_url, timeout=10)
            response.raise_for_status()
            jwks = response.json()
            app_logger.debug(f"JWKS fetched: {jwks}")
            unverified_header = jwt.get_unverified_header(token)
            app_logger.debug(f"Unverified header: {unverified_header}")

            kid = unverified_header.get("kid")
            if not kid:
                app_logger.error("Token has no 'kid' in header")
                return jsonify({"error": "Invalid token: No 'kid' in header"}), 401

            # Find matching key by kid
            rsa_key = next(
                (key for key in jwks["keys"] if key["kid"] == kid),
                None
            )
            if not rsa_key:
                app_logger.error(f"No matching key found for kid: {kid}")
                return jsonify({"error": f"Invalid token: 'kid' {kid} not found in JWKS"}), 401

            # Convert to PEM
            public_key = serialization.load_pem_public_key(
                jwt.algorithms.RSAAlgorithm.from_jwk(rsa_key).public_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PublicFormat.SubjectPublicKeyInfo
                ),
                backend=default_backend()
            )
            pem_key = public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
            app_logger.debug(f"PEM key: {pem_key.decode('utf-8')}")

            payload = jwt.decode(
                token,
                pem_key,
                algorithms=["RS256"],
                audience=Config.AUTH0_API_AUDIENCE,
                issuer=Config.AUTH0_ISSUER,
            )
            app_logger.debug(f"Decoded payload: {payload}")
        except Exception as e:
            app_logger.error(f"Token validation failed: {str(e)}")
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401

        request.user = payload
        return f(*args, **kwargs)
    return decorated
