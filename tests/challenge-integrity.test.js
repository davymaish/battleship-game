var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var integrity = context.gameChallengeIntegrity;

function payload() {
  return {
    type: "battleship-daily-challenge",
    version: 1,
    challengeDate: "2024-11-30",
    outcome: "won",
    guesses: 6,
    accuracy: 83,
    difficulty: "normal",
    streak: 3,
    badges: ["Challenge Rookie"]
  };
}

test("daily challenge checksums are deterministic", function() {
  var first = integrity.checksum(payload());
  var second = integrity.checksum(payload());
  helpers.assertEqual(first, second);
  helpers.assertEqual(first.length, 8);
});

test("daily challenge integrity attaches and verifies checksums", function() {
  var result = integrity.attach(payload());
  helpers.assert(integrity.verify(result));
  helpers.assertEqual(result.checksum, integrity.checksum(result));
});

test("daily challenge integrity detects changed result fields", function() {
  var result = integrity.attach(payload());
  result.guesses = 7;
  helpers.assert(!integrity.verify(result));
});
