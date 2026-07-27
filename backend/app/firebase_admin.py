import os
import json
import firebase_admin
from firebase_admin import auth, credentials


if not firebase_admin._apps:
    firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")

    if not firebase_json:
        raise Exception("FIREBASE_SERVICE_ACCOUNT no configurado")

    cred_dict = json.loads(firebase_json)

    cred = credentials.Certificate(cred_dict)

    firebase_admin.initialize_app(cred)


def verify_firebase_token(id_token: str) -> dict:
    return auth.verify_id_token(id_token)