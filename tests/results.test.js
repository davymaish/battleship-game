var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var results = context.gameResults;
var storage = context.gameStorage;

function createMemoryStorage() {
  var values = {};
  return {
    setItem: function(key, value) { values[key] = value; },
    getItem: function(key) { return values[key] || null; },
    removeItem: function(key) { delete values[key]; }
  };
}

test("results record wins and expose the best score", function() {
  storage.storage = createMemoryStorage();
  results.clear();
  results.record("won", { shipsSunk: 3, shots: 8, accuracy: 75 }, 8, "normal");
  results.record("won", { shipsSunk: 3, shots: 6, accuracy: 83 }, 6, "hard");
  results.record("lost", { shipsSunk: 1, shots: 5, accuracy: 20 }, 5, "easy");
  helpers.assertEqual(results.bestScore(), 6);
  helpers.assertEqual(results.records.length, 3);
});

test("results retain only the most recent twenty records", function() {
  storage.storage = createMemoryStorage();
  results.clear();
  for (var i = 0; i < 25; i++) {
    results.record("lost", { shipsSunk: 0, shots: i + 1, accuracy: 0 }, i + 1, "normal");
  }
  helpers.assertEqual(results.records.length, 20);
});

test("results load invalid data as an empty history", function() {
  var memory = createMemoryStorage();
  storage.storage = memory;
  memory.setItem(results.key, "invalid-json");
  results.load();
  helpers.assertEqual(results.records.length, 0);
});
