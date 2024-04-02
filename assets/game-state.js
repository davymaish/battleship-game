var gameState = {
  states: {
    IDLE: "idle",
    SETUP: "setup",
    PLAYING: "playing",
    PAUSED: "paused",
    WON: "won",
    LOST: "lost",
    EXPIRED: "expired"
  },

  current: "idle",

  transitions: {
    idle: ["setup"],
    setup: ["playing", "idle"],
    playing: ["paused", "won", "lost", "expired", "idle"],
    paused: ["playing", "idle"],
    won: ["idle"],
    lost: ["idle"],
    expired: ["idle"]
  },

  transitionTo: function(nextState) {
    var allowed = this.transitions[this.current] || [];
    if (allowed.indexOf(nextState) < 0) {
      return false;
    }
    var previousState = this.current;
    this.current = nextState;
    gameEvents.emit("stateChanged", {
      previous: previousState,
      current: this.current
    });
    return true;
  },

  is: function(state) {
    return this.current === state;
  },

  canPlay: function() {
    return this.is(this.states.PLAYING);
  },

  restore: function(previousState) {
    if (!this.transitions[previousState]) {
      return false;
    }
    var oldState = this.current;
    this.current = previousState;
    gameEvents.emit("stateChanged", {
      previous: oldState,
      current: this.current,
      restored: true
    });
    return true;
  },

  reset: function() {
    if (!this.is(this.states.IDLE)) {
      this.transitionTo(this.states.IDLE);
    }
    this.transitionTo(this.states.SETUP);
  }
};
