var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var analytics = context.gameAnalytics;
var config = context.gameConfig;
var model = context.model;

var stats = {
  shots: 4,
  accuracy: function() { return 50; }
};

test("current analytics reports remaining ships and target", function() {
  model.numShips = 3;
  model.shipsSunk = 1;
  var current = analytics.current(stats, model, config);
  helpers.assertEqual(current.remainingShips, 2);
  helpers.assertEqual(current.shots, 4);
  helpers.assertEqual(current.accuracy, 50);
  helpers.assertEqual(current.target, config.minimumShipsToWin);
});

test("historical analytics counts outcomes and average guesses", function() {
  var summary = analytics.historical([
    { outcome: "won", guesses: 8 },
    { outcome: "lost", guesses: 5 },
    { outcome: "won", guesses: 9 }
  ]);
  helpers.assertDeepEqual(summary, { games: 3, wins: 2, losses: 1, averageGuesses: 7 });
});
