🎙️ Offline Voice-to-Chat Web App

Full Offline Speech-to-Text (STT) + Text-to-Speech (TTS)
Built with Flask, OpenAI Whisper, and Coqui-TTS — wrapped in a clean, responsive browser interface.

🧠 Overview

This project turns your local computer into a self-contained voice assistant interface.
It captures your voice through the browser, transcribes it with an offline Whisper model, and replies with realistic speech synthesized locally via Coqui TTS — without an internet connection.

⚙️ Architecture
Browser (HTML/JS) ─► Flask API ─► Whisper STT (Python)
                ◄── Flask API ◄── Coqui TTS (Python)

Components
Layer	File	Purpose
Frontend UI	templates/index.html, static/script.js, static/style.css	Voice recording, playback, and display
Backend App	app.py	Flask server managing /transcribe and /speak routes
STT Module	stt_whisper.py	Uses OpenAI Whisper for offline speech-to-text
TTS Module	tts_coqui.py	Uses Coqui TTS for neural text-to-speech
Dependencies	requirements.txt	Python packages (Flask, TTS, Whisper, etc.)
Deployment	Dockerfile, commands-to-run.txt	Container build and run commands
🧩 Model Details
🗣️ Speech-to-Text (STT)
Feature	Description
Model	openai-whisper
File	stt_whisper.py

Architecture	Transformer-based encoder-decoder
Loaded size	small (≈ 500 MB)
Offline	✅ Yes — runs locally via PyTorch
Function	transcribe_audio(path) loads the model once, processes .wav files, and returns clean text.

Example:

import whisper
model = whisper.load_model("small")
text = model.transcribe("sample.wav")["text"]


📌 You can swap small for base, medium, or large in stt_whisper.py depending on hardware.

🔊 Text-to-Speech (TTS)
Feature	Description
Model	tts_models/en/ljspeech/tacotron2-DDC
File	tts_coqui.py

Architecture	Tacotron 2 + DDC vocoder
Offline	✅ Yes
Function	speak_text(text) generates a .wav file under /static/audio/.

Example:

from TTS.api import TTS
tts = TTS("tts_models/en/ljspeech/tacotron2-DDC")
tts.tts_to_file("Hello there!", "output.wav")


Alternative multilingual model:

TTS("tts_models/multilingual/multi-dataset/your_tts")

🧱 Project Setup
1️⃣ Clone repository
git clone https://gitlab.com/<your-username>/voice-to-chat-offline.git
cd voice-to-chat-offline

2️⃣ Install dependencies
pip install -r requirements.txt


Requirements include:

flask
sounddevice
simpleaudio
scipy
TTS
openai-whisper

3️⃣ Run locally
python app.py


Then open: http://localhost:5000

🐳 Run via Docker

Build and start the container:

docker build --no-cache -t voice-web-app .
docker run -it -p 5000:5000 voice-web-app


Open your browser at: http://localhost:5000

🪄 Using the App

Open the web page.

Click 🎙 Record — speak a short phrase.

When you stop, Whisper transcribes it locally.

Click 🔊 Speak — Coqui TTS generates and plays back audio of your text.

Everything happens offline; no API calls or cloud dependencies.

🧠 Model Selection Guide
Goal	STT Model	TTS Model	Why
💨 Fast on CPU	Whisper tiny	Coqui DDC	Lightweight setup
🧏 Accurate & clear	Whisper small	Coqui DDC	Balanced accuracy
🔊 Natural voice	Whisper small	Coqui YourTTS	Expressive multilingual
🖥 GPU system	Whisper medium / large	Coqui Glow-TTS	Studio-quality
🧰 Folder Structure
voice-to-chat-offline/
│
├── app.py                 # Flask app (routes)
├── stt_whisper.py         # Whisper transcription
├── tts_coqui.py           # Coqui TTS synthesis
├── requirements.txt       # Dependencies
├── Dockerfile             # Container config
├── commands-to-run.txt    # Helper commands
├── templates/
│   └── index.html         # Web interface
└── static/
    ├── script.js
    ├── style.css
    ├── uploads/
    └── audio/

🧠 Example API Workflow

/transcribe
POST .wav → JSON text

{ "text": "hello world" }


/speak
POST JSON text → generated output.wav

{ "audio_url": "/static/audio/output.wav" }

🌍 Offline Behavior

🧱 No external API calls — all inference happens locally.

💾 Models cached after first run.

🔐 Privacy-preserving — voice data never leaves your machine.

🔮 Future Enhancements

Multilingual STT/TTS pairing

Voice selector dropdown in UI

Real-time transcription with Whisper streaming

Electron desktop packaging


💡 Acknowledgements

OpenAI Whisper

Coqui TTS

Flask

Mozilla TTS Models