var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var stats = context.gameStats;

function reset() {
  stats.reset();
}

test("statistics start empty", function() {
  reset();
  helpers.assertDeepEqual(stats.summary(), { shots: 0, hits: 0, misses: 0, shipsSunk: 0, accuracy: 0 });
});

test("statistics count hits, misses, and sunk ships", function() {
  reset();
  stats.record({ hit: true, sunk: false, alreadyHit: false });
  stats.record({ hit: false, sunk: false, alreadyHit: false });
  stats.record({ hit: true, sunk: true, alreadyHit: false });
  helpers.assertDeepEqual(stats.summary(), { shots: 3, hits: 2, misses: 1, shipsSunk: 1, accuracy: 67 });
});

test("repeated shots do not change statistics", function() {
  reset();
  stats.record({ hit: true, sunk: false, alreadyHit: false });
  stats.record({ hit: true, sunk: false, alreadyHit: true });
  helpers.assertEqual(stats.shots, 1);
  helpers.assertEqual(stats.hits, 1);
});
