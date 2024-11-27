console.log(
  "JS Battleship Made by David Maina \nhttps://davymaish.github.io"
);

var timerDurationInSeconds = gameConfig.timeLimitSeconds;
var uniqueTimerContainerClassName = "counterArea";
var originalTextInContainer = "Timeout!";
var counter = new SimpleTimer(
  timerDurationInSeconds,
  uniqueTimerContainerClassName,
  originalTextInContainer
);

var timer = {
  started: false,
  paused: false,

  handleTimeOut: function() {
    this.started = false;
    this.paused = false;
    controller.gameOver = true;
    gameState.transitionTo(gameState.states.EXPIRED);
    var record = gameResults.record(
      model.shipsSunk >= gameConfig.minimumShipsToWin ? "won" : "lost",
      gameStats.summary(),
      controller.guesses,
      gameDifficulty.current,
      controller.dailyChallenge ? controller.dailyChallenge.date : null
    );
    gameAchievements.evaluate(record, gameResults.records);
    view.updateResults();
    view.updateRecentResults();
    view.updateLeaderboard();
    view.updateStreaks();
    view.updateChallenge();
    view.updateChallengeStats();
    view.updateChallengeInsights();
    view.updateChallengeAchievements();
    view.updateChallengeStreaks();
    view.updateChallengeLeaderboard();
    view.updateChallengeCalendar();
    view.updateAchievements();
    if (model.shipsSunk >= gameConfig.minimumShipsToWin) {
      gameEvents.emit("gameEnded", {
        title: "You Won!",
        message: "You sank " + model.shipsSunk + " battleships in " + controller.guesses + " guesses"
      });
    } else {
      gameEvents.emit("gameEnded", {
        title: "Game Over!",
        message: "Your " + controller.guesses + " guesses sunk only " + model.shipsSunk + " ships!"
      });
    }
  },

  startCountDown: function() {
    if (!this.started) {
      this.started = true;
      this.paused = false;
      gameState.transitionTo(gameState.states.PLAYING);
      var counterArea = document.getElementById("counterArea");
      counterArea.innerHTML = " ";
      counterArea.classList.add("absolute");
      counter.startTimer();
    }
  },

  stopCountDown: function() {
    if (this.started) {
      this.started = false;
      this.paused = false;
      counter.endTimer(false);
    }
  },

  pauseCountDown: function() {
    if (this.started && !this.paused && gameState.canPlay()) {
      this.paused = true;
      counter.pauseTimer();
      gameState.transitionTo(gameState.states.PAUSED);
    }
  },

  resumeCountDown: function() {
    if (this.started && this.paused && gameState.is(gameState.states.PAUSED)) {
      this.paused = false;
      counter.resumeTimer();
      gameState.transitionTo(gameState.states.PLAYING);
    }
  }
};

function applyDifficulty(name) {
  var preset = gameDifficulty.apply(name, gameConfig);
  model.numShips = gameConfig.numShips;
  timer.stopCountDown();
  counter = new SimpleTimer(
    gameConfig.timeLimitSeconds,
    uniqueTimerContainerClassName,
    originalTextInContainer
  );
  counter.functionsToExecuteAtTimerEnd = function() {
    timer.handleTimeOut();
  };
  return preset;
}

