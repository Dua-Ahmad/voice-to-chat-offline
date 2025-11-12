const recordBtn = document.getElementById('recordBtn');
const speakBtn = document.getElementById('speakBtn');
const textInput = document.getElementById('textInput');
const transcription = document.getElementById('transcription');

let mediaRecorder;
let audioChunks = [];

// ✅ Load available voices early (important for Chrome)
window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};

// 🎙 Record button
recordBtn.addEventListener('click', async () => {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      audioChunks = [];

      mediaRecorder.addEventListener('dataavailable', e => {
        audioChunks.push(e.data);
      });

      mediaRecorder.addEventListener('stop', async () => {
        const blob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');

        const response = await fetch('/transcribe', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (data.text) {
         // transcription.innerText = data.text;
          textInput.value = data.text;
        } else {
          transcription.innerText = '❌ No transcription received.';
        }
      });

      recordBtn.innerText = '⏹ Stop';
    } catch (err) {
      console.error('Mic access error:', err);
      alert('Microphone access denied.');
    }
  } else if (mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    recordBtn.innerText = '🎙 Record';
  }
});

speakBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (!text) {
    alert('Please type or record something first.');
    return;
  }

  // Create the utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // === Voice settings ===
  utterance.lang = 'en-US';   // or 'en-AU', 'en-GB', etc.
  utterance.rate = 1.2;       // slightly faster (1.0 = normal)
  utterance.pitch = 1.0;      // normal tone

  // Try to pick a female voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const femaleVoice = voices.find(v =>
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('susan') ||
      v.name.toLowerCase().includes('zira') ||    // common Windows voice
      v.name.toLowerCase().includes('karen') ||   // common macOS/AU voice
      v.name.toLowerCase().includes('emma')
    );
    utterance.voice = femaleVoice || voices[0];
  }

  // Cancel any current speech and speak
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
});

