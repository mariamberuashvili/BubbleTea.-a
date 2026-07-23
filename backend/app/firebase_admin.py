import os
from pathlib import Path
import firebase_admin
from firebase_admin import auth, credentials

BASE_DIR = Path(__file__).resolve().parent.parent

SERVICE_ACCOUNT_PATH = os.getenv(
    "FIREBASE_SERVICE_ACCOUNT_PATH",
    os.getenv(
        "GOOGLE_APPLICATION_CREDENTIALS",
        str(BASE_DIR / "secrets/serviceAccountKey.json")
    )
)

SERVICE_ACCOUNT_PATH = Path(SERVICE_ACCOUNT_PATH)

if not firebase_admin._apps:
    if not SERVICE_ACCOUNT_PATH.exists():
        raise FileNotFoundError(
            f"Firebase service account file not found: {SERVICE_ACCOUNT_PATH}"
        )

    cred = credentials.Certificate(str(SERVICE_ACCOUNT_PATH))
    firebase_admin.initialize_app(cred)


def verify_firebase_token(id_token: str) -> dict:
    return auth.verify_id_token(id_token)