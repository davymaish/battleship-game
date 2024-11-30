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
test("historical daily challenge dates produce replayable descriptions", function() {
  var details = challenge.describeDate("2024-11-30");
  helpers.assert(details !== null);
  helpers.assertEqual(details.date, "2024-11-30");
  helpers.assertEqual(details.seed, challenge.seedForDate("2024-11-30"));
});
test("historical daily challenge dates reject invalid calendar values", function() {
  helpers.assert(!challenge.isDateKey("2024-02-30"));
  helpers.assertEqual(challenge.describeDate("2024-02-30"), null);
  helpers.assert(!challenge.isDateKey("not-a-date"));
});
test("daily challenge codes round-trip their historical date", function() {
  var code = challenge.createCode("2024-11-30");
  var details = challenge.parseCode(code);
  helpers.assertEqual(code, details.code);
  helpers.assertEqual(details.date, "2024-11-30");
  helpers.assertEqual(details.seed, challenge.seedForDate("2024-11-30"));
});
test("daily challenge codes reject malformed and tampered values", function() {
  helpers.assertEqual(challenge.parseCode("DC-20241130-00000000"), null);
  helpers.assertEqual(challenge.parseCode("2024-11-30"), null);
  helpers.assertEqual(challenge.parseCode("DC-20240230-00000000"), null);
});
