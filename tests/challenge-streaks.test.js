var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var streaks = context.gameChallengeStreaks;
function result(outcome, challengeDate) {
  return { outcome: outcome, challengeDate: challengeDate };
}

test("daily challenge streaks count consecutive winning dates", function() {
  var records = [
    result("won", "2024-09-12"),
    result("won", "2024-09-11"),
    result("lost", "2024-09-10"),
    result("won", "2024-09-08"),
    result("won", "2024-09-07")
  ];
  helpers.assertEqual(streaks.current(records), 2);
  helpers.assertEqual(streaks.best(records), 2);
});

test("daily challenge streaks reset after a loss or a calendar gap", function() {
  var records = [
    result("lost", "2024-09-14"),
    result("won", "2024-09-13"),
    result("won", "2024-09-12"),
    result("won", "2024-09-10")
  ];
  helpers.assertEqual(streaks.current(records), 0);
  helpers.assertEqual(streaks.best(records), 2);
});

test("daily challenge streaks ignore duplicate dates and ordinary games", function() {
  var records = [
    result("won", "2024-09-12"),
    result("won", "2024-09-12"),
    result("won", null),
    result("won", "2024-09-11")
  ];
  helpers.assertEqual(streaks.current(records), 2);
  helpers.assertEqual(streaks.best(records), 2);
});

test("daily challenge streaks format a readable summary", function() {
  helpers.assertEqual(streaks.summary([]), "Daily challenge streak: 0 | Best: 0");
});
