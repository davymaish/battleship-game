var gameChallengeExport = {
  serialize: function(record, streak, badges) {
    var unlocked = (badges || []).filter(function(badge) {
      return badge && badge.unlocked;
    }).map(function(badge) {
      return badge.name;
    });
    return JSON.stringify({
      type: "battleship-daily-challenge",
      version: 1,
      challengeDate: record.challengeDate,
      outcome: record.outcome,
      guesses: record.guesses,
      accuracy: record.accuracy,
      difficulty: record.difficulty,
      streak: streak,
      badges: unlocked
    }, null, 2);
  }
};
