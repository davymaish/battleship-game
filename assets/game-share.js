var gameShare = {
  buildSummary: function(outcome, guesses, stats, difficulty) {
    var result = outcome === "won" ? "I won" : "I played";
    return result + " Battleship on " + difficulty + " difficulty in " + guesses + " guesses with " + stats.accuracy + "% accuracy.";
  },

  share: function(text) {
    if (typeof navigator === "undefined") {
      return Promise.resolve(false);
    }
    if (navigator.share) {
      return navigator.share({ title: "Battleship result", text: text }).then(function() { return true; }).catch(function() { return false; });
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function() { return true; }).catch(function() { return false; });
    }
    return Promise.resolve(false);
  }
};
