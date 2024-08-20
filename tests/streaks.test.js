var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var streaks = context.gameStreaks;
function result(outcome) {
  return { outcome: outcome };
}
test("streaks count consecutive recent wins", function() {
  var records = [result("won"), result("won"), result("lost"), result("won")];
  helpers.assertEqual(streaks.current(records), 2);
  helpers.assertEqual(streaks.best(records), 2);
});
test("streaks find the longest run in chronological history", function() {
  var records = [result("won"), result("lost"), result("won"), result("won"), result("won"), result("lost")];
  helpers.assertEqual(streaks.current(records), 1);
  helpers.assertEqual(streaks.best(records), 3);
});
test("streaks handle empty or missing history", function() {
  helpers.assertEqual(streaks.current([]), 0);
  helpers.assertEqual(streaks.best(), 0);
  helpers.assertEqual(streaks.summary([]), "Win streak: 0 | Best: 0");
});
