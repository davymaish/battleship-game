var gamePreferences = {
  key: "battleship-game-preferences",
  defaults: {
    difficulty: "normal",
    theme: "classic",
    audioEnabled: true
  },

  load: function() {
    var saved = gameStorage.getStorage();
    if (!saved) {
      return Object.assign({}, this.defaults);
    }
    try {
      var value = JSON.parse(saved.getItem(this.key) || "null") || {};
      return {
        difficulty: gameDifficulty.isAvailable(value.difficulty) ? value.difficulty : this.defaults.difficulty,
        theme: gameTheme.isAvailable(value.theme) ? value.theme : this.defaults.theme,
        audioEnabled: value.audioEnabled !== false
      };
    } catch (error) {
      return Object.assign({}, this.defaults);
    }
  },

  save: function(preferences) {
    var storage = gameStorage.getStorage();
    if (!storage) {
      return false;
    }
    try {
      storage.setItem(this.key, JSON.stringify(preferences));
      return true;
    } catch (error) {
      return false;
    }
  }
};
