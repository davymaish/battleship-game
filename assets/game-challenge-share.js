var gameChallengeShare = {
  buildSummary: function(record, streak, badges) {
    var outcome = record.outcome === "won" ? "Won" : "Lost";
    var unlocked = (badges || []).filter(function(badge) { return badge && badge.unlocked; }).map(function(badge) { return badge.name; });
    var badgeText = unlocked.length ? unlocked.join(", ") : "none";
    return "Daily challenge " + record.challengeDate + ": " + outcome + " in " + record.guesses + " guesses with " + record.accuracy + "% accuracy on " + record.difficulty + " difficulty. Streak: " + streak + ". Badges: " + badgeText + ".";
  }
};
