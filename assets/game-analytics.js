var gameAnalytics = {
  current: function(stats, model, config) {
    return {
      remainingShips: model.numShips - model.shipsSunk,
      shots: stats.shots,
      accuracy: stats.accuracy(),
      target: config.minimumShipsToWin
    };
  },

  historical: function(records) {
    var total = records.length;
    var wins = records.filter(function(record) { return record.outcome === "won"; }).length;
    var guesses = records.reduce(function(sum, record) { return sum + record.guesses; }, 0);
    return {
      games: total,
      wins: wins,
      losses: total - wins,
      averageGuesses: total === 0 ? 0 : Math.round(guesses / total)
    };
  }
};
