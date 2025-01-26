// script.js
class AudioHistoryManager {
    constructor(maxItems = 10) {
        this.maxItems = maxItems;
        this.history = [];
        this.loadHistory();
    }

    addToHistory(text, audioUrl, voiceName) {
        if (!text || !audioUrl) return;

        const historyItem = {
            id: Date.now(),
            text: this.truncateText(text, 50),
            audioUrl,
            voiceName,
            timestamp: new Date().toLocaleString()
        };

        this.history.unshift(historyItem);
        if (this.history.length > this.maxItems) {
            this.history.pop();
        }

        this.saveHistory();
        this.updateHistoryUI();
    }

    truncateText(text, maxLength) {
        return text.length > maxLength 
            ? text.substring(0, maxLength) + '...' 
            : text;
    }

    updateHistoryUI() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        historyList.innerHTML = this.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-content" onclick="audioHistoryManager.loadHistoryItem('${item.audioUrl}')">
                    <div class="history-text">${item.text}</div>
                    <div class="history-meta">
                        <span class="history-voice">${item.voiceName}</span>
                        <span class="history-time">${item.timestamp}</span>
                    </div>
                </div>
                <button class="delete-history-btn" onclick="audioHistoryManager.deleteHistoryItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    loadHistoryItem(audioUrl) {
        const audioPlayer = document.getElementById('audioPlayer');
        const audioPlayerContainer = document.getElementById('audioPlayerContainer');
        
        if (audioPlayer && audioPlayerContainer && audioUrl) {
            audioPlayer.src = audioUrl;
            audioPlayerContainer.style.display = 'block';
            audioPlayer.play().catch(console.error);
        }

        toggleMenu();
    }

    saveHistory() {
        localStorage.setItem('audioHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('audioHistory');
        if (saved) {
            try {
                this.history = JSON.parse(saved);
                this.updateHistoryUI();
            } catch (error) {
                console.error('Error loading history:', error);
                this.history = [];
                localStorage.removeItem('audioHistory');
            }
        }
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryUI();
    }

    deleteHistoryItem(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.saveHistory();
        this.updateHistoryUI();
    }
}

const audioHistoryManager = new AudioHistoryManager();

function showFeedback(type, message) {
    const feedbacks = ['loading', 'error', 'success'];
    feedbacks.forEach(fb => {
        const element = document.getElementById(fb);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    const element = document.getElementById(type);
    if (element) {
        element.style.display = 'flex';
        if (message) {
            const span = element.querySelector('span');
            if (span) span.textContent = message;
        }
    }
}
function deleteAudio(filename) {
    fetch(`/api/delete-audio/${filename}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            // Remove the audio element from the history
            const audioElement = document.querySelector(`[data-filename="${filename}"]`);
            if (audioElement) {
                audioElement.parentElement.remove();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showFeedback('error', 'Failed to delete audio file');
    });
}

async function loadVoices() {
    try {
        const response = await fetch('/api/voices');
        if (!response.ok) throw new Error('Failed to load voices');
        
        const voices = await response.json();
        const voiceSelect = document.getElementById('voiceSelect');
        
        if (voiceSelect) {
            voiceSelect.innerHTML = voices.map(voice => 
                `<option value="${voice.id}">${voice.name}</option>`
            ).join('');
        }
    } catch (error) {
        showFeedback('error', 'Failed to load voices: ' + error.message);
    }
}

async function generateAudio() {
    const textInput = document.getElementById('textInput');
    const voiceSelect = document.getElementById('voiceSelect');
    const audioPlayer = document.getElementById('audioPlayer');
    const audioPlayerContainer = document.getElementById('audioPlayerContainer');
    const generateBtn = document.getElementById('generateBtn');

    if (!textInput?.value.trim()) {
        showFeedback('error', '⚠️ Please enter some text');
        return;
    }

    showFeedback('loading');
    if (audioPlayerContainer) audioPlayerContainer.style.display = 'none';
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }

    try {
        const response = await fetch('/api/generate-audio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                text: textInput.value,
                voice_id: voiceSelect?.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate audio');
        }

        if (audioPlayer && audioPlayerContainer) {
            audioPlayer.src = data.audioUrl;
            audioPlayerContainer.style.display = 'block';
        }
        
        showFeedback('success', data.message);
        const selectedVoice = voiceSelect.options[voiceSelect.selectedIndex].text;
        audioHistoryManager.addToHistory(textInput.value, data.audioUrl, selectedVoice);
        
    } catch (err) {
        showFeedback('error', err.message);
    } finally {
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Audio';
        }
    }
}

async function downloadAudio() {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer?.src) {
        try {
            const response = await fetch(audioPlayer.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated-audio.wav';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            showFeedback('error', 'Failed to download audio');
        }
    }
}

function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (sideMenu && menuOverlay) {
        sideMenu.classList.toggle('open');
        menuOverlay.classList.toggle('show');
        document.body.style.overflow = sideMenu.classList.contains('open') ? 'hidden' : '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

    if (textInput) {
        textInput.addEventListener('input', function(e) {
            const charCount = e.target.value.length;
            document.querySelector('.char-count').textContent = `${charCount} characters`;
        });
    }

    if (generateBtn) generateBtn.addEventListener('click', generateAudio);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadAudio);

    // Load available voices
    loadVoices();
});

// Export functions for global access
window.audioHistoryManager = audioHistoryManager;
window.generateAudio = generateAudio;
window.downloadAudio = downloadAudio;