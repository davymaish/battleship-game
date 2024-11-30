var gameChallengeIntegrity = {
  checksum: function(payload) {
    var canonical = JSON.stringify({
      type: payload.type,
      version: payload.version,
      challengeDate: payload.challengeDate,
      outcome: payload.outcome,
      guesses: payload.guesses,
      accuracy: payload.accuracy,
      difficulty: payload.difficulty,
      streak: payload.streak,
      badges: payload.badges
    });
    var hash = 2166136261;
    for (var index = 0; index < canonical.length; index++) {
      hash ^= canonical.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return ("00000000" + (hash >>> 0).toString(16)).slice(-8);
  },

  attach: function(payload) {
    payload.checksum = this.checksum(payload);
    return payload;
  },

  verify: function(payload) {
    return typeof payload.checksum === "string" && payload.checksum === this.checksum(payload);
  }
};
