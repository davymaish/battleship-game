var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var validation = context.gameValidation;
var config = context.gameConfig;

function expectInvalid(result, message) {
  helpers.assert(!result.valid, message || "Expected validation to fail.");
}

test("default configuration is valid", function() {
  helpers.assert(validation.validateConfig(config).valid, "Default configuration should be valid.");
});

test("configuration rejects impossible win thresholds", function() {
  var invalidConfig = Object.assign({}, config, { minimumShipsToWin: config.numShips + 1 });
  expectInvalid(validation.validateConfig(invalidConfig));
});

test("coordinates accept board edges", function() {
  helpers.assertDeepEqual(validation.validateCoordinate("A0", config), { valid: true, row: 0, column: 0 });
  helpers.assertDeepEqual(validation.validateCoordinate("G6", config), { valid: true, row: 6, column: 6 });
});

test("coordinates reject malformed and out-of-bounds guesses", function() {
  expectInvalid(validation.validateCoordinate("A", config));
  expectInvalid(validation.validateCoordinate("H0", config));
  expectInvalid(validation.validateCoordinate("A7", config));
});

test("ships accept contiguous horizontal and vertical layouts", function() {
  helpers.assert(validation.validateShip(["00", "01", "02"], config).valid);
  helpers.assert(validation.validateShip(["00", "10", "20"], config).valid);
});

test("ships reject diagonal, duplicate, non-contiguous, and out-of-bounds layouts", function() {
  expectInvalid(validation.validateShip(["00", "11", "22"], config));
  expectInvalid(validation.validateShip(["00", "01", "01"], config));
  expectInvalid(validation.validateShip(["00", "02", "03"], config));
  expectInvalid(validation.validateShip(["60", "70", "80"], config));
});

test("fleets reject overlapping ships", function() {
  var ships = [
    { locations: ["00", "01", "02"] },
    { locations: ["02", "12", "22"] },
    { locations: ["40", "41", "42"] }
  ];
  expectInvalid(validation.validateFleet(ships, config));
});
