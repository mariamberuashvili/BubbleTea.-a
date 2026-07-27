import os
import json
import firebase_admin
from firebase_admin import credentials, auth

if not firebase_admin._apps:
    if os.getenv("FIREBASE_SERVICE_ACCOUNT"):
        # Producción (Render)
        firebase_key = json.loads(os.environ["FIREBASE_SERVICE_ACCOUNT"])
        cred = credentials.Certificate(firebase_key)
    else:
        # Desarrollo local
        cred = credentials.Certificate("backend/secrets/serviceAccountKey.json")

    firebase_admin.initialize_app(cred)


def verify_firebase_token(token: str):
    try:
        return auth.verify_id_token(token)
    except Exception:
        return None