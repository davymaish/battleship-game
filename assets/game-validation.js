var gameValidation = {
  validateConfig: function(config) {
    var errors = [];
    var positiveFields = ["boardSize", "numShips", "shipLength", "timeLimitSeconds", "minimumShipsToWin"];

    positiveFields.forEach(function(field) {
      if (!Number.isInteger(config[field]) || config[field] <= 0) {
        errors.push(field + " must be a positive integer");
      }
    });

    if (config.minimumShipsToWin > config.numShips) {
      errors.push("minimumShipsToWin cannot exceed numShips");
    }
    if (typeof config.coordinateAlphabet !== "string" || config.coordinateAlphabet.length < config.boardSize) {
      errors.push("coordinateAlphabet must cover the board size");
    }
    if (config.shipLength > config.boardSize) {
      errors.push("shipLength cannot exceed boardSize");
    }

    return { valid: errors.length === 0, errors: errors };
  },

  validateCoordinate: function(guess, config) {
    if (typeof guess !== "string" || guess.length !== 2) {
      return { valid: false, reason: "Coordinate must contain one letter and one number." };
    }

    var row = config.coordinateAlphabet.indexOf(guess.charAt(0));
    var column = Number(guess.charAt(1));
    if (row < 0 || !Number.isInteger(column)) {
      return { valid: false, reason: "Coordinate must start with a valid board letter." };
    }
    if (row >= config.boardSize || column < 0 || column >= config.boardSize) {
      return { valid: false, reason: "Coordinate is outside the board." };
    }

    return { valid: true, row: row, column: column };
  },

  validateShip: function(locations, config) {
    if (!Array.isArray(locations) || locations.length !== config.shipLength) {
      return { valid: false, reason: "Ship has an invalid number of cells." };
    }
    if (new Set(locations).size !== locations.length) {
      return { valid: false, reason: "Ship cells cannot overlap." };
    }

    var cells = locations.map(function(location) {
      var row = Number(location.charAt(0));
      var column = Number(location.charAt(1));
      return { row: row, column: column };
    });
    if (cells.some(function(cell) {
      return !Number.isInteger(cell.row) || !Number.isInteger(cell.column) || cell.row < 0 || cell.row >= config.boardSize || cell.column < 0 || cell.column >= config.boardSize;
    })) {
      return { valid: false, reason: "Ship must remain inside the board." };
    }

    var sameRow = cells.every(function(cell) { return cell.row === cells[0].row; });
    var sameColumn = cells.every(function(cell) { return cell.column === cells[0].column; });
    if (!sameRow && !sameColumn) {
      return { valid: false, reason: "Ship cells must be horizontal or vertical." };
    }

    var positions = cells.map(function(cell) { return sameRow ? cell.column : cell.row; }).sort(function(a, b) { return a - b; });
    for (var i = 1; i < positions.length; i++) {
      if (positions[i] !== positions[i - 1] + 1) {
        return { valid: false, reason: "Ship cells must be adjacent." };
      }
    }

    return { valid: true };
  },

  validateFleet: function(ships, config) {
    var occupied = {};
    for (var i = 0; i < ships.length; i++) {
      var result = this.validateShip(ships[i].locations, config);
      if (!result.valid) {
        return result;
      }
      for (var j = 0; j < ships[i].locations.length; j++) {
        var location = ships[i].locations[j];
        if (occupied[location]) {
          return { valid: false, reason: "Ships cannot overlap." };
        }
        occupied[location] = true;
      }
    }
    return { valid: true };
  }
};
