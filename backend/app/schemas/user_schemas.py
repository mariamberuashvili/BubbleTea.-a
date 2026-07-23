from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    surname: str
    email: str