var gameDifficulty = {
  presets: {
    easy: {
      label: "Easy",
      numShips: 2,
      timeLimitSeconds: 90,
      minimumShipsToWin: 1
    },
    normal: {
      label: "Normal",
      numShips: 3,
      timeLimitSeconds: 60,
      minimumShipsToWin: 2
    },
    hard: {
      label: "Hard",
      numShips: 4,
      timeLimitSeconds: 45,
      minimumShipsToWin: 3
    }
  },

  current: "normal",

  get: function(name) {
    return this.presets[name] || this.presets.normal;
  },

  isAvailable: function(name) {
    return Boolean(this.presets[name]);
  },

  apply: function(name, config) {
    var selectedName = this.presets[name] ? name : "normal";
    var preset = this.presets[selectedName];
    config.numShips = preset.numShips;
    config.timeLimitSeconds = preset.timeLimitSeconds;
    config.minimumShipsToWin = preset.minimumShipsToWin;
    this.current = selectedName;
    return preset;
  }
};
