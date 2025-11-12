from flask import Flask, render_template, request, jsonify
import os
from stt_whisper import transcribe_audio
from tts_coqui import speak_text

app = Flask(__name__, static_folder="static", template_folder="templates")

# Ensure folders exist
os.makedirs("static/uploads", exist_ok=True)
os.makedirs("static/audio", exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

# 🎙 Handle microphone recording -> Whisper
@app.route("/transcribe", methods=["POST"])
def transcribe():
    file = request.files.get("audio")
    if not file:
        return jsonify({"error": "No audio file received"}), 400

    save_path = os.path.join("static/uploads", file.filename)
    file.save(save_path)

    text = transcribe_audio(save_path)
    return jsonify({"text": text})

# 🔊 Handle text -> Coqui TTS -> audio playback
@app.route("/speak", methods=["POST"])
def speak():
    data = request.get_json()
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "No text provided"}), 400
    audio_url = speak_text(text)
    return jsonify({"audio_url": audio_url})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
