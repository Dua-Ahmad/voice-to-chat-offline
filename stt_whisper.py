import whisper
import os

# Load the model once at startup (small for speed; medium or large for accuracy)
_model = whisper.load_model("small")

def transcribe_audio(audio_path: str) -> str:
    """
    Transcribes an audio file and returns the recognized text.
    Works offline using OpenAI Whisper models.
    """
    if not os.path.exists(audio_path):
        return "Error: file not found."

    result = _model.transcribe(audio_path, fp16=False)
    text = result.get("text", "").strip()
    return text if text else "(no speech detected)"
