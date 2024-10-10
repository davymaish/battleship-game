var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var calendar = context.gameChallengeCalendar;
function result(outcome, date, guesses, accuracy, difficulty) {
  return { outcome: outcome, challengeDate: date, guesses: guesses, accuracy: accuracy, difficulty: difficulty };
}

test("challenge calendar includes unique daily challenge dates newest first", function() {
  var entries = calendar.entries([
    result("won", "2024-10-03", 5, 80, "normal"),
    result("won", "2024-10-03", 6, 70, "easy"),
    result("lost", "2024-10-01", 9, 40, "hard"),
    result("won", "2024-10-02", 7, 75, "hard"),
    { outcome: "won", guesses: 1, accuracy: 100, difficulty: "hard", challengeDate: null }
  ]);
  helpers.assertEqual(entries.length, 3);
  helpers.assertEqual(entries[0].challengeDate, "2024-10-03");
  helpers.assertEqual(entries[0].guesses, 5);
  helpers.assertEqual(entries[1].challengeDate, "2024-10-02");
  helpers.assertEqual(entries[2].outcome, "lost");
});

test("challenge calendar limits history to ten dates", function() {
  var records = [];
  for (var index = 1; index <= 12; index++) {
    records.push(result("won", "2024-10-" + (index < 10 ? "0" + index : index), index, 80, "normal"));
  }
  helpers.assertEqual(calendar.entries(records).length, 10);
  helpers.assertEqual(calendar.entries(records)[9].challengeDate, "2024-10-03");
});

test("challenge calendar formats wins and losses", function() {
  helpers.assertEqual(
    calendar.format(result("won", "2024-10-03", 5, 80, "hard")),
    "2024-10-03 — Won in 5 guesses (80% accuracy, hard)"
  );
  helpers.assertEqual(
    calendar.format(result("lost", "2024-10-02", 9, 40, "normal")),
    "2024-10-02 — Lost in 9 guesses (40% accuracy, normal)"
  );
});
