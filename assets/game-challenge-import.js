var gameChallengeImport = {
  parse: function(serialized) {
    var payload;
    try {
      payload = JSON.parse(serialized);
    } catch (error) {
      return { valid: false, reason: "The challenge result is not valid JSON." };
    }
    if (!payload || payload.type !== "battleship-daily-challenge" || payload.version !== 1) {
      return { valid: false, reason: "The file is not a supported daily challenge result." };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.challengeDate)) {
      return { valid: false, reason: "The challenge date is invalid." };
    }
    if (payload.outcome !== "won" && payload.outcome !== "lost") {
      return { valid: false, reason: "The challenge outcome is invalid." };
    }
    if (!Number.isFinite(payload.guesses) || payload.guesses < 0 || !Number.isFinite(payload.accuracy) || payload.accuracy < 0 || payload.accuracy > 100) {
      return { valid: false, reason: "The challenge statistics are invalid." };
    }
    if (["easy", "normal", "hard"].indexOf(payload.difficulty) === -1) {
      return { valid: false, reason: "The challenge difficulty is invalid." };
    }
    if (!Number.isFinite(payload.streak) || payload.streak < 0 || !Array.isArray(payload.badges) || payload.badges.some(function(badge) { return typeof badge !== "string"; })) {
      return { valid: false, reason: "The challenge progress is invalid." };
    }
    if (payload.checksum !== undefined && !gameChallengeIntegrity.verify(payload)) {
      return { valid: false, reason: "The challenge result checksum is invalid." };
    }
    return { valid: true, result: payload };
  }
};
