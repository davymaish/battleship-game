var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var theme = context.gameTheme;

test("classic is the default theme", function() {
  helpers.assertEqual(theme.current, "classic");
  helpers.assert(theme.isAvailable("classic"));
});

test("available themes can be selected", function() {
  helpers.assertEqual(theme.apply("ocean"), "ocean");
  helpers.assertEqual(theme.current, "ocean");
  helpers.assertEqual(theme.apply("contrast"), "contrast");
  helpers.assertEqual(theme.current, "contrast");
});

test("unknown themes fall back to classic", function() {
  helpers.assertEqual(theme.apply("unknown"), "classic");
  helpers.assert(!theme.isAvailable("unknown"));
});
