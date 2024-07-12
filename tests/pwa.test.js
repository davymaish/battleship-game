var fs = require("fs");
var helpers = require("./test-helpers.js");
var html = fs.readFileSync("index.html", "utf8");
var worker = fs.readFileSync("service-worker.js", "utf8");
var registration = fs.readFileSync("assets/pwa.js", "utf8");

test("the page links the installable manifest", function() {
  helpers.assert(html.indexOf('rel="manifest"') >= 0);
  helpers.assert(html.indexOf("./manifest.json") >= 0);
});

test("the service worker registers and defines an app shell", function() {
  helpers.assert(registration.indexOf("serviceWorker.register") >= 0);
  helpers.assert(worker.indexOf("caches.open") >= 0);
  helpers.assert(worker.indexOf("./index.html") >= 0);
});
