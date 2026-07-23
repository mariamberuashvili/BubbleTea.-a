from typing import Optional
from pydantic import BaseModel

class TeaCreate(BaseModel):
    name: str
    temperature: float
    price: float
    stock: bool


class TeaRead(BaseModel):
    id: int
    name: str
    temperature: Optional[float]
    price: Optional[float]
    stock: bool

    class Config:
        from_attributes = True