"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../src/core.js");
const levels = require("../src/levels.js");
const solutions = require("./solutions.js");

test("all seven documented solutions collect their seed and finish legally", () => {
  assert.equal(levels.length, 7);
  assert.equal(solutions.length, 7);
  levels.forEach(function (level, index) {
    const solution = solutions[index];
    assert.equal(solution.levelId, level.id);
    const game = new Core.Game(level);
    assert.ok(Core.validState(game.state, level), level.id + " initial state");
    solution.actions.forEach(function (action, actionIndex) {
      const before = Core.clone(game.state);
      const result = game.dispatch(action);
      assert.ok(result.ok, level.id + " action " + (actionIndex + 1) + ": " + result.reason);
      assert.ok(Core.validState(game.state, level), level.id + " valid after action " + (actionIndex + 1));
      assert.notDeepEqual(game.state, before, level.id + " action changes state");
    });
    assert.equal(game.state.seedTaken, true, level.id + " seed");
    assert.equal(game.state.completed, true, level.id + " completion");
    assert.deepEqual(game.state.player, level.exit, level.id + " exit");
  });
});

test("every level has a rectangular map, three translated hints and supported objectives", () => {
  levels.forEach(function (level) {
    const width = level.map[0].length;
    level.map.forEach(function (row) { assert.equal(row.length, width, level.id + " rectangular map"); });
    ["en", "fr", "es"].forEach(function (language) {
      assert.equal(level.hints[language].length, 3, level.id + " " + language + " hints");
      assert.ok(level.name[language] && level.subtitle[language]);
    });
    ["winter", "spring", "summer", "autumn"].forEach(function (season) {
      const state = Core.initialState(level);
      state.season = season;
      assert.ok(Core.supports(state, level, level.seed.x, level.seed.y, false), level.id + " seed support");
      assert.ok(Core.supports(state, level, level.exit.x, level.exit.y, false), level.id + " exit support");
    });
  });
});

test("undo and reset remain available after every solution prefix", () => {
  levels.forEach(function (level, index) {
    const game = new Core.Game(level);
    solutions[index].actions.forEach(function (action) {
      const result = game.dispatch(action);
      assert.ok(result.ok);
      if (game.state.completed) return;
      const snapshot = Core.clone(game.state);
      assert.ok(game.dispatch({ type: "undo" }).ok, level.id + " undo");
      assert.ok(game.dispatch(action).ok, level.id + " redo");
      assert.deepEqual(game.state, snapshot);
    });
    game.dispatch({ type: "reset" });
    assert.deepEqual(game.state, Core.initialState(level));
    assert.equal(game.history.length, 0);
  });
});

test("refused season changes never mutate state or consume undo history", () => {
  levels.forEach(function (level) {
    const game = new Core.Game(level);
    ["winter", "spring", "summer", "autumn"].forEach(function (season) {
      const before = Core.clone(game.state);
      const history = game.history.length;
      const result = game.dispatch({ type: "season", season: season });
      if (!result.ok) {
        assert.deepEqual(game.state, before);
        assert.equal(game.history.length, history);
      }
    });
  });
});
