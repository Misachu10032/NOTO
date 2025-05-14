import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API configuration
API_PREFIX = '/api'
DEBUG = True
PORT = 5000

# OpenAI configuration
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_MODEL = "gpt-3.5-turbo"

# Database configuration
NOTES_FILE = "notes.json"
