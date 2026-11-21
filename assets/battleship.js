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

var controller = {
  guesses: 0,
  gameOver: false,

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
    this.saveSession();

    if (result.hit && model.shipsSunk === model.numShips) {
      this.gameOver = true;
      timer.stopCountDown();
      gameState.transitionTo(gameState.states.WON);
      gameEvents.emit("gameEnded", {
        title: "You Won!",
        message: "You sank all battleships in " + this.guesses + " guesses"
      });
    }
  },

  restart: function() {
    this.guesses = 0;
    this.gameOver = false;
    gameStorage.clear();
    timer.stopCountDown();
    gameState.reset();
    gameReplay.reset();
    model.generateShipLocations();
    gameEvents.emit("gameReset");
    document.getElementById("endscene").classList.remove("show");
    document.getElementById("fireButton").disabled = false;
    document.getElementById("guessInput").focus();
  },

  saveSession: function() {
    gameStorage.save({
      ships: model.ships,
      shipsSunk: model.shipsSunk,
      guesses: this.guesses,
      gameOver: this.gameOver,
      state: gameState.current,
      randomState: gameRandom.getState(),
      shots: gameReplay.shots
    });
  },

  restoreSession: function() {
    var session = gameStorage.load();
    if (!session || !Array.isArray(session.ships) || !Array.isArray(session.shots)) {
      return false;
    }

    var fleetResult = gameValidation.validateFleet(session.ships, gameConfig);
    if (!fleetResult.valid || !session.randomState) {
      gameStorage.clear();
      return false;
    }

    model.ships = session.ships;
    model.shipsSunk = session.shipsSunk;
    this.guesses = session.guesses;
    this.gameOver = session.gameOver;
    gameRandom.restoreState(session.randomState);
    gameReplay.shots = session.shots;
    gameState.restore(session.state);
    view.resetBoard();
    view.renderShots(gameReplay.shots);
    view.updateLifecycle(gameState.current);
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

  var guessForm = document.getElementById("guessForm");
  guessForm.addEventListener("submit", function(event) {
    event.preventDefault();
    handleFireButton();
  });

  document.getElementById("restartButton").addEventListener("click", function() {
    controller.restart();
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

  document.getElementById("guessInput").onkeypress = handleKeyPress;
  model.generateShipLocations();
  gameReplay.reset();
  gameState.reset();
  controller.restoreSession();
}
