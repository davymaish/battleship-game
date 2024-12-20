var fs = require("fs");
var helpers = require("./test-helpers.js");

var html = fs.readFileSync("index.html", "utf8");
var css = fs.readFileSync("assets/styles.css", "utf8");
var viewSource = fs.readFileSync("assets/game-view.js", "utf8");

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

test("historical daily challenge replay controls are exposed", function() {
  helpers.assert(html.indexOf('id="challengeDateInput"') >= 0);
  helpers.assert(html.indexOf('id="challengeReplayButton"') >= 0);
});

test("daily challenge code replay controls are exposed", function() {
  helpers.assert(html.indexOf('id="challengeCodeInput"') >= 0);
  helpers.assert(html.indexOf('id="challengeCodeButton"') >= 0);
});

test("active daily challenge codes are exposed for sharing", function() {
  helpers.assert(html.indexOf('id="dailyChallengeCode"') >= 0);
  helpers.assert(html.indexOf('id="copyChallengeCodeButton"') >= 0);
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

test("daily challenge code history loads before the view", function() {
  helpers.assert(html.indexOf('id="dailyChallengeCodesTitle"') >= 0);
  helpers.assert(html.indexOf('id="dailyChallengeCodes"') >= 0);
  helpers.assert(html.indexOf("assets/game-challenge.js") < html.indexOf("assets/game-challenge-code-history.js"));
  helpers.assert(html.indexOf("assets/game-challenge-code-history.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge code history supports one-click replay", function() {
  helpers.assert(html.indexOf('id="dailyChallengeCodes"') >= 0);
});

test("daily challenge code history supports sharing each code", function() {
  helpers.assert(viewSource.indexOf('share.innerHTML = "Share"') >= 0);
  helpers.assert(viewSource.indexOf("controller.shareChallengeCode(entry.code)") >= 0);
  helpers.assert(viewSource.indexOf("Share daily challenge ") >= 0);
});

test("daily challenge insights load before the view", function() {
  helpers.assert(html.indexOf("assets/game-challenge-calendar.js") < html.indexOf("assets/game-challenge-insights.js"));
  helpers.assert(html.indexOf("assets/game-challenge-insights.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge achievements load before the view", function() {
  helpers.assert(html.indexOf("assets/game-challenge-insights.js") < html.indexOf("assets/game-challenge-achievements.js"));
  helpers.assert(html.indexOf("assets/game-challenge-achievements.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge sharing loads before the view", function() {
  helpers.assert(html.indexOf("assets/game-challenge-achievements.js") < html.indexOf("assets/game-challenge-share.js"));
  helpers.assert(html.indexOf("assets/game-challenge-share.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge exports load before the view", function() {
  helpers.assert(html.indexOf('id="exportChallengeButton"') >= 0);
  helpers.assert(html.indexOf("assets/game-challenge-share.js") < html.indexOf("assets/game-challenge-export.js"));
  helpers.assert(html.indexOf("assets/game-challenge-export.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge imports load after exports and before the view", function() {
  helpers.assert(html.indexOf('id="importChallengeButton"') >= 0);
  helpers.assert(html.indexOf("assets/game-challenge-export.js") < html.indexOf("assets/game-challenge-import.js"));
  helpers.assert(html.indexOf("assets/game-challenge-import.js") < html.indexOf("assets/game-view.js"));
});

test("daily challenge integrity loads before export and import", function() {
  helpers.assert(html.indexOf("assets/game-challenge-share.js") < html.indexOf("assets/game-challenge-integrity.js"));
  helpers.assert(html.indexOf("assets/game-challenge-integrity.js") < html.indexOf("assets/game-challenge-export.js"));
  helpers.assert(html.indexOf("assets/game-challenge-integrity.js") < html.indexOf("assets/game-challenge-import.js"));
});
