from pydantic import BaseModel


class AuthRegister(BaseModel):
    name: str
    surname: str
    email: str
    password: str


class AuthLogin(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    expires_in: str
    email: str
    is_admin: bool
