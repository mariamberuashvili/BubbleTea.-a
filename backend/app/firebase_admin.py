import os
import json
import firebase_admin
from firebase_admin import credentials

# 1. Intentar leer desde la variable de entorno de Render
firebase_json_env = os.getenv("FIREBASE_CREDENTIALS_JSON")

if firebase_json_env:
    # Cargar las credenciales directamente desde el texto JSON
    cred_dict = json.loads(firebase_json_env)
    cred = credentials.Certificate(cred_dict)
else:
    # Respaldo para cuando desarrollas de manera local en tu PC
    cred = credentials.Certificate("secrets/serviceAccountKey.json")

firebase_admin.initialize_app(cred)