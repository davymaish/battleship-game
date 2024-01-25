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

  handleTimeOut: function() {
    controller.gameOver = true;
    if (model.shipsSunk >= gameConfig.minimumShipsToWin) {
      view.displayEndScene(
        "You Won!",
        "You sank " + model.shipsSunk + " battleships in " + controller.guesses + " guesses"
      );
    } else {
      view.displayEndScene(
        "Game Over!",
        "Your " + controller.guesses + " guesses sunk only " + model.shipsSunk + " ships!"
      );
    }
  },

  startCountDown: function() {
    if (!this.started) {
      this.started = true;
      var counterArea = document.getElementById("counterArea");
      counterArea.innerHTML = " ";
      counterArea.classList.add("absolute");
      counter.startTimer();
    }
  },

  stopCountDown: function() {
    if (this.started) {
      this.started = false;
      counter.endTimer(false);
    }
  }
};

var controller = {
  guesses: 0,
  gameOver: false,

  processGuess: function(guess) {
    if (this.gameOver) {
      return;
    }

    var location = parseGuess(guess);
    if (!location) {
      return;
    }

    this.guesses++;
    var result = model.fire(location);

    if (result.alreadyHit) {
      view.displayMessage("Oops, you already hit that location!");
      return;
    }

    if (result.hit) {
      view.displayHit(result.location);
      view.displayMessage(result.sunk ? "You sank my battleship!" : "HIT!");
    } else {
      view.displayMiss(result.location);
      view.displayMessage("You missed.");
    }

    if (result.hit && model.shipsSunk === model.numShips) {
      this.gameOver = true;
      timer.stopCountDown();
      view.displayEndScene(
        "You Won!",
        "You sank all battleships in " + this.guesses + " guesses"
      );
    }
  },

  restart: function() {
    this.guesses = 0;
    this.gameOver = false;
    timer.stopCountDown();
    model.generateShipLocations();
    view.resetBoard();
    document.getElementById("endscene").classList.remove("show");
    document.getElementById("fireButton").disabled = false;
    document.getElementById("guessInput").focus();
  }
};

function parseGuess(guess) {
  var alphabet = gameConfig.coordinateAlphabet.split("");

  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
    return null;
  }

  var row = alphabet.indexOf(guess.charAt(0));
  var column = guess.charAt(1);

  if (row < 0 || !/^\d$/.test(column)) {
    alert("Oops, that isn't on the board.");
    return null;
  }

  if (row >= gameConfig.boardSize || column < 0 || column >= gameConfig.boardSize) {
    alert("Oops, that's off the board!");
    return null;
  }

  return row + column;
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
  var guessForm = document.getElementById("guessForm");
  guessForm.addEventListener("submit", function(event) {
    event.preventDefault();
    handleFireButton();
  });

  document.getElementById("restartButton").addEventListener("click", function() {
    controller.restart();
  });

  document.getElementById("guessInput").onkeypress = handleKeyPress;
  model.generateShipLocations();
}
