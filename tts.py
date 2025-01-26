import torch
from bark import SAMPLE_RATE, generate_audio, preload_models
import numpy as np
from scipy.io.wavfile import write
import logging

logger = logging.getLogger(__name__)

class BarkTTS:
    def __init__(self, use_gpu=False):
        """
        Initialize Bark TTS and preload models
        
        Args:
            use_gpu (bool): Whether to use GPU for inference
        """
        logger.info("Initializing Bark TTS...")
        
        # Set device
        self.device = "cuda" if use_gpu and torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")
        
        # Set torch device
        torch.device(self.device)
        
        try:
            logger.info("Loading Bark models...")
            preload_models()
            logger.info("Models loaded successfully!")
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            raise

    def generate_audio(self, text, voice_id, output_path):
        """
        Generate audio from text using Bark
        
        Args:
            text (str): Text to convert to speech
            voice_id (str): Voice preset to use
            output_path (str): Path to save the generated audio file
        """
        try:
            logger.info(f"Generating audio for voice {voice_id}")
            
            # Split long text into sentences (simple split, you might want to use nltk for better splitting)
            sentences = text.split('. ')
            audio_arrays = []
            
            # Generate audio for each sentence
            for sentence in sentences:
                if sentence.strip():
                    audio_array = generate_audio(
                        sentence.strip() + '.',
                        history_prompt=voice_id
                    )
                    audio_arrays.append(audio_array)
            
            # Concatenate all audio arrays
            final_audio = np.concatenate(audio_arrays)
            
            # Normalize audio
            final_audio = np.clip(final_audio, -1, 1)
            
            # Save audio file
            write(output_path, SAMPLE_RATE, final_audio)
            
            logger.info(f"Audio saved to {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error generating audio: {str(e)}")
            raise

    def _normalize_audio(self, audio_array):
        """Normalize audio array to prevent clipping"""
        max_value = np.max(np.abs(audio_array))
        if max_value > 1.0:
            audio_array = audio_array / max_value
        return audio_array
