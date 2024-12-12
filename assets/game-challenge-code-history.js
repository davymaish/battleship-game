var gameChallengeCodeHistory = {
  entries: function(records, limit) {
    var seen = {};
    var entries = [];
    (records || []).forEach(function(record) {
      if (!record || !record.challengeDate || seen[record.challengeDate]) {
        return;
      }
      seen[record.challengeDate] = true;
      var code = gameChallenge.createCode(record.challengeDate);
      if (code) {
        entries.push({ date: record.challengeDate, outcome: record.outcome, code: code });
      }
    });
    entries.sort(function(left, right) {
      return right.date.localeCompare(left.date);
    });
    return entries.slice(0, limit || 5);
  },

  format: function(entry) {
    var outcome = entry.outcome === "won" ? "Won" : "Lost";
    return entry.date + " — " + entry.code + " — " + outcome;
  }
};
