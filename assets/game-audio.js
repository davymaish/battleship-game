var gameAudio = {
  enabled: true,
  context: null,

  toggle: function() {
    this.enabled = !this.enabled;
    return this.enabled;
  },

  getContext: function() {
    if (this.context) {
      return this.context;
    }
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return null;
    }
    this.context = new AudioContext();
    return this.context;
  },

  playTone: function(frequency, duration) {
    if (!this.enabled || typeof window === "undefined") {
      return false;
    }
    var audioContext = this.getContext();
    if (!audioContext) {
      return false;
    }
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
    return true;
  },

  playHit: function() { return this.playTone(660, 0.12); },
  playMiss: function() { return this.playTone(180, 0.16); },
  playWin: function() { return this.playTone(880, 0.3); },
  playLoss: function() { return this.playTone(120, 0.3); }
};
