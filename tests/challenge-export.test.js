var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var challengeExport = context.gameChallengeExport;

test("daily challenge exports preserve result context and integrity", function() {
  var payload = JSON.parse(challengeExport.serialize(
    { outcome: "won", challengeDate: "2024-11-09", guesses: 7, accuracy: 71, difficulty: "hard" },
    4,
    [{ name: "Challenge Rookie", unlocked: true }, { name: "Precision Challenger", unlocked: false }]
  ));
  helpers.assertEqual(payload.type, "battleship-daily-challenge");
  helpers.assertEqual(payload.version, 1);
  helpers.assertEqual(payload.challengeDate, "2024-11-09");
  helpers.assertEqual(payload.outcome, "won");
  helpers.assertEqual(payload.guesses, 7);
  helpers.assertEqual(payload.accuracy, 71);
  helpers.assertEqual(payload.difficulty, "hard");
  helpers.assertEqual(payload.streak, 4);
  helpers.assertDeepEqual(payload.badges, ["Challenge Rookie"]);
  helpers.assert(context.gameChallengeIntegrity.verify(payload));
});

test("daily challenge exports represent losses without unlocked badges", function() {
  var payload = JSON.parse(challengeExport.serialize(
    { outcome: "lost", challengeDate: "2024-11-10", guesses: 12, accuracy: 25, difficulty: "easy" },
    0,
    [{ name: "Challenge Rookie", unlocked: false }]
  ));
  helpers.assertEqual(payload.outcome, "lost");
  helpers.assertEqual(payload.streak, 0);
  helpers.assertDeepEqual(payload.badges, []);
  helpers.assert(context.gameChallengeIntegrity.verify(payload));
});
