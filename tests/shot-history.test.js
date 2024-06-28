var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var history = context.gameShotHistory;

test("shot history records readable hit and miss entries", function() {
  history.reset();
  history.record({ location: "00", hit: true, sunk: false, alreadyHit: false });
  history.record({ location: "12", hit: true, sunk: true, alreadyHit: false });
  history.record({ location: "66", hit: false, sunk: false, alreadyHit: false });
  helpers.assertEqual(history.entries.length, 3);
  helpers.assertEqual(history.label(history.entries[1]), "12 — hit and sunk a ship");
  helpers.assertEqual(history.label(history.entries[2]), "66 — miss");
});

test("duplicate shots are excluded and history can be restored", function() {
  history.reset();
  history.record({ location: "00", hit: true, sunk: false, alreadyHit: true });
  helpers.assertEqual(history.entries.length, 0);
  history.restore([
    { location: "01", hit: false, sunk: false, alreadyHit: false },
    { location: "02", hit: true, sunk: false, alreadyHit: false }
  ]);
  helpers.assertEqual(history.entries.length, 2);
});
