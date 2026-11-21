var helpers = require("./test-helpers.js");
var context = helpers.loadGameContext();
var keyboard = context.gameKeyboard;

test("arrow keys move to adjacent cells", function() {
  helpers.assertDeepEqual(keyboard.nextCell(2, 2, "ArrowUp", 7), { row: 1, column: 2 });
  helpers.assertDeepEqual(keyboard.nextCell(2, 2, "ArrowDown", 7), { row: 3, column: 2 });
  helpers.assertDeepEqual(keyboard.nextCell(2, 2, "ArrowLeft", 7), { row: 2, column: 1 });
  helpers.assertDeepEqual(keyboard.nextCell(2, 2, "ArrowRight", 7), { row: 2, column: 3 });
});

test("movement stops at board edges", function() {
  helpers.assertDeepEqual(keyboard.nextCell(0, 0, "ArrowUp", 7), { row: 0, column: 0 });
  helpers.assertDeepEqual(keyboard.nextCell(6, 6, "ArrowRight", 7), { row: 6, column: 6 });
});

test("non-arrow keys are ignored", function() {
  helpers.assertEqual(keyboard.nextCell(2, 2, "Enter", 7), null);
});
