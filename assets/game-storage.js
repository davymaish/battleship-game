var gameStorage = {
  key: "battleship-game-session",
  storage: null,

  getStorage: function() {
    if (this.storage) {
      return this.storage;
    }
    if (typeof localStorage !== "undefined") {
      return localStorage;
    }
    return null;
  },

  save: function(session) {
    var storage = this.getStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.setItem(this.key, JSON.stringify(session));
      return true;
    } catch (error) {
      return false;
    }
  },

  load: function() {
    var storage = this.getStorage();
    if (!storage) {
      return null;
    }

    try {
      var saved = storage.getItem(this.key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      this.clear();
      return null;
    }
  },

  clear: function() {
    var storage = this.getStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.removeItem(this.key);
      return true;
    } catch (error) {
      return false;
    }
  }
};
