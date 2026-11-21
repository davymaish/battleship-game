var gameChallengeStats = {
  summarize: function(records) {
    var challenges = (records || []).filter(function(record) { return record && record.challengeDate; });
    var wins = challenges.filter(function(record) { return record.outcome === "won"; });
    var bestGuesses = wins.length ? wins.reduce(function(best, record) {
      return Math.min(best, record.guesses);
    }, wins[0].guesses) : null;
    return {
      attempts: challenges.length,
      wins: wins.length,
      losses: challenges.length - wins.length,
      bestGuesses: bestGuesses
    };
  },
  format: function(summary) {
    var best = summary.bestGuesses === null ? "—" : summary.bestGuesses;
    return "Daily challenges: " + summary.attempts + " | Wins: " + summary.wins + " | Best: " + best;
  }
};
