import os
import json
import firebase_admin
from firebase_admin import credentials

if not firebase_admin._apps:
    firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")

    if firebase_json:
        cred = credentials.Certificate(json.loads(firebase_json))
    else:
        cred = credentials.Certificate("backend/secrets/serviceAccountKey.json")

    firebase_admin.initialize_app(cred)