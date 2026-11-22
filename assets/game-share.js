var gameShare = {
  buildSummary: function(outcome, guesses, stats, difficulty, challengeDate) {
    var result = outcome === "won" ? "I won" : "I played";
    var challenge = challengeDate ? " in the daily challenge for " + challengeDate : "";
    return result + " Battleship on " + difficulty + " difficulty" + challenge + " in " + guesses + " guesses with " + stats.accuracy + "% accuracy.";
  },

  share: function(text) {
    return this.shareText("Battleship result", text);
  },

  shareCode: function(code) {
    return this.shareText("Battleship challenge code", code);
  },

  shareText: function(title, text) {
    if (typeof navigator === "undefined") {
      return Promise.resolve(false);
    }
    if (navigator.share) {
      return navigator.share({ title: title, text: text }).then(function() { return true; }).catch(function() { return false; });
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function() { return true; }).catch(function() { return false; });
    }
    return Promise.resolve(false);
  }
};
