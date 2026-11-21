var gameResultsHistory = {
  limit: 10,
  recent: function(records) {
    return (records || []).slice(0, this.limit).map(function(record, index) {
      return {
        number: index + 1,
        outcome: record.outcome,
        guesses: record.guesses,
        accuracy: record.accuracy,
        difficulty: record.difficulty
      };
    });
  },
  format: function(entry) {
    var outcome = entry.outcome === "won" ? "Won" : "Lost";
    return "#" + entry.number + " — " + outcome + ", " + entry.guesses + " guesses, " + entry.accuracy + "% accuracy (" + entry.difficulty + ")";
  }
};
