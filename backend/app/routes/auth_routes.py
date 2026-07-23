import os
import json
import urllib.request
import urllib.error

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from firebase_admin import auth as firebase_auth

from app.database import get_db
from app.models.user import User
from app.firebase_admin import verify_firebase_token
from app.dependencies import require_admin_user

from app.schemas.auth_schemas import AuthRegister as RegisterRequest, AuthLogin as LoginRequest


class SetAdminRequest(BaseModel):
    email: str


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    try:
        
        user = firebase_auth.create_user(
            email=data.email,
            password=data.password,
            display_name=f"{data.name} {data.surname}"
        )

          
        new_user = User(
    id=user.uid,
    name=data.name,
    surname=data.surname,
    email=data.email,
    role="user"
)

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        
        firebase_auth.set_custom_user_claims(user.uid, {"admin": False})

        return {
            "uid": user.uid,
            "email": user.email
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/login")
def login(data: LoginRequest):

    api_key = os.getenv("FIREBASE_API_KEY")

    if not api_key:
        raise HTTPException(status_code=500, detail="Missing API KEY")

    body = {
        "email": data.email,
        "password": data.password,
        "returnSecureToken": True
    }

    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"

    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req) as res:
            result = json.loads(res.read().decode("utf-8"))

    except urllib.error.HTTPError as e:
        try:
            error_body = json.loads(e.read().decode("utf-8"))
            reason = error_body.get("error", {}).get("message", "INVALID_CREDENTIALS")
        except Exception:
            reason = "INVALID_CREDENTIALS"
        raise HTTPException(status_code=401, detail=f"Login fallido: {reason}")

    except urllib.error.URLError as e:
    
        raise HTTPException(status_code=502, detail=f"No se pudo conectar con Firebase: {e.reason}")

    token = result["idToken"]

   
    is_admin = False
    try:
        decoded = verify_firebase_token(token)
        is_admin = bool(decoded.get("admin", False))
    except Exception as e:
        print("⚠️  No se pudo verificar el token en login (se continúa como usuario):", e)

    return {
        "access_token": token,
        "email": result["email"],
        "is_admin": is_admin
    }



@router.post("/set-admin")
def set_admin(data: SetAdminRequest, _admin: dict = Depends(require_admin_user)):

    try:
        user = firebase_auth.get_user_by_email(data.email)

        firebase_auth.set_custom_user_claims(user.uid, {
            "admin": True
        })

        return {"message": "Admin asignado correctamente"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))