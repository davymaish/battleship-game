var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var achievements = context.gameAchievements;
var storage = context.gameStorage;
function createMemoryStorage() {
  var values = {};
  return {
    setItem: function(key, value) { values[key] = value; },
    getItem: function(key) { return values[key] || null; },
    removeItem: function(key) { delete values[key]; }
  };
}
function record(outcome, guesses, accuracy, difficulty) {
  return { outcome: outcome, guesses: guesses, accuracy: accuracy, difficulty: difficulty };
}
test("achievements unlock from qualifying results", function() {
  storage.storage = createMemoryStorage();
  achievements.clear();
  var won = record("won", 6, 85, "hard");
  var newlyUnlocked = achievements.evaluate(won, [won]);
  helpers.assertEqual(newlyUnlocked.length, 4);
  helpers.assertEqual(achievements.unlocked.length, 4);
  helpers.assertEqual(achievements.list().filter(function(item) { return item.unlocked; }).length, 4);
});
test("achievements do not unlock from losses or duplicate results", function() {
  storage.storage = createMemoryStorage();
  achievements.clear();
  var lost = record("lost", 4, 100, "hard");
  helpers.assertEqual(achievements.evaluate(lost, [lost]).length, 0);
  var won = record("won", 8, 90, "normal");
  helpers.assertEqual(achievements.evaluate(won, [won]).length, 2);
  helpers.assertEqual(achievements.evaluate(won, [won]).length, 0);
});
test("achievements load invalid data safely", function() {
  var memory = createMemoryStorage();
  storage.storage = memory;
  memory.setItem(achievements.key, "invalid-json");
  achievements.load();
  helpers.assertEqual(achievements.unlocked.length, 0);
});
