var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var challengeImport = context.gameChallengeImport;

test("daily challenge imports accept supported result exports", function() {
  var parsed = challengeImport.parse(JSON.stringify({
    type: "battleship-daily-challenge",
    version: 1,
    challengeDate: "2024-11-21",
    outcome: "won",
    guesses: 8,
    accuracy: 75,
    difficulty: "normal",
    streak: 2,
    badges: ["Challenge Rookie"]
  }));
  helpers.assert(parsed.valid);
  helpers.assertEqual(parsed.result.challengeDate, "2024-11-21");
  helpers.assertEqual(parsed.result.badges[0], "Challenge Rookie");
});

test("daily challenge imports reject malformed JSON", function() {
  var parsed = challengeImport.parse("not-json");
  helpers.assert(!parsed.valid);
  helpers.assertEqual(parsed.reason, "The challenge result is not valid JSON.");
});

test("daily challenge imports reject invalid result fields", function() {
  var parsed = challengeImport.parse(JSON.stringify({
    type: "battleship-daily-challenge",
    version: 1,
    challengeDate: "21-11-2024",
    outcome: "unknown",
    guesses: -1,
    accuracy: 140,
    difficulty: "extreme",
    streak: -2,
    badges: [3]
  }));
  helpers.assert(!parsed.valid);
  helpers.assertEqual(parsed.reason, "The challenge date is invalid.");
});
