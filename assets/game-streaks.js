var gameStreaks = {
  current: function(records) {
    var streak = 0;
    (records || []).some(function(record) {
      if (!record || record.outcome !== "won") {
        return true;
      }
      streak++;
      return false;
    });
    return streak;
  },
  best: function(records) {
    var best = 0;
    var streak = 0;
    (records || []).slice().reverse().forEach(function(record) {
      if (record && record.outcome === "won") {
        streak++;
        best = Math.max(best, streak);
      } else {
        streak = 0;
      }
    });
    return best;
  },
  summary: function(records) {
    var current = this.current(records);
    var best = this.best(records);
    return "Win streak: " + current + " | Best: " + best;
  }
};
