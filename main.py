"""
main.py
YouTube Audio Converter API
Modern Flask implementation using yt-dlp + FFmpeg
"""

import secrets
import threading
from uuid import uuid4
from pathlib import Path

from flask import Flask, request, jsonify, send_file
import yt_dlp

import access_manager
from constants import *

app = Flask(__name__)


@app.route("/", methods=["GET"])
def handle_audio_request():
    video_url = request.args.get("url")

    if not video_url:
        return jsonify(error="Missing 'url' parameter."), BAD_REQUEST

    filename = f"{uuid4()}.mp3"
    output_path = ABS_DOWNLOADS_PATH / filename

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": str(output_path),
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }
        ],
        "quiet": True,
        "noplaylist": True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])
    except Exception as e:
        return (
            jsonify(
                error="Failed to download or convert audio.",
                detail=str(e),
            ),
            INTERNAL_SERVER_ERROR,
        )

    return _generate_token_response(filename)


@app.route("/download", methods=["GET"])
def download_audio():
    token = request.args.get("token")

    if not token:
        return jsonify(error="Missing 'token' parameter."), BAD_REQUEST

    if not access_manager.has_access(token):
        return jsonify(error="Invalid token."), UNAUTHORIZED

    if not access_manager.is_valid(token):
        return jsonify(error="Token expired."), REQUEST_TIMEOUT

    filename = access_manager.get_audio_file(token)

    if not filename:
        return jsonify(error="File mapping missing."), NOT_FOUND

    file_path = ABS_DOWNLOADS_PATH / filename

    if not file_path.exists():
        return jsonify(error="File not found."), NOT_FOUND

    return send_file(file_path, as_attachment=True)


def _generate_token_response(filename: str):
    token = secrets.token_urlsafe(TOKEN_LENGTH)
    access_manager.add_token(token, filename)
    return jsonify(token=token)


def main():
    cleaner_thread = threading.Thread(
        target=access_manager.manage_tokens,
        daemon=True,
    )
    cleaner_thread.start()

    app.run(host="0.0.0.0", port=5000, debug=True)


if __name__ == "__main__":
    main()
