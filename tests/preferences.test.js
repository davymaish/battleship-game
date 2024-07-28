var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var preferences = context.gamePreferences;
var storage = context.gameStorage;

function memory() {
  var values = {};
  return {
    setItem: function(key, value) { values[key] = value; },
    getItem: function(key) { return values[key] || null; },
    removeItem: function(key) { delete values[key]; }
  };
}

test("preferences use safe defaults", function() {
  storage.storage = memory();
  var value = preferences.load();
  helpers.assertDeepEqual(value, { difficulty: "normal", theme: "classic", audioEnabled: true });
});

test("preferences persist valid player choices", function() {
  storage.storage = memory();
  var value = { difficulty: "hard", theme: "ocean", audioEnabled: false };
  helpers.assert(preferences.save(value));
  helpers.assertDeepEqual(preferences.load(), value);
});

test("invalid preference choices fall back safely", function() {
  storage.storage = memory();
  preferences.save({ difficulty: "unknown", theme: "unknown", audioEnabled: "no" });
  helpers.assertDeepEqual(preferences.load(), { difficulty: "normal", theme: "classic", audioEnabled: true });
});
