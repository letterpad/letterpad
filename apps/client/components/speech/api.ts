export class TextToSpeech {
  engine: SpeechSynthesisUtterance;
  timeout;
  constructor({ volume = 1, rate = 1.2, pitch = 0.8, lang = 'en' } = {}) {
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
    this.resumeWhenInterupted();
    window.speechSynthesis.speak(this.engine);
    return this;
  }

  myTimer() {
    this.pause();
    this.resume();
    this.timeout = setTimeout(this.myTimer, 10000);
  }

  // https://bugs.chromium.org/p/chromium/issues/detail?id=679437
  resumeWhenInterupted() {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(this.myTimer.bind(this), 10000);
    this.engine.onend = () => {
      clearTimeout(this.timeout);
    };
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
    clearTimeout(this.timeout);
  }

  resume() {
    window.speechSynthesis.resume();
    this.resumeWhenInterupted();
  }

  cancel() {
    window.speechSynthesis.cancel();
    clearTimeout(this.timeout);
  }

  setVoice(voice: string) {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.filter((v) => v.voiceURI === voice).pop();
    if (selectedVoice) {
      this.engine.voice = selectedVoice;
    }
    return this;
  }
}
