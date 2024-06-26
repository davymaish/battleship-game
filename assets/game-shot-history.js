var gameShotHistory = {
  entries: [],

  reset: function() {
    this.entries = [];
  },

  record: function(result) {
    if (!result || result.alreadyHit) {
      return null;
    }
    var entry = {
      location: result.location,
      outcome: result.hit ? "hit" : "miss",
      sunk: Boolean(result.sunk)
    };
    this.entries.push(entry);
    return entry;
  },

  restore: function(shots) {
    this.reset();
    (shots || []).forEach(function(shot) {
      gameShotHistory.record(shot);
    });
  },

  label: function(entry) {
    if (entry.outcome === "hit" && entry.sunk) {
      return entry.location + " — hit and sunk a ship";
    }
    return entry.location + " — " + entry.outcome;
  }
};
