var gameStats = {
  shots: 0,
  hits: 0,
  misses: 0,
  shipsSunk: 0,

  reset: function() {
    this.shots = 0;
    this.hits = 0;
    this.misses = 0;
    this.shipsSunk = 0;
  },

  record: function(result) {
    if (!result || result.alreadyHit) {
      return;
    }

    this.shots++;
    if (result.hit) {
      this.hits++;
    } else {
      this.misses++;
    }
    if (result.sunk) {
      this.shipsSunk++;
    }
  },

  accuracy: function() {
    return this.shots === 0 ? 0 : Math.round((this.hits / this.shots) * 100);
  },

  summary: function() {
    return {
      shots: this.shots,
      hits: this.hits,
      misses: this.misses,
      shipsSunk: this.shipsSunk,
      accuracy: this.accuracy()
    };
  }
};
