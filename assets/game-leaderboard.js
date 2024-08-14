var gameLeaderboard = {
  limit: 5,
  difficultyRank: { hard: 3, normal: 2, easy: 1 },
  topWins: function(records) {
    return (records || []).filter(function(record) {
      return record && record.outcome === "won";
    }).map(function(record, index) {
      return { record: record, index: index };
    }).sort(function(left, right) {
      var guessDifference = Number(left.record.guesses) - Number(right.record.guesses);
      if (guessDifference !== 0) {
        return guessDifference;
      }
      var accuracyDifference = Number(right.record.accuracy) - Number(left.record.accuracy);
      if (accuracyDifference !== 0) {
        return accuracyDifference;
      }
      var leftDifficulty = gameLeaderboard.difficultyRank[left.record.difficulty] || 0;
      var rightDifficulty = gameLeaderboard.difficultyRank[right.record.difficulty] || 0;
      if (rightDifficulty !== leftDifficulty) {
        return rightDifficulty - leftDifficulty;
      }
      return left.index - right.index;
    }).slice(0, this.limit).map(function(item, index) {
      return {
        rank: index + 1,
        guesses: item.record.guesses,
        accuracy: item.record.accuracy,
        difficulty: item.record.difficulty
      };
    });
  },
  format: function(entry) {
    return "#" + entry.rank + " — " + entry.guesses + " guesses, " + entry.accuracy + "% accuracy (" + entry.difficulty + ")";
  }
};
