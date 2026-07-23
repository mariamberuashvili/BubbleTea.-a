import os
from dotenv import load_dotenv


load_dotenv()


print("\n" + "="*30)
print("🔥 DIAGNÓSTICO DE INICIO")
print("FIREBASE_API_KEY DETECTADA:", os.getenv("FIREBASE_API_KEY"))
print("="*30 + "\n")


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base


from app.routes import tea_routes, user_routes, auth_routes

app = FastAPI()


default_origins = ["http://localhost:4200", "http://127.0.0.1:4200"]
extra_origins = os.getenv("CORS_ORIGINS", "")
allow_origins = default_origins + [o.strip() for o in extra_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router) 
app.include_router(tea_routes.router)
app.include_router(user_routes.router)

@app.get("/")
def root():
    return {"message": "API conectada a Aiven MySQL"}