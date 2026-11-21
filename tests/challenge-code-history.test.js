var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var codeHistory = context.gameChallengeCodeHistory;

test("daily challenge code history keeps recent distinct dates", function() {
  var entries = codeHistory.entries([
    { challengeDate: "2024-12-02", outcome: "won" },
    { challengeDate: "2024-12-01", outcome: "lost" },
    { challengeDate: "2024-12-02", outcome: "lost" },
    { challengeDate: "2024-11-30", outcome: "won" }
  ]);
  helpers.assertEqual(entries.length, 3);
  helpers.assertEqual(entries[0].date, "2024-12-02");
  helpers.assertEqual(entries[0].outcome, "won");
  helpers.assertEqual(entries[0].code, context.gameChallenge.createCode("2024-12-02"));
});

test("daily challenge code history applies a limit and readable format", function() {
  var entries = codeHistory.entries([
    { challengeDate: "2024-12-01", outcome: "lost" },
    { challengeDate: "2024-11-30", outcome: "won" }
  ], 1);
  helpers.assertEqual(entries.length, 1);
  helpers.assertEqual(codeHistory.format(entries[0]), "2024-12-01 — " + entries[0].code + " — Lost");
});
