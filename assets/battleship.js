console.log(
  "JS Battleship Made by David Maina \nhttps://davymaish.github.io"
);

// Initiate timer
var timerDurationInSeconds = 60;
var uniqueTimerContainerClassName = "counterArea";
var originalTextInContainer = "Timeout!";
var counter = new SimpleTimer(timerDurationInSeconds, uniqueTimerContainerClassName, originalTextInContainer);

// Ships Model
var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// here's an improvement! Check to see if the ship
			// has already been hit, message the user, and return true.
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},

	generateShipLocations: function() {
		var locations;
		this.shipsSunk = 0;
		for (var i = 0; i < this.numShips; i++) {
			this.ships[i].hits = ["", "", ""];
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
}; 


var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	},

	resetBoard: function() {
		for (var row = 0; row < model.boardSize; row++) {
			for (var column = 0; column < model.boardSize; column++) {
				document.getElementById(row + "" + column).removeAttribute("class");
			}
		}
		document.getElementById("messageArea").innerHTML = "Choose a coordinate to fire.";
		var counterArea = document.getElementById("counterArea");
		counterArea.classList.remove("absolute");
		counterArea.innerHTML = "<p>You have 60 seconds to sink at least two battleships.</p><p>Each battleship takes 3 grid boxes.</p><p>Enter coordinates from A0 to G6.</p>";
	},

	displayEndScene: function(sign_msg, text_msg) {
		document.getElementById('fireButton').setAttribute("disabled", true);
		const endScene = document.getElementById('endscene');
		endScene.getElementsByClassName('winning-sign')[0].innerHTML = sign_msg;
		endScene.getElementsByClassName('winning-text')[0].innerHTML = text_msg;
		endScene.classList.add('show');
	}

}; 

var timer = {
	started: false,

	handleTimeOut: function() {
		controller.gameOver = true;
		if (model.shipsSunk > 1) {
			view.displayEndScene("You Won!", "You sank " + model.shipsSunk + " battleships in " + controller.guesses + " guesses");
		} else {
			view.displayEndScene("Game Over!", 'Your ' + controller.guesses + ' guesses sunk only ' + model.shipsSunk + ' ships!');
		}
	},

	startCountDown: function() {
		if (!this.started) {
			this.started = true;
			const counterArea = document.getElementById('counterArea');
			counterArea.innerHTML = " ";
			counterArea.classList.add('absolute');
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
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
				if (hit && model.shipsSunk === model.numShips) {
					this.gameOver = true;
					timer.stopCountDown();
				view.displayEndScene("You Won!", "You sank all battleships in " + this.guesses + " guesses");
			}
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


// helper function to parse a guess from the user

function parseGuess(guess) {
var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

		if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
			var firstChar = guess.charAt(0);
			var row = alphabet.indexOf(firstChar);
			var column = guess.charAt(1);
			
			if (row < 0 || !/^\d$/.test(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}


// event handlers

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

	timer.startCountDown();
	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	// in IE9 and earlier, the event object doesn't get passed
	// to the event handler correctly, so we use window.event instead.
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

// Handle countdown timeout | custom js function event/invocking listener
var timerEnd = counter.functionsToExecuteAtTimerEnd;
counter.functionsToExecuteAtTimerEnd = function() {
	// before event...
	timer.handleTimeOut();
	// timerEnd.apply(counter, arguments); invocking original function
	// after event...
};

// init - called when the page has completed loading

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

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// place the ships on the game board
	model.generateShipLocations();
}


