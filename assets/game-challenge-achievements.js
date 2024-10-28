var gameChallengeAchievements = {
  definitions: [
    { id: "challenge-first-win", name: "Challenge Rookie", description: "Win your first daily challenge." },
    { id: "challenge-streak-three", name: "Three-Day Challenger", description: "Win daily challenges on three consecutive UTC dates." },
    { id: "challenge-precision", name: "Precision Challenger", description: "Win a daily challenge with at least 80% accuracy." }
  ],
  qualifies: function(id, records) {
    var challenges = (records || []).filter(function(record) { return record && record.challengeDate; });
    if (id === "challenge-first-win") {
      return challenges.some(function(record) { return record.outcome === "won"; });
    }
    if (id === "challenge-streak-three") {
      return gameChallengeStreaks.best(records) >= 3;
    }
    if (id === "challenge-precision") {
      return challenges.some(function(record) {
        return record.outcome === "won" && Number(record.accuracy) >= 80;
      });
    }
    return false;
  },
  list: function(records) {
    var self = this;
    return this.definitions.map(function(definition) {
      return {
        id: definition.id,
        name: definition.name,
        description: definition.description,
        unlocked: self.qualifies(definition.id, records)
      };
    });
  },
  summary: function(records) {
    var badges = this.list(records);
    var unlocked = badges.filter(function(badge) { return badge.unlocked; });
    return "Challenge badges: " + unlocked.length + "/" + badges.length;
  }
};
