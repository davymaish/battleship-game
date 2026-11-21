var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var storage = context.gameStorage;

function createMemoryStorage() {
  var values = {};
  return {
    setItem: function(key, value) { values[key] = value; },
    getItem: function(key) { return values[key] || null; },
    removeItem: function(key) { delete values[key]; }
  };
}

test("sessions can be saved and loaded as structured data", function() {
  storage.storage = createMemoryStorage();
  var session = { guesses: 3, state: "playing", shots: [{ location: "00", hit: true }] };
  helpers.assert(storage.save(session));
  helpers.assertDeepEqual(storage.load(), session);
});

test("clearing a session removes the saved game", function() {
  storage.storage = createMemoryStorage();
  storage.save({ guesses: 1 });
  helpers.assert(storage.clear());
  helpers.assertEqual(storage.load(), null);
});

test("corrupt session data is cleared safely", function() {
  var memory = createMemoryStorage();
  storage.storage = memory;
  memory.setItem(storage.key, "not-json");
  helpers.assertEqual(storage.load(), null);
  helpers.assertEqual(memory.getItem(storage.key), null);
});
