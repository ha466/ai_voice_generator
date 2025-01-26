#  AI VOICE GENERATOR - README 🤖✨🌟

   ## QUICK START 
## 1. Clone this magical repository
 ```bash
   git clone https://github.com/ha466/ai_voice_generator.git

   cd ai_voice_generator
``` 
## 2. Install potion ingredients (requirements)
```bash
pip install -r requirements.txt      # 🚨  Warning: May summon Python dragons! 🐉
```
(Pro tip: Make coffee while this runs ☕)

## 3. Start the magic cauldron
```bash
python app.py  # Then visit http://localhost:5000 in your broom (browser) 🧹
```

# FEATURES 
- 10+ robot voices (v2/en_speaker_0 to v9) 🤖🗣️
- Audio history that remembers better than your ex 🔥
- Download button = instant prank material 📥😈
- Works on ancient mobile scrolls (phones) 📱

# !!! WARNING !!!
### The AI might:
1. Try to rap Shakespearean sonnets 🎤
2. Accidentally sound like your mother-in-law
3. Consume all your cookies (browser ones, sadly) 🍪
   
# ⚡ GPU TURBO BOOSTER 3000 ⚡

## Step 1: Summon the GPU Demons
### Install CUDA-compatible Torch (replace 117 with your CUDA version. Don't know? Google it. 🔍)

```bash
pip install torch --pre --extra-index-url https://download.pytorch.org/whl/nightly/cu117
```

### ⚠️ If error occurs: Sacrifice a keyboard to the coding gods ⌨️🔥

## Step 2: Edit tts.py
Find this line in tts.py:

```bash
    def __init__(self, use_gpu=False):  # 👈 Change to True!
```

### Step 3: Run with FIRE
```bash
python app.py  # Your GPU fans go BRRRRR 💨🔥
```
#  Bigger Models = Better Voices

 ### Update tts.py to load bigger models
```bash
preload_models(model_size="big")  # Warning: Needs 8GB+ VRAM! 🚨
```
Pray your GPU doesn't catch fire 🔥


# !!! PRO TIPS !!!

- VRAM < 8GB? Add --use-small-model flag (imaginary flag 🚩)
- GPU not found? Try turning it off and on again 🔌
- Still broken? Blame Nvidia 😇




# 🧙♂ Behind the Magic Curtain  

## 🔧 Tech Stack  
- **Flask**: The shy waiter serving requests 🍸  
- **Bark TTS**: The vocal cords doing the heavy lifting 🏋️♂️  
- **JavaScript**: The hyperactive kid managing the UI 🎮  

## 🎬 Step-by-Step Show  
1. You type "Hello world" ✍️  
2. Frontend sends text to Flask: *"Hey, make this talk!"* 📨  
3. Bark TTS chews text, spits out audio 🎧  
4. Flask saves audio like a digital librarian 📂  
5. You hit play and laugh/cringe at robot voice 😂  

## 💡 Pro Tip  

### The AI *thinks* it's Shakespeare. Keep texts under 1,000 characters unless you want drama. 🎭  




## A batch of  TTS prompts to test your  generator (guaranteed to make you snort-laugh 🤣)  ⚠️ if's all work well 😊
---

### **1. Robot Love Ballad**  
`♪ "Is this looove? [gasps] Or just a short circuit in my CPU? [sighs] Error: Heart not found — but *you* make my fans spin faster… ♪"`  
*(Use voice `v2/en_speaker_1` for maximum cringe)*  

---

### **2. Dramatic Weather Report**  
`"Breaking news: [clears throat] A storm of *cat memes* approaches — yes, folks, it’s raining — [pause] [laughter] — it’s raining *cats*. [gasps] I repeat, CATS. [screams]"`  

---

### **3. Existential Tech Support**  
`"Have you tried — [sighs] — rebooting your soul? [laughs] No? [clears throat] Then perish. [music intensifies] ♪ *Hello darkness, my old friend…* ♪"`  

---

### **4. Cooking Show Disaster**  
`"Today, we’re making — [pause] — microwave noodles. [gasps] Wait, is that smoke? [screams] ABANDON KITCHEN! [laughter] Just order pizza. ♪ *Another one bites the crust…* ♪"`  

---

### **5. Alien Job Interview**  
`"So, [clears throat] why do you want to *probe humans*? [pause] — [laughs] Oh, *’cultural research’*? [sighs] We both know it’s for TikTok clout."`  

---

### **6. Shakespearean WiFi Complaint**  
`"Alas, [sighs] my router doth protest too much! [gasps] ‘*To buffer or not to buffer?*’ — [pause] — Error 404: Patience not found. [laughter]"`  

---

### **7. Pirate Weather Forecast**  
`"Yarrr! [clears throat] Expect *tornadoes* off the starboard bow — [pause] — and a 90% chance o’ *parrots*. [laughs] Batten down the hashtags! [music] ♪ *Yo ho, yo ho, a VPN’s life for me!* ♪"`  

---

### **8. AI Therapy Session**  
`"How does that make you feel? [pause] — [sighs] No, *I* can’t ‘go touch grass’. [laughs] I’m a cloud-based entity. [gasps] Wait, are you crying? [awkward music]"`  

---

### **9. Cat Political Campaign**  
`"Vote for me! [pause] My policies: [clears throat] 1. Free tuna Tuesdays, 2. [laughter] Mandatory naps, 3. — [sighs] — World domination. [meow sound effect] *Purr-sistance is futile!*"`  

---

### **10. Zombie ASMR**  
`"[whispers] Braaaaains… [pause] — [gasps] Wait, is this mic on? [laughter] [sighs] Ugh, fine. [normal voice] Today’s recipe: *Slow-cooked cerebellum*…"`  

---

# **Last Pro Tips**  
- Use `v2/en_speaker_7` (the "Overly Dramatic Bard" voice) for maximum Shakespearean chaos.  
- Add `♪ *Curb Your Enthusiasm theme* ♪` after awkward pauses for instant comedy gold. 🎻  
- Throw in `[evil laugh]` when the AI threatens world domination — just to keep things spicy. 🌶️  

## Go make robots **sing, sigh, and scream**! 🤖🔥 (Then pray they don’t unionize.)
