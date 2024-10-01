var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var leaderboard = context.gameChallengeLeaderboard;
function win(guesses, accuracy, difficulty, challengeDate) {
  return { outcome: "won", guesses: guesses, accuracy: accuracy, difficulty: difficulty, challengeDate: challengeDate || null };
}

test("challenge leaderboard includes only daily challenge wins", function() {
  var ranked = leaderboard.topWins([
    win(4, 90, "hard", "2024-09-12"),
    win(2, 100, "normal"),
    { outcome: "lost", guesses: 1, accuracy: 100, difficulty: "hard", challengeDate: "2024-09-11" },
    win(6, 80, "easy", "2024-09-10")
  ]);
  helpers.assertEqual(ranked.length, 2);
  helpers.assertEqual(ranked[0].challengeDate, "2024-09-12");
  helpers.assertEqual(ranked[1].challengeDate, "2024-09-10");
});

test("challenge leaderboard ranks guesses, accuracy, and difficulty", function() {
  var ranked = leaderboard.topWins([
    win(6, 75, "easy", "2024-09-07"),
    win(6, 75, "hard", "2024-09-08"),
    win(6, 75, "normal", "2024-09-09"),
    win(3, 60, "easy", "2024-09-10")
  ]);
  helpers.assertEqual(ranked[0].guesses, 3);
  helpers.assertEqual(ranked[1].difficulty, "hard");
  helpers.assertEqual(ranked[2].difficulty, "normal");
  helpers.assertEqual(ranked[3].difficulty, "easy");
});

test("challenge leaderboard limits results to five entries", function() {
  var records = [];
  for (var index = 0; index < 7; index++) {
    records.push(win(index + 1, 80, "normal", "2024-09-" + (10 + index)));
  }
  helpers.assertEqual(leaderboard.topWins(records).length, 5);
});

test("challenge leaderboard formats the challenge date", function() {
  helpers.assertEqual(
    leaderboard.format({ rank: 1, guesses: 5, accuracy: 80, difficulty: "hard", challengeDate: "2024-09-12" }),
    "#1 — 5 guesses, 80% accuracy (hard) — 2024-09-12"
  );
});
