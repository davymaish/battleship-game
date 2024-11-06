var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var challengeShare = context.gameChallengeShare;

test("challenge share summaries include result, streak, and unlocked badges", function() {
  var text = challengeShare.buildSummary(
    { outcome: "won", challengeDate: "2024-11-03", guesses: 6, accuracy: 83, difficulty: "normal" },
    3,
    [{ name: "Challenge Rookie", unlocked: true }, { name: "Precision Challenger", unlocked: true }]
  );
  helpers.assertEqual(text, "Daily challenge 2024-11-03: Won in 6 guesses with 83% accuracy on normal difficulty. Streak: 3. Badges: Challenge Rookie, Precision Challenger.");
});

test("challenge share summaries handle losses without badges", function() {
  var text = challengeShare.buildSummary(
    { outcome: "lost", challengeDate: "2024-11-02", guesses: 9, accuracy: 40, difficulty: "easy" },
    0,
    []
  );
  helpers.assertEqual(text, "Daily challenge 2024-11-02: Lost in 9 guesses with 40% accuracy on easy difficulty. Streak: 0. Badges: none.");
});
