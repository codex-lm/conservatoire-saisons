"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../src/core.js");
const levels = require("../src/levels.js");
const glasshouse = levels.find((level) => level.id === "glasshouse-gate");

function act(game, action) {
  const result = game.dispatch(action);
  assert.equal(result.ok, true, result.reason);
  return result;
}

function move(game, direction, count = 1) {
  for (let index = 0; index < count; index += 1) act(game, { type: "move", direction });
}

const firstSolution = [
  { type: "season", season: "autumn" },
  { type: "season", season: "winter" },
  ...Array(2).fill({ type: "move", direction: "up" }),
  ...Array(4).fill({ type: "move", direction: "right" }),
  { type: "move", direction: "up" },
  { type: "move", direction: "right" },
  { type: "season", season: "spring" },
  ...Array(2).fill({ type: "move", direction: "right" }),
  { type: "season", season: "summer" },
  ...Array(2).fill({ type: "move", direction: "right" }),
  { type: "move", direction: "up" },
  ...Array(2).fill({ type: "move", direction: "down" })
];

test("first garden combines all four seasons and reaches its exit", () => {
  const game = new Core.Game(glasshouse);
  firstSolution.forEach((action) => act(game, action));
  assert.equal(game.state.completed, true);
  assert.equal(game.state.seedTaken, true);
  assert.equal(game.state.objects.find((object) => object.id === "fruit-a").x, 6);
  assert.equal(game.state.objects.find((object) => object.id === "fruit-a").y, 3);
});

test("season changes are reversible while released fruit and planters persist", () => {
  const game = new Core.Game(glasshouse);
  const planter = Core.clone(game.state.objects.find((object) => object.type === "planter"));
  act(game, { type: "season", season: "autumn" });
  const fruit = game.state.objects.find((object) => object.type === "fruit");
  assert.equal(fruit.released, true);
  act(game, { type: "season", season: "winter" });
  act(game, { type: "season", season: "spring" });
  assert.deepEqual(game.state.objects.find((object) => object.type === "fruit"), fruit);
  assert.deepEqual(game.state.objects.find((object) => object.type === "planter"), planter);
  assert.equal(Core.tileAt(glasshouse, 4, 3), "w");
  assert.equal(Core.supports(game.state, glasshouse, 4, 3, false), false);
  act(game, { type: "season", season: "winter" });
  assert.equal(Core.supports(game.state, glasshouse, 4, 3, false), true);
});

test("a season cannot strand the guardian or an object", () => {
  const game = new Core.Game(glasshouse);
  act(game, { type: "season", season: "winter" });
  move(game, "up", 2);
  move(game, "right", 3);
  assert.deepEqual(game.state.player, { x: 4, y: 3 });
  const before = Core.clone(game.state);
  const refused = game.dispatch({ type: "season", season: "summer" });
  assert.equal(refused.ok, false);
  assert.equal(refused.reason, "unsafePlayer");
  assert.deepEqual(game.state, before);
});

test("undo restores the complete state including fruit release and season", () => {
  const game = new Core.Game(glasshouse);
  const initial = Core.clone(game.state);
  act(game, { type: "season", season: "autumn" });
  act(game, { type: "undo" });
  assert.deepEqual(game.state, initial);
  firstSolution.slice(0, 7).forEach((action) => act(game, action));
  const before = Core.clone(game.state);
  move(game, "right");
  act(game, { type: "undo" });
  assert.deepEqual(game.state, before);
});

test("reset restores every object and clears the action history", () => {
  const game = new Core.Game(glasshouse);
  firstSolution.forEach((action) => act(game, action));
  act(game, { type: "reset" });
  assert.deepEqual(game.state, Core.initialState(glasshouse));
  assert.equal(game.history.length, 0);
});

test("save restores progress and remaining undo history", () => {
  const game = new Core.Game(glasshouse);
  firstSolution.slice(0, 7).forEach((action) => act(game, action));
  const restored = Core.Game.restore(glasshouse, game.serialize());
  assert.deepEqual(restored.state, game.state);
  assert.deepEqual(restored.history, game.history);
  act(restored, { type: "undo" });
  assert.deepEqual(restored.state, game.history[game.history.length - 1]);
});

test("corrupt or impossible saves safely start a fresh garden", () => {
  const game = Core.Game.restore(glasshouse, "not json");
  assert.deepEqual(game.state, Core.initialState(glasshouse));
  const invalid = JSON.parse(new Core.Game(glasshouse).serialize());
  invalid.state.player = { x: 4, y: 3 };
  const restored = Core.Game.restore(glasshouse, invalid);
  assert.deepEqual(restored.state, Core.initialState(glasshouse));
});

test("click pathfinding uses ordinary legal moves and pushing", () => {
  const game = new Core.Game(glasshouse);
  act(game, { type: "season", season: "autumn" });
  act(game, { type: "season", season: "winter" });
  const path = Core.findPath(game.state, glasshouse, { x: 3, y: 3 });
  assert.ok(Array.isArray(path));
  path.forEach((action) => act(game, action));
  assert.deepEqual(game.state.player, { x: 3, y: 3 });
  assert.equal(game.state.objects[0].x, 4);
  assert.ok(game.history.length > 0);
});

test("door needs summer and every pressure plate weighted by an object", () => {
  const game = new Core.Game(glasshouse);
  act(game, { type: "season", season: "summer" });
  assert.equal(Core.doorOpen(game.state, glasshouse), false);
  const plate = Core.plates(glasshouse)[0];
  game.state.objects.find((object) => object.type === "planter").x = plate.x;
  game.state.objects.find((object) => object.type === "planter").y = plate.y;
  assert.equal(Core.doorOpen(game.state, glasshouse), true);
  act(game, { type: "season", season: "autumn" });
  assert.equal(Core.doorOpen(game.state, glasshouse), false);
});
