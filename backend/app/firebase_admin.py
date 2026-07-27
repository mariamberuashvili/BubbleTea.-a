import os
import json
import firebase_admin
from firebase_admin import credentials, auth

if not firebase_admin._apps:
    # 1. Busca 'FIREBASE_SERVICE_ACCOUNT' o 'FIREBASE_CREDENTIALS_JSON' por si acaso
    firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT") or os.getenv("FIREBASE_CREDENTIALS_JSON")

    if firebase_json:
        # Render: lee la cadena JSON directamente desde la variable de entorno
        cred_dict = json.loads(firebase_json)
        cred = credentials.Certificate(cred_dict)
    else:
        # Local: usa el archivo local si existe
        cred_file = "secrets/serviceAccountKey.json"
        if os.path.exists(cred_file):
            cred = credentials.Certificate(cred_file)
        else:
            raise FileNotFoundError(
                "No se encontraron credenciales de Firebase en las variables de entorno "
                f"ni en el archivo local '{cred_file}'."
            )

    firebase_admin.initialize_app(cred)


def verify_firebase_token(token: str):
    """Verifica un token JWT de Firebase y devuelve el payload decodificado."""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        # Puedes imprimir el error en los logs de Render para depurar si falla la verificación
        print(f"Error verificando el token de Firebase: {e}")
        return None