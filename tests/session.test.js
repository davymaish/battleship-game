var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var session = context.gameSession;
var config = context.gameConfig;

function validExport() {
  return {
    version: 1,
    ships: [
      { locations: ["00", "01", "02"], hits: ["hit", "", ""] },
      { locations: ["20", "21", "22"], hits: ["", "", ""] },
      { locations: ["40", "41", "42"], hits: ["", "", ""] }
    ],
    shipsSunk: 0,
    guesses: 1,
    gameOver: false,
    state: "playing",
    randomState: { seed: 42, state: 99 },
    shots: [{ location: "00", hit: true, alreadyHit: false, sunk: false }],
    difficulty: "normal"
  };
}

test("valid session exports are accepted", function() {
  var parsed = session.parse(JSON.stringify(validExport()));
  helpers.assert(parsed.valid);
  helpers.assertEqual(parsed.session.version, 1);
  helpers.assert(context.gameValidation.validateFleet(parsed.session.ships, config).valid);
});

test("malformed session JSON is rejected", function() {
  var parsed = session.parse("not-json");
  helpers.assert(!parsed.valid);
});

test("incomplete and invalid-fleet sessions are rejected", function() {
  var incomplete = validExport();
  delete incomplete.randomState;
  helpers.assert(!session.parse(incomplete).valid);

  var invalidFleet = validExport();
  invalidFleet.ships[1].locations = ["00", "10", "20"];
  helpers.assert(!session.parse(invalidFleet).valid);
});
