var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var leaderboard = context.gameLeaderboard;
function win(guesses, accuracy, difficulty) {
  return { outcome: "won", guesses: guesses, accuracy: accuracy, difficulty: difficulty };
}
test("leaderboard ranks the best five wins", function() {
  var records = [
    { outcome: "lost", guesses: 1, accuracy: 100, difficulty: "hard" },
    win(9, 90, "normal"),
    win(5, 70, "easy"),
    win(5, 80, "normal"),
    win(3, 60, "hard"),
    win(7, 95, "hard"),
    win(8, 100, "hard"),
    win(10, 100, "easy")
  ];
  var ranked = leaderboard.topWins(records);
  helpers.assertEqual(ranked.length, 5);
  helpers.assertEqual(ranked[0].guesses, 3);
  helpers.assertEqual(ranked[1].accuracy, 80);
  helpers.assertEqual(ranked[4].guesses, 8);
  helpers.assertEqual(ranked[0].rank, 1);
});
test("leaderboard uses difficulty after guesses and accuracy", function() {
  var ranked = leaderboard.topWins([win(6, 75, "easy"), win(6, 75, "hard"), win(6, 75, "normal")]);
  helpers.assertEqual(ranked[0].difficulty, "hard");
  helpers.assertEqual(ranked[1].difficulty, "normal");
  helpers.assertEqual(ranked[2].difficulty, "easy");
});
test("leaderboard formats entries for display", function() {
  helpers.assertEqual(leaderboard.format({ rank: 1, guesses: 5, accuracy: 80, difficulty: "hard" }), "#1 — 5 guesses, 80% accuracy (hard)");
});
