from sqlalchemy import Column, String
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(128), primary_key=True) 
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    role = Column(String(20), default="user")