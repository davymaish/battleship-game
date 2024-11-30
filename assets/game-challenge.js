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
      label: "Daily challenge — " + dateKey
    };
  },
  describe: function(date) {
    return this.describeDate(this.dateKey(date));
  }
};
