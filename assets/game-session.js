var gameSession = {
  version: 1,

  create: function() {
    return {
      version: this.version,
      ships: model.ships,
      shipsSunk: model.shipsSunk,
      guesses: controller.guesses,
      gameOver: controller.gameOver,
      state: gameState.current,
      randomState: gameRandom.getState(),
      shots: gameReplay.shots,
      difficulty: gameDifficulty.current
    };
  },

  serialize: function() {
    return JSON.stringify(this.create(), null, 2);
  },

  parse: function(serialized) {
    var session;
    try {
      session = typeof serialized === "string" ? JSON.parse(serialized) : serialized;
    } catch (error) {
      return { valid: false, reason: "Session data is not valid JSON." };
    }

    if (!session || session.version !== this.version || !Array.isArray(session.ships) || !Array.isArray(session.shots) || !session.randomState) {
      return { valid: false, reason: "Session data is incomplete or unsupported." };
    }

    var fleetResult = gameValidation.validateFleet(session.ships, gameConfig);
    if (!fleetResult.valid) {
      return { valid: false, reason: "Session fleet is invalid." };
    }

    return { valid: true, session: session };
  }
};
