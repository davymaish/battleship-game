var gameChallengeCalendar = {
  limit: 10,
  entries: function(records) {
    var byDate = {};
    (records || []).forEach(function(record) {
      if (record && record.challengeDate && !byDate[record.challengeDate]) {
        byDate[record.challengeDate] = {
          challengeDate: record.challengeDate,
          outcome: record.outcome,
          guesses: record.guesses,
          accuracy: record.accuracy,
          difficulty: record.difficulty
        };
      }
    });
    return Object.keys(byDate).sort(function(left, right) {
      return left < right ? 1 : left > right ? -1 : 0;
    }).slice(0, this.limit).map(function(date) {
      return byDate[date];
    });
  },
  format: function(entry) {
    var outcome = entry.outcome === "won" ? "Won" : "Lost";
    return entry.challengeDate + " — " + outcome + " in " + entry.guesses + " guesses (" + entry.accuracy + "% accuracy, " + entry.difficulty + ")";
  }
};
