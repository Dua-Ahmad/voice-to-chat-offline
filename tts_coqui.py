import os
from TTS.api import TTS

# ✅ Load multilingual model (offline-friendly)
# You can use English-only model instead: "tts_models/en/ljspeech/tacotron2-DDC"
#tts = TTS("tts_models/multilingual/multi-dataset/your_tts", progress_bar=False, gpu=False)
tts = TTS("tts_models/en/ljspeech/tacotron2-DDC")

def speak_text(text):
    os.makedirs("static/audio", exist_ok=True)
    output_path = os.path.join("static/audio", "output.wav")
    
    # Generate the speech
    tts.tts_to_file(text=text, file_path=output_path)
    
    # Flask expects a web path (not filesystem)
    return f"/{output_path.replace(os.sep, '/')}"
