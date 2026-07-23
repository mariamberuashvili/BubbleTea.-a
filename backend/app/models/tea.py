from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Tea(Base):
    __tablename__ = "teas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    temperature = Column("temperatura", Integer, nullable=True)
    price = Column("precio", Integer, nullable=True)
    stock = Column("active", Boolean, default=True)