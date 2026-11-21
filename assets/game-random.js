var gameRandom = {
  seed: null,
  state: null,

  setSeed: function(seed) {
    var numericSeed = Number(seed);
    if (!Number.isFinite(numericSeed)) {
      throw new Error("Random seed must be a finite number.");
    }
    this.seed = numericSeed >>> 0;
    this.state = this.seed;
  },

  clearSeed: function() {
    this.seed = null;
    this.state = null;
  },

  random: function() {
    if (this.state === null) {
      return Math.random();
    }

    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 4294967296;
  },

  getState: function() {
    return {
      seed: this.seed,
      state: this.state
    };
  },

  restoreState: function(snapshot) {
    this.seed = snapshot.seed;
    this.state = snapshot.state;
  }
};
