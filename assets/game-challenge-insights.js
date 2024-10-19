var gameChallengeInsights = {
  summarize: function(records) {
    var challenges = (records || []).filter(function(record) {
      return record && record.challengeDate;
    });
    var wins = challenges.filter(function(record) { return record.outcome === "won"; });
    var totalGuesses = challenges.reduce(function(total, record) {
      return total + Number(record.guesses || 0);
    }, 0);
    var averageGuesses = challenges.length ? totalGuesses / challenges.length : null;
    var latestDate = challenges.reduce(function(latest, record) {
      return !latest || record.challengeDate > latest ? record.challengeDate : latest;
    }, null);
    return {
      attempts: challenges.length,
      wins: wins.length,
      winRate: challenges.length ? wins.length / challenges.length * 100 : 0,
      averageGuesses: averageGuesses,
      latestDate: latestDate
    };
  },
  format: function(summary) {
    var average = summary.averageGuesses === null ? "—" : summary.averageGuesses.toFixed(1);
    var latest = summary.latestDate || "—";
    return "Daily challenge win rate: " + summary.winRate.toFixed(1) + "% | Average guesses: " + average + " | Last played: " + latest;
  }
};
