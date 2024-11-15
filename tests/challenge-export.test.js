var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var challengeExport = context.gameChallengeExport;

test("daily challenge exports preserve result context", function() {
  var serialized = challengeExport.serialize(
    { outcome: "won", challengeDate: "2024-11-09", guesses: 7, accuracy: 71, difficulty: "hard" },
    4,
    [{ name: "Challenge Rookie", unlocked: true }, { name: "Precision Challenger", unlocked: false }]
  );
  helpers.assertDeepEqual(JSON.parse(serialized), {
    type: "battleship-daily-challenge",
    version: 1,
    challengeDate: "2024-11-09",
    outcome: "won",
    guesses: 7,
    accuracy: 71,
    difficulty: "hard",
    streak: 4,
    badges: ["Challenge Rookie"]
  });
});

test("daily challenge exports represent losses without unlocked badges", function() {
  var serialized = challengeExport.serialize(
    { outcome: "lost", challengeDate: "2024-11-10", guesses: 12, accuracy: 25, difficulty: "easy" },
    0,
    [{ name: "Challenge Rookie", unlocked: false }]
  );
  helpers.assertDeepEqual(JSON.parse(serialized), {
    type: "battleship-daily-challenge",
    version: 1,
    challengeDate: "2024-11-10",
    outcome: "lost",
    guesses: 12,
    accuracy: 25,
    difficulty: "easy",
    streak: 0,
    badges: []
  });
});
