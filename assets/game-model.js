var model = {
  boardSize: gameConfig.boardSize,
  numShips: gameConfig.numShips,
  shipLength: gameConfig.shipLength,
  shipsSunk: 0,
  ships: [],

  resetShips: function() {
    this.ships = [];
    for (var i = 0; i < this.numShips; i++) {
      this.ships.push({
        locations: [],
        hits: new Array(this.shipLength).fill("")
      });
    }
    this.shipsSunk = 0;
  },

  fire: function(guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);

      if (index < 0) {
        continue;
      }

      if (ship.hits[index] === "hit") {
        return {
          hit: true,
          alreadyHit: true,
          location: guess,
          sunk: false,
          shipsSunk: this.shipsSunk
        };
      }

      ship.hits[index] = "hit";
      var sunk = this.isSunk(ship);
      if (sunk) {
        this.shipsSunk++;
      }

      return {
        hit: true,
        alreadyHit: false,
        location: guess,
        sunk: sunk,
        shipsSunk: this.shipsSunk
      };
    }

    return {
      hit: false,
      alreadyHit: false,
      location: guess,
      sunk: false,
      shipsSunk: this.shipsSunk
    };
  },

  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  generateShipLocations: function() {
    var locations;
    this.resetShips();

    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },

  generateShip: function() {
    var direction = Math.floor(gameRandom.random() * 2);
    var row;
    var col;

    if (direction === 1) {
      row = Math.floor(gameRandom.random() * this.boardSize);
      col = Math.floor(gameRandom.random() * (this.boardSize - this.shipLength + 1));
    } else {
      row = Math.floor(gameRandom.random() * (this.boardSize - this.shipLength + 1));
      col = Math.floor(gameRandom.random() * this.boardSize);
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
