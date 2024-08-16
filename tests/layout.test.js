var fs = require("fs");
var helpers = require("./test-helpers.js");

var html = fs.readFileSync("index.html", "utf8");
var css = fs.readFileSync("assets/styles.css", "utf8");

test("the page declares a responsive viewport", function() {
  helpers.assert(html.indexOf('name="viewport"') >= 0);
  helpers.assert(html.indexOf("width=device-width") >= 0);
});

test("mobile layout includes narrow-screen safeguards", function() {
  helpers.assert(css.indexOf("@media (max-width: 700px)") >= 0);
  helpers.assert(css.indexOf("@media (max-width: 420px)") >= 0);
  helpers.assert(css.indexOf("#shotHistory") >= 0);
});

test("achievements are exposed in the page structure", function() {
  helpers.assert(html.indexOf('id="achievementsSummary"') >= 0);
  helpers.assert(html.indexOf("assets/game-results.js") < html.indexOf("assets/game-achievements.js"));
  helpers.assert(html.indexOf("assets/game-achievements.js") < html.indexOf("assets/game-view.js"));
});

test("the personal leaderboard is exposed in the page structure", function() {
  helpers.assert(html.indexOf('id="leaderboardTitle"') >= 0);
  helpers.assert(html.indexOf('id="leaderboard"') >= 0);
  helpers.assert(html.indexOf("assets/game-achievements.js") < html.indexOf("assets/game-leaderboard.js"));
  helpers.assert(html.indexOf("assets/game-leaderboard.js") < html.indexOf("assets/game-view.js"));
});
