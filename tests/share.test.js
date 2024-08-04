var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var share = context.gameShare;

test("share summaries describe the completed game", function() {
  var text = share.buildSummary("won", 7, { accuracy: 71 }, "hard");
  helpers.assertEqual(text, "I won Battleship on hard difficulty in 7 guesses with 71% accuracy.");
});

test("sharing safely reports unavailable environments", function() {
  share.share("test result").then(function(shared) {
    helpers.assertEqual(shared, false);
  });
});
