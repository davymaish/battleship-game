var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var audio = context.gameAudio;

test("audio starts enabled", function() {
  audio.enabled = true;
  helpers.assert(audio.enabled);
});

test("audio toggle changes the enabled state", function() {
  audio.enabled = true;
  helpers.assertEqual(audio.toggle(), false);
  helpers.assertEqual(audio.toggle(), true);
});

test("audio playback safely returns false without a browser", function() {
  audio.enabled = true;
  helpers.assertEqual(audio.playHit(), false);
});