var controller = {
  guesses: 0,
  gameOver: false,
  dailyChallenge: null,

  processGuess: function(guess) {
    if (this.gameOver || !gameState.canPlay()) {
      return;
    }

    var location = parseGuess(guess);
    if (!location) {
      return;
    }

    this.guesses++;
    gameReplay.capture();
    var result = model.fire(location);

    gameEvents.emit("shotResolved", result);

    if (result.alreadyHit) {
      gameReplay.discardLastCapture();
      return;
    }

    gameReplay.recordShot(result);
    gameStats.record(result);
    view.updateStats();
    this.saveSession();

    if (result.hit && model.shipsSunk === model.numShips) {
      this.gameOver = true;
      timer.stopCountDown();
      gameState.transitionTo(gameState.states.WON);
      var record = gameResults.record("won", gameStats.summary(), this.guesses, gameDifficulty.current, this.dailyChallenge ? this.dailyChallenge.date : null);
      gameAchievements.evaluate(record, gameResults.records);
      view.updateResults();
      view.updateRecentResults();
      view.updateLeaderboard();
      view.updateStreaks();
      view.updateChallenge();
      view.updateChallengeStats();
      view.updateChallengeInsights();
      view.updateChallengeAchievements();
      view.updateChallengeStreaks();
      view.updateChallengeLeaderboard();
      view.updateChallengeCalendar();
      view.updateAchievements();
      gameEvents.emit("gameEnded", {
        title: "You Won!",
        message: "You sank all battleships in " + this.guesses + " guesses"
      });
    }
  },

  restart: function() {
    this.guesses = 0;
    this.gameOver = false;
    gameStats.reset();
    gameStorage.clear();
    timer.stopCountDown();
    if (!this.dailyChallenge) {
      gameRandom.clearSeed();
    }
    gameState.reset();
    gameReplay.reset();
    model.generateShipLocations();
    gameEvents.emit("gameReset");
    document.getElementById("endscene").classList.remove("show");
    document.getElementById("exportChallengeButton").setAttribute("disabled", true);
    document.getElementById("fireButton").disabled = false;
    document.getElementById("guessInput").focus();
  },

  startDailyChallenge: function() {
    this.dailyChallenge = gameChallenge.describe();
    gameRandom.setSeed(this.dailyChallenge.seed);
    this.restart();
    view.updateChallenge(this.dailyChallenge);
    view.displayMessage("Daily challenge started. Good luck!");
  },

  changeDifficulty: function(name) {
    applyDifficulty(name);
    this.restart();
  },

  exportSession: function() {
    var blob = new Blob([gameSession.serialize()], { type: "application/json" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "battleship-session.json";
    link.click();
    URL.revokeObjectURL(link.href);
  },

  importSession: function() {
    var serialized = window.prompt("Paste a Battleship session JSON export:");
    if (!serialized) {
      return;
    }
    var parsed = gameSession.parse(serialized);
    if (!parsed.valid) {
      view.displayMessage(parsed.reason);
      return;
    }
    gameStorage.save(parsed.session);
    window.location.reload();
  },

  importChallengeResult: function() {
    var serialized = window.prompt("Paste a daily challenge result JSON export:");
    if (!serialized) {
      return;
    }
    var parsed = gameChallengeImport.parse(serialized);
    if (!parsed.valid) {
      view.displayMessage(parsed.reason);
      return;
    }
    var result = parsed.result;
    var badges = result.badges.length ? result.badges.join(", ") : "none";
    view.displayMessage("Imported daily challenge " + result.challengeDate + ": " + result.outcome + " in " + result.guesses + " guesses. Streak: " + result.streak + ". Badges: " + badges + ".");
  },

  shareResult: function() {
    var record = gameResults.records[0];
    if (!record) {
      view.displayMessage("Finish a game before sharing a result.");
      return;
    }
    var text;
    if (record.challengeDate) {
      var badges = gameChallengeAchievements.list(gameResults.records);
      var streak = gameChallengeStreaks.current(gameResults.records);
      text = gameChallengeShare.buildSummary(record, streak, badges);
    } else {
      text = gameShare.buildSummary(record.outcome, record.guesses, record, record.difficulty, record.challengeDate);
    }
    gameShare.share(text).then(function(shared) {
      view.displayMessage(shared ? "Result shared." : "Sharing is not available in this browser.");
    });
  },

  exportChallengeResult: function() {
    var record = gameResults.records[0];
    if (!record || !record.challengeDate) {
      view.displayMessage("Finish a daily challenge before exporting its result.");
      return;
    }
    var badges = gameChallengeAchievements.list(gameResults.records);
    var streak = gameChallengeStreaks.current(gameResults.records);
    var blob = new Blob([gameChallengeExport.serialize(record, streak, badges)], { type: "application/json" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "battleship-challenge-" + record.challengeDate + ".json";
    link.click();
    URL.revokeObjectURL(link.href);
    view.displayMessage("Daily challenge result exported.");
  },

  saveSession: function() {
    gameStorage.save(gameSession.create());
  },

  restoreSession: function() {
    var parsed = gameSession.parse(gameStorage.load());
    if (!parsed.valid) {
      return false;
    }
    var session = parsed.session;

    var fleetResult = gameValidation.validateFleet(session.ships, gameConfig);
    if (!fleetResult.valid || !session.randomState) {
      gameStorage.clear();
      return false;
    }

    model.ships = session.ships;
    model.shipsSunk = session.shipsSunk;
    this.guesses = session.guesses;
    this.gameOver = session.gameOver;
    gameStats.reset();
    session.shots.forEach(function(shot) { gameStats.record(shot); });
    gameRandom.restoreState(session.randomState);
    gameReplay.shots = session.shots;
    gameShotHistory.restore(session.shots);
    gameState.restore(session.state);
    view.resetBoard();
    view.renderShots(gameReplay.shots);
    view.updateLifecycle(gameState.current);
    view.updateStats();
    view.updateShotHistory();
    view.updateAnalytics();
    return true;
  },

  undo: function() {
    if (!gameState.canPlay()) {
      view.displayMessage("Undo is available while the game is playing.");
      return;
    }

    if (!gameReplay.undo()) {
      view.displayMessage("There is no shot to undo.");
    }
  }
};

function parseGuess(guess) {
  var result = gameValidation.validateCoordinate(guess, gameConfig);
  if (!result.valid) {
    alert(result.reason);
    return null;
  }

  return result.row + "" + result.column;
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value.toUpperCase();

  timer.startCountDown();
  controller.processGuess(guess);
  guessInput.value = "";
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  e = e || window.event;

  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

counter.functionsToExecuteAtTimerEnd = function() {
  timer.handleTimeOut();
};

window.onload = init;

function init() {
  var configResult = gameValidation.validateConfig(gameConfig);
  if (!configResult.valid) {
    throw new Error("Invalid game configuration: " + configResult.errors.join("; "));
  }

  gameHistory.bindEvents();
  view.bindEvents();
  var preferences = gamePreferences.load();
  document.getElementById("difficultySelect").value = preferences.difficulty;
  document.getElementById("themeSelect").value = preferences.theme;
  gameAudio.enabled = preferences.audioEnabled;

  var guessForm = document.getElementById("guessForm");
  guessForm.addEventListener("submit", function(event) {
    event.preventDefault();
    handleFireButton();
  });

  document.getElementById("restartButton").addEventListener("click", function() {
    controller.restart();
  });

  document.getElementById("challengeButton").addEventListener("click", function() {
    controller.startDailyChallenge();
  });

  document.getElementById("undoButton").addEventListener("click", function() {
    controller.undo();
  });

  document.getElementById("pauseButton").addEventListener("click", function() {
    timer.pauseCountDown();
  });

  document.getElementById("resumeButton").addEventListener("click", function() {
    timer.resumeCountDown();
  });

  document.getElementById("difficultySelect").addEventListener("change", function(event) {
    controller.changeDifficulty(event.target.value);
    preferences.difficulty = event.target.value;
    gamePreferences.save(preferences);
  });

  document.getElementById("themeSelect").addEventListener("change", function(event) {
    gameTheme.apply(event.target.value);
    preferences.theme = event.target.value;
    gamePreferences.save(preferences);
  });

  document.getElementById("exportButton").addEventListener("click", function() {
    controller.exportSession();
  });

  document.getElementById("importButton").addEventListener("click", function() {
    controller.importSession();
  });
  document.getElementById("importChallengeButton").addEventListener("click", function() {
    controller.importChallengeResult();
  });

  document.getElementById("shareButton").addEventListener("click", function() {
    controller.shareResult();
  });
  document.getElementById("exportChallengeButton").addEventListener("click", function() {
    controller.exportChallengeResult();
  });

  document.getElementById("audioButton").addEventListener("click", function(event) {
    var enabled = gameAudio.toggle();
    event.target.innerHTML = enabled ? "Mute sound" : "Enable sound";
    event.target.setAttribute("aria-pressed", enabled ? "false" : "true");
    preferences.audioEnabled = enabled;
    gamePreferences.save(preferences);
  });

  document.getElementById("guessInput").onkeypress = handleKeyPress;
  gameTheme.apply(preferences.theme);
  applyDifficulty(preferences.difficulty);
  document.getElementById("audioButton").innerHTML = preferences.audioEnabled ? "Mute sound" : "Enable sound";
  document.getElementById("audioButton").setAttribute("aria-pressed", preferences.audioEnabled ? "false" : "true");
  gameResults.load();
  gameAchievements.load();
  view.updateChallenge();
  view.updateRecentResults();
  view.updateLeaderboard();
  view.updateStreaks();
  view.updateChallengeStats();
  view.updateChallengeInsights();
  view.updateChallengeAchievements();
  view.updateChallengeStreaks();
  view.updateChallengeLeaderboard();
  view.updateChallengeCalendar();
  view.updateAchievements();
  model.generateShipLocations();
  gameReplay.reset();
  gameState.reset();
  controller.restoreSession();
}
