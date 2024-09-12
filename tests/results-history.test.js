var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var history = context.gameResultsHistory;
function result(outcome, guesses, accuracy, difficulty) {
  return { outcome: outcome, guesses: guesses, accuracy: accuracy, difficulty: difficulty };
}
test("recent results preserve newest-first order", function() {
  var recent = history.recent([result("won", 5, 80, "hard"), result("lost", 8, 40, "easy")]);
  helpers.assertEqual(recent.length, 2);
  helpers.assertEqual(recent[0].outcome, "won");
  helpers.assertEqual(recent[1].number, 2);
});
test("recent results are limited to the archive size", function() {
  var records = [];
  for (var i = 0; i < 15; i++) {
    records.push(result("lost", i + 1, 0, "normal"));
  }
  helpers.assertEqual(history.recent(records).length, 10);
});
test("recent results format both outcomes", function() {
  helpers.assertEqual(history.format({ number: 1, outcome: "won", guesses: 5, accuracy: 80, difficulty: "hard" }), "#1 — Won, 5 guesses, 80% accuracy (hard)");
  helpers.assertEqual(history.format({ number: 2, outcome: "lost", guesses: 9, accuracy: 20, difficulty: "easy" }), "#2 — Lost, 9 guesses, 20% accuracy (easy)");
});

test("recent results identify daily challenge games", function() {
  var entry = history.recent([result("won", 6, 83, "normal")])[0];
  entry.challengeDate = "2024-09-07";
  helpers.assertEqual(history.format(entry), "#1 — Won, 6 guesses, 83% accuracy (normal) [Daily 2024-09-07]");
});
