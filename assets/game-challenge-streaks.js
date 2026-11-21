var gameChallengeStreaks = {
  dates: function(records) {
    var byDate = {};
    (records || []).forEach(function(record) {
      if (record && record.challengeDate && !byDate[record.challengeDate]) {
        byDate[record.challengeDate] = record.outcome;
      }
    });
    return Object.keys(byDate).map(function(date) {
      return { date: date, outcome: byDate[date] };
    }).sort(function(left, right) {
      return left.date < right.date ? -1 : left.date > right.date ? 1 : 0;
    });
  },
  consecutive: function(previous, current) {
    var previousTime = Date.parse(previous + "T00:00:00Z");
    var currentTime = Date.parse(current + "T00:00:00Z");
    return currentTime - previousTime === 86400000;
  },
  current: function(records) {
    var dates = this.dates(records);
    var streak = 0;
    for (var index = dates.length - 1; index >= 0; index--) {
      if (dates[index].outcome !== "won") {
        break;
      }
      if (index < dates.length - 1 && !this.consecutive(dates[index].date, dates[index + 1].date)) {
        break;
      }
      streak++;
    }
    return streak;
  },
  best: function(records) {
    var dates = this.dates(records);
    var best = 0;
    var streak = 0;
    dates.forEach(function(entry, index) {
      if (entry.outcome !== "won") {
        streak = 0;
      } else if (index === 0 || !gameChallengeStreaks.consecutive(dates[index - 1].date, entry.date)) {
        streak = 1;
      } else {
        streak++;
      }
      best = Math.max(best, streak);
    });
    return best;
  },
  summary: function(records) {
    return "Daily challenge streak: " + this.current(records) + " | Best: " + this.best(records);
  }
};
