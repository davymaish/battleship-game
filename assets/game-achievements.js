var gameAchievements = {
  key: "battleship-game-achievements",
  unlocked: [],
  definitions: [
    {
      id: "first-win",
      name: "First Victory",
      description: "Win your first game.",
      qualifies: function(record, records) {
        return record.outcome === "won" && records.filter(function(item) { return item.outcome === "won"; }).length === 1;
      }
    },
    {
      id: "sharpshooter",
      name: "Sharpshooter",
      description: "Win with at least 80% accuracy.",
      qualifies: function(record) {
        return record.outcome === "won" && record.accuracy >= 80;
      }
    },
    {
      id: "speed-demon",
      name: "Speed Demon",
      description: "Win in six guesses or fewer.",
      qualifies: function(record) {
        return record.outcome === "won" && record.guesses <= 6;
      }
    },
    {
      id: "hard-earned",
      name: "Hard Earned",
      description: "Win a game on hard difficulty.",
      qualifies: function(record) {
        return record.outcome === "won" && record.difficulty === "hard";
      }
    }
  ],
  load: function() {
    var storage = gameStorage.getStorage();
    if (!storage) {
      this.unlocked = [];
      return this.unlocked;
    }
    try {
      var saved = storage.getItem(this.key);
      this.unlocked = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(this.unlocked)) {
        this.unlocked = [];
      }
      this.unlocked = this.unlocked.filter(function(id) {
        return gameAchievements.definitions.some(function(definition) { return definition.id === id; });
      });
    } catch (error) {
      this.unlocked = [];
      this.clear();
    }
    return this.unlocked;
  },
  save: function() {
    var storage = gameStorage.getStorage();
    if (!storage) {
      return false;
    }
    try {
      storage.setItem(this.key, JSON.stringify(this.unlocked));
      return true;
    } catch (error) {
      return false;
    }
  },
  evaluate: function(record, records) {
    var previous = this.unlocked.slice();
    var allRecords = records || [];
    this.definitions.forEach(function(definition) {
      if (definition.qualifies(record, allRecords) && gameAchievements.unlocked.indexOf(definition.id) === -1) {
        gameAchievements.unlocked.push(definition.id);
      }
    });
    if (this.unlocked.length !== previous.length) {
      this.save();
    }
    return this.unlocked.filter(function(id) { return previous.indexOf(id) === -1; });
  },
  list: function() {
    return this.definitions.map(function(definition) {
      return {
        id: definition.id,
        name: definition.name,
        description: definition.description,
        unlocked: gameAchievements.unlocked.indexOf(definition.id) !== -1
      };
    });
  },
  clear: function() {
    this.unlocked = [];
    var storage = gameStorage.getStorage();
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
