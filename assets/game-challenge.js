var gameChallenge = {
  pad: function(value) {
    return value < 10 ? "0" + value : String(value);
  },
  dateKey: function(date) {
    var current = date || new Date();
    return current.getUTCFullYear() + "-" + this.pad(current.getUTCMonth() + 1) + "-" + this.pad(current.getUTCDate());
  },
  seedForDate: function(dateKey) {
    var hash = 2166136261;
    for (var i = 0; i < dateKey.length; i++) {
      hash ^= dateKey.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  },
  isDateKey: function(dateKey) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return false;
    }
    var date = new Date(dateKey + "T00:00:00Z");
    return !isNaN(date.getTime()) && this.dateKey(date) === dateKey;
  },
  describeDate: function(dateKey) {
    if (!this.isDateKey(dateKey)) {
      return null;
    }
    return {
      date: dateKey,
      seed: this.seedForDate(dateKey),
      label: "Daily challenge — " + dateKey,
      code: this.createCode(dateKey)
    };
  },
  createCode: function(dateKey) {
    if (!this.isDateKey(dateKey)) {
      return null;
    }
    var seed = ("00000000" + this.seedForDate(dateKey).toString(16)).slice(-8);
    return "DC-" + dateKey.replace(/-/g, "") + "-" + seed;
  },
  parseCode: function(code) {
    var match = typeof code === "string" && code.toUpperCase().match(/^DC-(\d{8})-([0-9A-F]{8})$/);
    if (!match) {
      return null;
    }
    var digits = match[1];
    var dateKey = digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6, 8);
    var details = this.describeDate(dateKey);
    return details && details.code.toUpperCase() === code.toUpperCase() ? details : null;
  },
  describe: function(date) {
    return this.describeDate(this.dateKey(date));
  }
};
