var fs = require("fs");
var vm = require("vm");

function loadGameContext() {
  var context = {
    Number: Number,
    Set: Set,
    Math: Math,
    JSON: JSON,
    Object: Object,
    Array: Array,
    console: console
  };
  vm.createContext(context);

  [
    "assets/game-config.js",
    "assets/game-validation.js",
    "assets/game-random.js",
    "assets/game-storage.js",
    "assets/game-model.js"
  ].forEach(function(file) {
    vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  });

  return context;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Expected condition to be true.");
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error((message || "Values are not equal.") + " Expected " + expected + ", received " + actual + ".");
  }
}

function assertDeepEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error((message || "Values are not deeply equal.") + " Expected " + JSON.stringify(expected) + ", received " + JSON.stringify(actual) + ".");
  }
}

function assertThrows(callback, message) {
  var threw = false;
  try {
    callback();
  } catch (error) {
    threw = true;
  }
  assert(threw, message || "Expected callback to throw.");
}

module.exports = {
  loadGameContext: loadGameContext,
  assert: assert,
  assertEqual: assertEqual,
  assertDeepEqual: assertDeepEqual,
  assertThrows: assertThrows
};
