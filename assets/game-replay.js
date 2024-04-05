var gameReplay = {
  snapshots: [],
  shots: [],

  clone: function(value) {
    return JSON.parse(JSON.stringify(value));
  },

  capture: function() {
    this.snapshots.push(this.clone({
      ships: model.ships,
      shipsSunk: model.shipsSunk,
      guesses: controller.guesses,
      gameOver: controller.gameOver,
      state: gameState.current
    }));
  },

  discardLastCapture: function() {
    this.snapshots.pop();
  },

  recordShot: function(result) {
    this.shots.push(this.clone(result));
  },

  undo: function() {
    if (!this.snapshots.length) {
      return false;
    }

    var snapshot = this.snapshots.pop();
    model.ships = this.clone(snapshot.ships);
    model.shipsSunk = snapshot.shipsSunk;
    controller.guesses = snapshot.guesses;
    controller.gameOver = snapshot.gameOver;
    gameState.restore(snapshot.state);
    this.shots.pop();
    gameEvents.emit("gameUndone", {
      shots: this.clone(this.shots),
      state: gameState.current
    });
    return true;
  },

  reset: function() {
    this.snapshots = [];
    this.shots = [];
  },

  getReplay: function() {
    return Object.freeze(this.clone(this.shots));
  }
};
