var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var challenge = context.gameChallenge;
test("daily challenge keys use UTC calendar dates", function() {
  var date = { getUTCFullYear: function() { return 2024; }, getUTCMonth: function() { return 8; }, getUTCDate: function() { return 7; } };
  helpers.assertEqual(challenge.dateKey(date), "2024-09-07");
});
test("the same daily challenge date always produces the same seed", function() {
  helpers.assertEqual(challenge.seedForDate("2024-09-07"), challenge.seedForDate("2024-09-07"));
  helpers.assert(challenge.seedForDate("2024-09-07") !== challenge.seedForDate("2024-09-08"));
});
test("daily challenge descriptions include date and seed", function() {
  var details = challenge.describe({ getUTCFullYear: function() { return 2024; }, getUTCMonth: function() { return 8; }, getUTCDate: function() { return 7; } });
  helpers.assertEqual(details.date, "2024-09-07");
  helpers.assertEqual(details.seed, challenge.seedForDate(details.date));
  helpers.assertEqual(details.label, "Daily challenge — 2024-09-07");
});
