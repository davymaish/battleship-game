var gameHistory = {
  entries: [],
  nextId: 1,
  bound: false,

  cloneAndFreeze: function(value) {
    var snapshot = JSON.parse(JSON.stringify(value || {}));
    return this.deepFreeze(snapshot);
  },

  deepFreeze: function(value) {
    Object.keys(value).forEach(function(key) {
      if (value[key] && typeof value[key] === "object" && !Object.isFrozen(value[key])) {
        gameHistory.deepFreeze(value[key]);
      }
    });
    return Object.freeze(value);
  },

  record: function(eventName, payload) {
    var entry = {
      id: this.nextId++,
      event: eventName,
      payload: this.cloneAndFreeze(payload),
      recordedAt: new Date().toISOString()
    };
    this.entries.push(Object.freeze(entry));
  },

  getEntries: function() {
    return this.entries.slice();
  },

  getEntriesByEvent: function(eventName) {
    return this.entries.filter(function(entry) {
      return entry.event === eventName;
    });
  },

  latest: function() {
    return this.entries.length ? this.entries[this.entries.length - 1] : null;
  },

  size: function() {
    return this.entries.length;
  },

  clear: function() {
    this.entries = [];
    this.nextId = 1;
  },

  bindEvents: function() {
    if (this.bound) {
      return;
    }
    this.bound = true;

    gameEvents.on("stateChanged", function(payload) {
      gameHistory.record("stateChanged", payload);
    });
    gameEvents.on("shotResolved", function(payload) {
      gameHistory.record("shotResolved", payload);
    });
    gameEvents.on("gameEnded", function(payload) {
      gameHistory.record("gameEnded", payload);
    });
    gameEvents.on("gameReset", function(payload) {
      gameHistory.record("gameReset", payload);
    });
  }
};
