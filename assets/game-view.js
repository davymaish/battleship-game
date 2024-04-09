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
      } else {
        view.displayMiss(result.location);
        view.displayMessage("You missed.");
      }
      view.updateLifecycle(gameState.current);
    });

    gameEvents.on("gameEnded", function(result) {
      view.displayEndScene(result.title, result.message);
    });

    gameEvents.on("gameReset", function() {
      view.resetBoard();
    });

    gameEvents.on("gameUndone", function(payload) {
      view.resetBoard();
      view.renderShots(payload.shots);
      view.displayMessage("Last shot undone.");
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
    var counterArea = document.getElementById("counterArea");
    counterArea.classList.remove("absolute");
    counterArea.innerHTML = "<p>You have " + gameConfig.timeLimitSeconds + " seconds to sink at least " + gameConfig.minimumShipsToWin + " battleships.</p><p>Each battleship takes " + gameConfig.shipLength + " grid boxes.</p><p>Enter coordinates from A0 to " + gameConfig.coordinateAlphabet.charAt(gameConfig.boardSize - 1) + (gameConfig.boardSize - 1) + ".</p>";
    this.updateLifecycle(gameState.states.SETUP);
  },

  displayEndScene: function(signMessage, textMessage) {
    document.getElementById("fireButton").setAttribute("disabled", true);
    var endScene = document.getElementById("endscene");
    endScene.getElementsByClassName("winning-sign")[0].innerHTML = signMessage;
    endScene.getElementsByClassName("winning-text")[0].innerHTML = textMessage;
    endScene.classList.add("show");
  }
};
