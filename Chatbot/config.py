"""Configuração do serviço de chatbot, lida de variáveis de ambiente.

Em desenvolvimento, as variáveis podem vir de um arquivo `.env` (ver
`.env.example`), carregado automaticamente via python-dotenv.
"""
import os

from dotenv import load_dotenv

load_dotenv()

# URL base da API .NET. Em Docker, aponte para o nome do serviço (ex.: http://backend:8080/api).
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5271/api")

# Timeout (segundos) para chamadas HTTP à API — evita pendurar a thread do Flask.
REQUEST_TIMEOUT = float(os.getenv("REQUEST_TIMEOUT", "5"))

# Servidor.
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "5000"))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"

# CORS: "*" para qualquer origem, ou lista separada por vírgula.
_cors = os.getenv("CORS_ORIGINS", "*").strip()
CORS_ORIGINS = "*" if _cors == "*" else [o.strip() for o in _cors.split(",") if o.strip()]
