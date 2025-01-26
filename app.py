from flask import Flask, request, jsonify, send_file, render_template
import os
from tts import BarkTTS
import uuid
import logging
from werkzeug.utils import secure_filename
import time

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Bark TTS with CPU
tts = BarkTTS(use_gpu=False)

# Configure upload folder for audio files
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'generated_audio')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Route for main page
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/voices', methods=['GET'])
def get_voices():
    """Return available voice presets"""
    try:
        voices = [
            {"id": "v2/en_speaker_0", "name": "English Speaker 0"},
            {"id": "v2/en_speaker_1", "name": "English Speaker 1"},
            {"id": "v2/en_speaker_2", "name": "English Speaker 2"},
            {"id": "v2/en_speaker_3", "name": "English Speaker 3"},
            {"id": "v2/en_speaker_4", "name": "English Speaker 4"},
            {"id": "v2/en_speaker_5", "name": "English Speaker 5"},
            {"id": "v2/en_speaker_6", "name": "English Speaker 6"},
            {"id": "v2/en_speaker_7", "name": "English Speaker 7"},
            {"id": "v2/en_speaker_8", "name": "English Speaker 8"},
            {"id": "v2/en_speaker_9", "name": "English Speaker 9"},
        ]
        return jsonify(voices)
    except Exception as e:
        logger.error(f"Error getting voices: {str(e)}")
        return jsonify({'error': 'Failed to get voices'}), 500

@app.route('/api/generate-audio', methods=['POST'])
def generate_audio():
    """Generate audio from text using Bark"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        text = data.get('text')
        voice_id = data.get('voice_id', 'v2/en_speaker_0')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        if len(text) > 1000:
            return jsonify({'error': 'Text too long. Maximum 1000 characters allowed.'}), 400

        # Generate unique filename with secure filename
        filename = secure_filename(f"{uuid.uuid4()}.wav")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        logger.info(f"Generating audio for text: {text[:50]}...")
        
        # Generate audio
        tts.generate_audio(text, voice_id, filepath)

        # Return audio file URL
        audio_url = f"/static/generated_audio/{filename}"
        
        logger.info(f"Audio generated successfully: {filename}")
        
        return jsonify({
            'message': 'Audio generated successfully',
            'audioUrl': audio_url
        })

    except Exception as e:
        logger.error(f"Error generating audio: {str(e)}")
        return jsonify({'error': 'Failed to generate audio. Please try again.'}), 500

@app.route('/api/delete-audio/<filename>', methods=['DELETE'])
def delete_audio(filename):
    """Delete a specific audio file"""
    try:
        filename = secure_filename(filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if os.path.exists(filepath):
            os.remove(filepath)
            logger.info(f"Deleted audio file: {filename}")
            return jsonify({'message': 'File deleted successfully'})
        else:
            return jsonify({'error': 'File not found'}), 404
            
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        return jsonify({'error': 'Failed to delete file'}), 500

def cleanup_old_files():
    """Remove audio files older than 1 hour"""
    try:
        current_time = time.time()
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if os.path.getmtime(filepath) < current_time - 3600:  # 1 hour
                os.remove(filepath)
    except Exception as e:
        logger.error(f"Error cleaning up files: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
