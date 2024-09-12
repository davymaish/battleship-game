var gameResults = {
  key: "battleship-game-results",
  records: [],

  load: function() {
    var storage = gameStorage.getStorage();
    if (!storage) {
      this.records = [];
      return this.records;
    }

    try {
      var saved = storage.getItem(this.key);
      this.records = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(this.records)) {
        this.records = [];
      }
    } catch (error) {
      this.records = [];
      this.clear();
    }
    return this.records;
  },

  save: function() {
    var storage = gameStorage.getStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.setItem(this.key, JSON.stringify(this.records));
      return true;
    } catch (error) {
      return false;
    }
  },

  record: function(outcome, summary, guesses, difficulty, challengeDate) {
    var record = {
      outcome: outcome,
      guesses: guesses,
      shipsSunk: summary.shipsSunk,
      shots: summary.shots,
      accuracy: summary.accuracy,
      difficulty: difficulty,
      challengeDate: challengeDate || null
    };
    this.records.unshift(record);
    this.records = this.records.slice(0, 20);
    this.save();
    return record;
  },

  bestScore: function() {
    var wins = this.records.filter(function(record) { return record.outcome === "won"; });
    if (!wins.length) {
      return null;
    }
    return wins.reduce(function(best, record) {
      return record.guesses < best ? record.guesses : best;
    }, wins[0].guesses);
  },

  clear: function() {
    this.records = [];
    var storage = gameStorage.getStorage();
    if (!storage) {
      return false;
    }
    try {
      storage.removeItem(this.key);
      return true;
    } catch (error) {
      return false;
    }
  }
};
