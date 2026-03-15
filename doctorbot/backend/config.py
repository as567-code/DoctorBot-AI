import os
from dotenv import load_dotenv

load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY environment variable is required")

PORT = int(os.getenv("PORT", "8000"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
MISTRAL_MODEL = "mistral-large-latest"
MISTRAL_TEMPERATURE = 0.8
MISTRAL_MAX_TOKENS = 500
MAX_HISTORY_MESSAGES = 20
