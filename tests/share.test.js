var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var share = context.gameShare;

test("share summaries describe the completed game", function() {
  var text = share.buildSummary("won", 7, { accuracy: 71 }, "hard");
  helpers.assertEqual(text, "I won Battleship on hard difficulty in 7 guesses with 71% accuracy.");
});

test("share summaries identify daily challenge games", function() {
  var text = share.buildSummary("won", 6, { accuracy: 83 }, "normal", "2024-09-07");
  helpers.assertEqual(text, "I won Battleship on normal difficulty in the daily challenge for 2024-09-07 in 6 guesses with 83% accuracy.");
});

test("sharing safely reports unavailable environments", function() {
  share.share("test result").then(function(shared) {
    helpers.assertEqual(shared, false);
  });
});

test("challenge-code sharing safely reports unavailable environments", function() {
  share.shareCode("DC-20241202-12345678").then(function(shared) {
    helpers.assertEqual(shared, false);
  });
});
