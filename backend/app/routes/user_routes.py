from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.dependencies import verify_token
from app.schemas.user_schemas import UserBase


router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(verify_token)]
)



@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()



@router.get("/firebase/{user_id}")
def get_user_by_firebase(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/{user_id}")
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

