var view = {
  bindEvents: function() {
    gameEvents.on("stateChanged", function(payload) {
      view.updateLifecycle(payload.current);
    });

    gameEvents.on("shotResolved", function(result) {
      if (result.alreadyHit) {
        view.displayMessage("Oops, you already hit that location!");
      } else if (result.hit) {
        view.displayHit(result.location);
        view.displayMessage(result.sunk ? "You sank my battleship!" : "HIT!");
        gameAudio.playHit();
      } else {
        view.displayMiss(result.location);
        view.displayMessage("You missed.");
        gameAudio.playMiss();
      }
      gameShotHistory.record(result);
      view.updateShotHistory();
      view.updateStats();
      view.updateAnalytics();
      view.updateLifecycle(gameState.current);
    });

    gameEvents.on("gameEnded", function(result) {
      view.displayEndScene(result.title, result.message);
      result.title === "You Won!" ? gameAudio.playWin() : gameAudio.playLoss();
    });

    gameEvents.on("gameReset", function() {
      view.resetBoard();
    });

    gameEvents.on("gameUndone", function(payload) {
      view.resetBoard();
      view.renderShots(payload.shots);
      gameShotHistory.restore(payload.shots);
      view.updateShotHistory();
      view.displayMessage("Last shot undone.");
    });

    this.bindBoardKeyboard();
  },

  bindBoardKeyboard: function() {
    var cells = document.querySelectorAll("#board td");
    cells.forEach(function(cell) {
      var row = Number(cell.id.charAt(0));
      var column = Number(cell.id.charAt(1));
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("tabindex", row === 0 && column === 0 ? "0" : "-1");
      cell.setAttribute("aria-label", "Row " + (row + 1) + ", column " + (column + 1));
      cell.addEventListener("keydown", function(event) {
        var next = gameKeyboard.nextCell(row, column, event.key, model.boardSize);
        if (!next) {
          return;
        }
        event.preventDefault();
        var nextCell = document.getElementById(next.row + "" + next.column);
        cells.forEach(function(otherCell) { otherCell.setAttribute("tabindex", "-1"); });
        nextCell.setAttribute("tabindex", "0");
        nextCell.focus();
      });
    });
  },

  updateLifecycle: function(state) {
    document.getElementById("gameState").innerHTML = "Game state: " + state;
    document.getElementById("fireButton").disabled = state !== gameState.states.SETUP && state !== gameState.states.PLAYING;
    document.getElementById("undoButton").disabled = state !== gameState.states.PLAYING || gameReplay.snapshots.length === 0;
    document.getElementById("pauseButton").disabled = state !== gameState.states.PLAYING;
    document.getElementById("resumeButton").disabled = state !== gameState.states.PAUSED;
  },

  displayMessage: function(msg) {
    document.getElementById("messageArea").innerHTML = msg;
  },

  updateStats: function() {
    var summary = gameStats.summary();
    document.getElementById("gameStats").innerHTML = "Shots: " + summary.shots + " | Hits: " + summary.hits + " | Misses: " + summary.misses + " | Accuracy: " + summary.accuracy + "%";
  },

  updateResults: function() {
    var best = gameResults.bestScore();
    document.getElementById("resultsSummary").innerHTML = best === null ? "Best score: —" : "Best score: " + best + " guesses";
  },
  updateRecentResults: function() {
    var history = document.getElementById("recentResults");
    var entries = gameResultsHistory.recent(gameResults.records);
    history.innerHTML = "";
    if (!entries.length) {
      var empty = document.createElement("li");
      empty.innerHTML = "No completed games yet.";
      history.appendChild(empty);
      return;
    }
    entries.forEach(function(entry) {
      var item = document.createElement("li");
      item.innerHTML = gameResultsHistory.format(entry);
      history.appendChild(item);
    });
  },
  updateLeaderboard: function() {
    var leaderboard = document.getElementById("leaderboard");
    var entries = gameLeaderboard.topWins(gameResults.records);
    leaderboard.innerHTML = "";
    if (!entries.length) {
      var empty = document.createElement("li");
      empty.innerHTML = "No wins recorded yet.";
      leaderboard.appendChild(empty);
      return;
    }
    entries.forEach(function(entry) {
      var item = document.createElement("li");
      item.innerHTML = gameLeaderboard.format(entry);
      leaderboard.appendChild(item);
    });
  },
  updateAchievements: function() {
    var unlocked = gameAchievements.list().filter(function(achievement) { return achievement.unlocked; });
    var names = unlocked.map(function(achievement) { return achievement.name; });
    var summary = "Achievements: " + unlocked.length + "/" + gameAchievements.definitions.length + " unlocked";
    if (names.length) {
      summary += " — " + names.join(", ");
    }
    document.getElementById("achievementsSummary").innerHTML = summary;
  },
  updateStreaks: function() {
    document.getElementById("streakSummary").innerHTML = gameStreaks.summary(gameResults.records);
  },
  updateChallenge: function(details) {
    var challenge = details || controller.dailyChallenge || gameChallenge.describe();
    var prefix = controller.dailyChallenge ? "Active " : "Available ";
    document.getElementById("dailyChallengeSummary").innerHTML = prefix + challenge.label + " | Seed: " + challenge.seed;
  },
  updateChallengeStats: function() {
    var summary = gameChallengeStats.summarize(gameResults.records);
    document.getElementById("dailyChallengeResults").innerHTML = gameChallengeStats.format(summary);
  },
  updateChallengeStreaks: function() {
    document.getElementById("dailyChallengeStreak").innerHTML = gameChallengeStreaks.summary(gameResults.records);
  },

  updateShotHistory: function() {
    var history = document.getElementById("shotHistory");
    history.innerHTML = "";
    gameShotHistory.entries.forEach(function(entry) {
      var item = document.createElement("li");
      item.innerHTML = gameShotHistory.label(entry);
      history.appendChild(item);
    });
  },

  updateAnalytics: function() {
    var current = gameAnalytics.current(gameStats, model, gameConfig);
    var historical = gameAnalytics.historical(gameResults.records);
    document.getElementById("analyticsSummary").innerHTML = "Games: " + historical.games + " | Wins: " + historical.wins + " | Losses: " + historical.losses + " | Ships remaining: " + current.remainingShips + " | Target: " + current.target;
  },

  displayHit: function(location) {
    document.getElementById(location).setAttribute("class", "hit");
  },

  displayMiss: function(location) {
    document.getElementById(location).setAttribute("class", "miss");
  },

  renderShots: function(shots) {
    shots.forEach(function(shot) {
      if (shot.hit) {
        view.displayHit(shot.location);
      } else {
        view.displayMiss(shot.location);
      }
    });
  },

  resetBoard: function() {
    for (var row = 0; row < model.boardSize; row++) {
      for (var column = 0; column < model.boardSize; column++) {
        document.getElementById(row + "" + column).removeAttribute("class");
      }
    }

    this.displayMessage("Choose a coordinate to fire.");
    this.updateStats();
    this.updateResults();
    this.updateRecentResults();
    this.updateLeaderboard();
    this.updateStreaks();
    this.updateChallenge();
    this.updateChallengeStats();
    this.updateChallengeStreaks();
    this.updateAnalytics();
    gameShotHistory.reset();
    this.updateShotHistory();
    var counterArea = document.getElementById("counterArea");
    counterArea.classList.remove("absolute");
    counterArea.innerHTML = "<p>You have " + gameConfig.timeLimitSeconds + " seconds to sink at least " + gameConfig.minimumShipsToWin + " battleships.</p><p>Each battleship takes " + gameConfig.shipLength + " grid boxes.</p><p>Enter coordinates from A0 to " + gameConfig.coordinateAlphabet.charAt(gameConfig.boardSize - 1) + (gameConfig.boardSize - 1) + ".</p>";
    this.updateLifecycle(gameState.states.SETUP);
  },

  displayEndScene: function(signMessage, textMessage) {
    document.getElementById("fireButton").setAttribute("disabled", true);
    document.getElementById("shareButton").removeAttribute("disabled");
    var endScene = document.getElementById("endscene");
    endScene.getElementsByClassName("winning-sign")[0].innerHTML = signMessage;
    endScene.getElementsByClassName("winning-text")[0].innerHTML = textMessage;
    endScene.classList.add("show");
  }
};
