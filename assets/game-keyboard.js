var gameKeyboard = {
  movement: {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1]
  },

  nextCell: function(row, column, key, boardSize) {
    var direction = this.movement[key];
    if (!direction) {
      return null;
    }

    var nextRow = row + direction[0];
    var nextColumn = column + direction[1];
    if (nextRow < 0 || nextRow >= boardSize || nextColumn < 0 || nextColumn >= boardSize) {
      return { row: row, column: column };
    }
    return { row: nextRow, column: nextColumn };
  }
};
