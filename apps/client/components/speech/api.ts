export class TextToSpeech {
  engine: SpeechSynthesisUtterance;
  constructor({ volume = 1, rate = 1.2, pitch = 1, lang = 'en' } = {}) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      throw new Error('Text to speech is not supported in your browser.');
    }

    this.engine = new SpeechSynthesisUtterance();
    this.setLanguage(lang).setPitch(pitch).setRate(rate).setVolume(volume);
    this.setVoice('Google UK English Male');
  }

  speak(text: string) {
    this.cancel();
    this.setText(text);
    this.setVoice('Google UK English Male');
    window.speechSynthesis.speak(this.engine);
    return this;
  }

  mute() {
    return this.setVolume(0);
  }

  unmute() {
    return this.setVolume(1);
  }

  setLanguage(lang) {
    this.engine.lang = lang;
    return this;
  }

  setPitch(pitch) {
    this.engine.pitch = pitch;
    return this;
  }

  setRate(rate) {
    this.engine.rate = rate;
    return this;
  }

  setVolume(volume) {
    this.engine.volume = volume;
    return this;
  }

  setText(text) {
    this.engine.text = text;
    return this;
  }

  pause() {
    window.speechSynthesis.pause();
  }

  resume() {
    window.speechSynthesis.resume();
  }

  cancel() {
    window.speechSynthesis.cancel();
  }

  setVoice(voice: string) {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.filter((v) => v.voiceURI === voice).pop();
    if (selectedVoice) {
      this.engine.voice = selectedVoice;
    }
    return this;
  }

  getStatus() {
    if (window.speechSynthesis.speaking) {
      return 'speaking';
    }
    if (window.speechSynthesis.paused) {
      return 'paused';
    }
    if (window.speechSynthesis.pending) {
      return 'pending';
    }
    return 'stopped';
  }
}
