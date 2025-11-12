FROM python:3.10

# Avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app
COPY . /app

# Install compiler + audio dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libasound2-dev \
    libportaudio2 \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
CMD ["python", "app.py"]
