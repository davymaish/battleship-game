var tests = [];

function test(name, callback) {
  tests.push({ name: name, callback: callback });
}

global.test = test;

function run() {
  var failures = [];
  tests.forEach(function(currentTest) {
    try {
      currentTest.callback();
      console.log("PASS " + currentTest.name);
    } catch (error) {
      failures.push({ name: currentTest.name, error: error });
      console.error("FAIL " + currentTest.name + ": " + error.message);
    }
  });

  console.log("\n" + (tests.length - failures.length) + "/" + tests.length + " tests passed");
  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

require("./validation.test.js");
require("./model.test.js");
require("./challenge.test.js");
require("./challenge-stats.test.js");
require("./challenge-streaks.test.js");
require("./storage.test.js");
require("./stats.test.js");
require("./difficulty.test.js");
require("./results.test.js");
require("./results-history.test.js");
require("./achievements.test.js");
require("./leaderboard.test.js");
require("./challenge-leaderboard.test.js");
require("./challenge-calendar.test.js");
require("./streaks.test.js");
require("./session.test.js");
require("./keyboard.test.js");
require("./theme.test.js");
require("./audio.test.js");
require("./shot-history.test.js");
require("./layout.test.js");
require("./pwa.test.js");
require("./analytics.test.js");
require("./preferences.test.js");
require("./share.test.js");
run();
