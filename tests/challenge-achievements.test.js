var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var achievements = context.gameChallengeAchievements;
function result(outcome, date, accuracy) {
  return { outcome: outcome, challengeDate: date, accuracy: accuracy };
}

test("challenge achievements unlock the first-win badge", function() {
  var badges = achievements.list([result("lost", "2024-10-01", 40), result("won", "2024-10-02", 60)]);
  helpers.assert(badges[0].unlocked);
  helpers.assertEqual(badges[1].unlocked, false);
});

test("challenge achievements unlock streak and precision badges", function() {
  var records = [
    result("won", "2024-10-03", 85),
    result("won", "2024-10-02", 70),
    result("won", "2024-10-01", 75)
  ];
  var badges = achievements.list(records);
  helpers.assert(badges[0].unlocked);
  helpers.assert(badges[1].unlocked);
  helpers.assert(badges[2].unlocked);
});

test("challenge achievements ignore ordinary games and summarize progress", function() {
  var badges = achievements.list([{ outcome: "won", accuracy: 100, challengeDate: null }]);
  helpers.assertEqual(achievements.summary([{ outcome: "won", accuracy: 100, challengeDate: null }]), "Challenge badges: 0/3");
  helpers.assertEqual(badges.filter(function(badge) { return badge.unlocked; }).length, 0);
});
