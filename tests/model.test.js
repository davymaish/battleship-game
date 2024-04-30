var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var model = context.model;
var random = context.gameRandom;
var config = context.gameConfig;

function generateWithSeed(seed) {
  random.setSeed(seed);
  model.generateShipLocations();
  return JSON.parse(JSON.stringify(model.ships));
}

test("seeded generation produces a valid non-overlapping fleet", function() {
  var fleet = generateWithSeed(2024);
  helpers.assertEqual(fleet.length, config.numShips);
  helpers.assert(context.gameValidation.validateFleet(fleet, config).valid);
});

test("the same seed produces the same fleet layout", function() {
  var firstFleet = generateWithSeed(42);
  var secondFleet = generateWithSeed(42);
  helpers.assertDeepEqual(secondFleet, firstFleet);
});

test("firing reports misses and hits", function() {
  model.ships = [
    { locations: ["00", "01", "02"], hits: ["", "", ""] }
  ];
  model.numShips = 1;
  model.shipLength = 3;
  model.shipsSunk = 0;

  var miss = model.fire("66");
  helpers.assert(!miss.hit, "A shot outside a ship should miss.");

  var hit = model.fire("00");
  helpers.assert(hit.hit && !hit.sunk && !hit.alreadyHit);

  var repeatedHit = model.fire("00");
  helpers.assert(repeatedHit.hit && repeatedHit.alreadyHit);
});

test("firing all ship cells increments sunk ships once", function() {
  model.ships = [
    { locations: ["10", "11", "12"], hits: ["", "", ""] }
  ];
  model.numShips = 1;
  model.shipLength = 3;
  model.shipsSunk = 0;

  model.fire("10");
  model.fire("11");
  var finalHit = model.fire("12");

  helpers.assert(finalHit.sunk, "The final hit should sink the ship.");
  helpers.assertEqual(model.shipsSunk, 1);
});
