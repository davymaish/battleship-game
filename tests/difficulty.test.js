var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var difficulty = context.gameDifficulty;
var config = context.gameConfig;

test("normal is the default difficulty", function() {
  helpers.assertEqual(difficulty.current, "normal");
  helpers.assertEqual(difficulty.get("normal").timeLimitSeconds, 60);
});

test("applying easy updates the game rules", function() {
  difficulty.apply("easy", config);
  helpers.assertEqual(config.numShips, 2);
  helpers.assertEqual(config.timeLimitSeconds, 90);
  helpers.assertEqual(config.minimumShipsToWin, 1);
  helpers.assertEqual(difficulty.current, "easy");
});

test("applying hard increases the challenge", function() {
  difficulty.apply("hard", config);
  helpers.assertEqual(config.numShips, 4);
  helpers.assertEqual(config.timeLimitSeconds, 45);
  helpers.assertEqual(config.minimumShipsToWin, 3);
  helpers.assertEqual(difficulty.current, "hard");
});

test("unknown difficulty names fall back to normal", function() {
  var preset = difficulty.apply("unknown", config);
  helpers.assertEqual(preset.label, "Normal");
  helpers.assertEqual(difficulty.current, "normal");
});
