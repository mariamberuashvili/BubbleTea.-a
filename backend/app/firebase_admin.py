import os
import json
import firebase_admin
from firebase_admin import auth, credentials

SERVICE_ACCOUNT_PATH = os.path.join(
    os.path.dirname(__file__), "..", "secrets", "serviceAccountKey.json"
)

if not firebase_admin._apps:
    firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")

    if firebase_json:
        cred_dict = json.loads(firebase_json)
        cred = credentials.Certificate(cred_dict)
    elif os.path.exists(SERVICE_ACCOUNT_PATH):
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    else:
        raise Exception(
            "Firebase no configurado: falta FIREBASE_SERVICE_ACCOUNT o el archivo "
            f"{SERVICE_ACCOUNT_PATH}"
        )

    firebase_admin.initialize_app(cred)


def verify_firebase_token(id_token: str) -> dict:
    return auth.verify_id_token(id_token)