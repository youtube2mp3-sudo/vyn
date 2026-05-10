"""
access_manager.py

Token management system for YouTube Audio Converter API.
Handles token-based authentication, expiration, and cleanup of downloaded audio files.
"""

import time
from datetime import datetime, timedelta
from pathlib import Path
from constants import EXPIRY_TIME_MINUTES, ABS_DOWNLOADS_PATH

# Active tokens
allowed_tokens: dict[str, datetime] = {}

# Token → filename mapping
audio_files: dict[str, str] = {}


def add_token(token: str, filename: str) -> None:
    expiry = datetime.now() + timedelta(minutes=EXPIRY_TIME_MINUTES)
    allowed_tokens[token] = expiry
    audio_files[token] = filename


def has_access(token: str) -> bool:
    return token in allowed_tokens


def is_valid(token: str) -> bool:
    expiry = allowed_tokens.get(token)
    if not expiry:
        return False
    return expiry >= datetime.now()


def get_audio_file(token: str) -> str | None:
    return audio_files.get(token)


def remove_expired_tokens() -> list[str]:
    expired_files = []

    for token in list(allowed_tokens.keys()):
        if not is_valid(token):
            allowed_tokens.pop(token, None)
            file = audio_files.pop(token, None)
            if file:
                expired_files.append(file)

    return expired_files


def delete_expired_files(files: list[str]) -> None:
    for file in files:
        try:
            full_path = Path(ABS_DOWNLOADS_PATH) / file
            full_path.unlink(missing_ok=True)
        except Exception as e:
            print(f"[cleanup] Failed deleting {file}: {e}")


def manage_tokens() -> None:
    while True:
        expired_files = remove_expired_tokens()
        delete_expired_files(expired_files)
        time.sleep(5)
