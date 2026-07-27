import os
import json
import firebase_admin
from firebase_admin import credentials, auth

if not firebase_admin._apps:
    firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")

    if firebase_json:
        # Render: lee el JSON desde la variable de entorno
        cred = credentials.Certificate(json.loads(firebase_json))
    else:
        # Local: lee el archivo
        cred = credentials.Certificate("secrets/serviceAccountKey.json")

    firebase_admin.initialize_app(cred)


def verify_firebase_token(token: str):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        return None
