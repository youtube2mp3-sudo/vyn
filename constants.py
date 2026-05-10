"""
constants.py

Central configuration module for YouTube Audio Converter API.
"""

from pathlib import Path

# --- Directories ---
ROOT_DIRECTORY = Path(__file__).resolve().parent
DOWNLOADS_DIRECTORY = "downloads"
ABS_DOWNLOADS_PATH = ROOT_DIRECTORY / DOWNLOADS_DIRECTORY

# Ensure downloads folder exists
ABS_DOWNLOADS_PATH.mkdir(exist_ok=True)

# --- HTTP Status Codes ---
REQUEST_TIMEOUT = 408
UNAUTHORIZED = 401
NOT_FOUND = 404
BAD_REQUEST = 400
INTERNAL_SERVER_ERROR = 500

# --- Token Settings ---
EXPIRY_TIME_MINUTES = 5
TOKEN_LENGTH = 32
