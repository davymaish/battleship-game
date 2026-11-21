var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var insights = context.gameChallengeInsights;
function result(outcome, guesses, challengeDate) {
  return { outcome: outcome, guesses: guesses, challengeDate: challengeDate || null };
}

test("challenge insights calculate win rate and average guesses", function() {
  var summary = insights.summarize([
    result("won", 5, "2024-10-01"),
    result("lost", 8, "2024-10-02"),
    result("won", 7, "2024-10-03"),
    result("won", 3)
  ]);
  helpers.assertEqual(summary.attempts, 3);
  helpers.assertEqual(summary.wins, 2);
  helpers.assertEqual(summary.winRate, 2 / 3 * 100);
  helpers.assertEqual(summary.averageGuesses, 20 / 3);
  helpers.assertEqual(summary.latestDate, "2024-10-03");
});

test("challenge insights ignore ordinary games and handle empty history", function() {
  var summary = insights.summarize([result("won", 2), result("lost", 4)]);
  helpers.assertEqual(summary.attempts, 0);
  helpers.assertEqual(summary.winRate, 0);
  helpers.assertEqual(summary.averageGuesses, null);
  helpers.assertEqual(summary.latestDate, null);
  helpers.assertEqual(insights.format(summary), "Daily challenge win rate: 0.0% | Average guesses: — | Last played: —");
});

test("challenge insights format populated metrics", function() {
  helpers.assertEqual(
    insights.format({ winRate: 66.666, averageGuesses: 7.333, latestDate: "2024-10-03" }),
    "Daily challenge win rate: 66.7% | Average guesses: 7.3 | Last played: 2024-10-03"
  );
});
