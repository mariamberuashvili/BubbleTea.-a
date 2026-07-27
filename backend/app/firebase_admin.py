import os
import json
from firebase_admin import credentials, initialize_app

# 1. Intentar leer las credenciales desde una variable de entorno (Render)
firebase_json_env = os.getenv("FIREBASE_CREDENTIALS_JSON")

if firebase_json_env:
    # Cargar el diccionario directamente desde el string JSON
    cred_dict = json.loads(firebase_json_env)
    cred = credentials.Certificate(cred_dict)
else:
    # 2. Si no hay variable, usar el archivo local (Desarrollo local)
    cred = credentials.Certificate("secrets/serviceAccountKey.json")

initialize_app(cred)