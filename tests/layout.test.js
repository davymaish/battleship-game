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

test("win streaks are exposed in the page structure", function() {
  helpers.assert(html.indexOf('id="streakSummary"') >= 0);
  helpers.assert(html.indexOf("assets/game-leaderboard.js") < html.indexOf("assets/game-streaks.js"));
  helpers.assert(html.indexOf("assets/game-streaks.js") < html.indexOf("assets/game-view.js"));
});

test("recent results are exposed in the page structure", function() {
  helpers.assert(html.indexOf('id="recentResultsTitle"') >= 0);
  helpers.assert(html.indexOf('id="recentResults"') >= 0);
  helpers.assert(html.indexOf("assets/game-results.js") < html.indexOf("assets/game-results-history.js"));
  helpers.assert(html.indexOf("assets/game-results-history.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge controls are exposed in the page structure", function() {
  helpers.assert(html.indexOf('id="dailyChallengeSummary"') >= 0);
  helpers.assert(html.indexOf('id="dailyChallengeResults"') >= 0);
  helpers.assert(html.indexOf('id="dailyChallengeInsights"') >= 0);
  helpers.assert(html.indexOf('id="dailyChallengeAchievementsTitle"') >= 0);
  helpers.assert(html.indexOf('id="dailyChallengeAchievements"') >= 0);
  helpers.assert(html.indexOf('id="dailyChallengeStreak"') >= 0);
  helpers.assert(html.indexOf('id="dailyChallengeLeaderboardTitle"') >= 0);
  helpers.assert(html.indexOf('id="dailyChallengeLeaderboard"') >= 0);
  helpers.assert(html.indexOf('id="dailyChallengeCalendarTitle"') >= 0);
  helpers.assert(html.indexOf('id="dailyChallengeCalendar"') >= 0);
  helpers.assert(html.indexOf('id="challengeButton"') >= 0);
  helpers.assert(html.indexOf("assets/game-random.js") < html.indexOf("assets/game-challenge.js"));
  helpers.assert(html.indexOf("assets/game-challenge.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge statistics load before the view", function() {
  helpers.assert(html.indexOf("assets/game-challenge.js") < html.indexOf("assets/game-challenge-stats.js"));
  helpers.assert(html.indexOf("assets/game-challenge-stats.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge streaks load after challenge statistics", function() {
  helpers.assert(html.indexOf("assets/game-challenge-stats.js") < html.indexOf("assets/game-challenge-streaks.js"));
  helpers.assert(html.indexOf("assets/game-challenge-streaks.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge leaderboard loads before the view", function() {
  helpers.assert(html.indexOf("assets/game-challenge-streaks.js") < html.indexOf("assets/game-challenge-leaderboard.js"));
  helpers.assert(html.indexOf("assets/game-challenge-leaderboard.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge calendar loads before the view", function() {
  helpers.assert(html.indexOf("assets/game-challenge-leaderboard.js") < html.indexOf("assets/game-challenge-calendar.js"));
  helpers.assert(html.indexOf("assets/game-challenge-calendar.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge insights load before the view", function() {
  helpers.assert(html.indexOf("assets/game-challenge-calendar.js") < html.indexOf("assets/game-challenge-insights.js"));
  helpers.assert(html.indexOf("assets/game-challenge-insights.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge achievements load before the view", function() {
  helpers.assert(html.indexOf("assets/game-challenge-insights.js") < html.indexOf("assets/game-challenge-achievements.js"));
  helpers.assert(html.indexOf("assets/game-challenge-achievements.js") < html.indexOf("assets/game-view.js"));
});
