var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var stats = context.gameChallengeStats;
function result(outcome, guesses, challengeDate) {
  return { outcome: outcome, guesses: guesses, challengeDate: challengeDate || null };
}
test("challenge stats count only daily challenge results", function() {
  var summary = stats.summarize([result("won", 6, "2024-09-07"), result("lost", 9, "2024-09-08"), result("won", 8), result("won", 5, "2024-09-09")]);
  helpers.assertEqual(summary.attempts, 3);
  helpers.assertEqual(summary.wins, 2);
  helpers.assertEqual(summary.losses, 1);
  helpers.assertEqual(summary.bestGuesses, 5);
});
test("challenge stats format empty and populated summaries", function() {
  helpers.assertEqual(stats.format(stats.summarize([])), "Daily challenges: 0 | Wins: 0 | Best: —");
  helpers.assertEqual(stats.format({ attempts: 2, wins: 1, losses: 1, bestGuesses: 6 }), "Daily challenges: 2 | Wins: 1 | Best: 6");
});
