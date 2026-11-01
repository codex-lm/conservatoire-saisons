(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ConservatoryCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SEASONS = ["winter", "spring", "summer", "autumn"];
  const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function same(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function keyOf(x, y) {
    return x + "," + y;
  }

  function tileAt(level, x, y) {
    if (y < 0 || y >= level.map.length || x < 0 || x >= level.map[y].length) return " ";
    return level.map[y][x] || " ";
  }

  function initialState(level) {
    return {
      levelId: level.id,
      season: level.initialSeason || "spring",
      player: clone(level.start),
      objects: level.objects.map(function (object) {
        return {
          id: object.id,
          type: object.type,
          x: object.x,
          y: object.y,
          released: object.released !== false
        };
      }),
      seedTaken: false,
      completed: false,
      moves: 0
    };
  }

  function activeObjects(state) {
    return state.objects.filter(function (object) { return object.released; });
  }

  function objectAt(state, x, y, exceptId) {
    return activeObjects(state).find(function (object) {
      return object.id !== exceptId && object.x === x && object.y === y;
    }) || null;
  }

  function plates(level) {
    const result = [];
    level.map.forEach(function (row, y) {
      Array.from(row).forEach(function (tile, x) {
        if (tile === "p") result.push({ x: x, y: y });
      });
    });
    return result;
  }

  function platePressed(state, level, plate) {
    return activeObjects(state).some(function (object) {
      return object.x === plate.x && object.y === plate.y;
    });
  }

  function doorOpen(state, level) {
    if (state.season !== "summer") return false;
    return plates(level).every(function (plate) { return platePressed(state, level, plate); });
  }

  function supports(state, level, x, y, forObject) {
    const tile = tileAt(level, x, y);
    if (["g", "p", "e", "b"].includes(tile)) return true;
    if (tile === "w") return state.season === "winter";
    if (tile === "v") return state.season === "spring";
    if (tile === "d") return doorOpen(state, level) && !forObject;
    return false;
  }

  function canOccupy(state, level, x, y) {
    return supports(state, level, x, y, false) && !objectAt(state, x, y);
  }

  function canSupportObject(state, level, x, y, exceptId) {
    return supports(state, level, x, y, true) && !objectAt(state, x, y, exceptId);
  }

  function fruitDropProblem(state, level) {
    const unreleased = state.objects.filter(function (object) {
      return object.type === "fruit" && !object.released;
    });
    for (const fruit of unreleased) {
      if (same(state.player, fruit)) return "fruitPlayer";
      if (objectAt(state, fruit.x, fruit.y, fruit.id)) return "fruitObject";
      if (!canSupportObject(state, level, fruit.x, fruit.y, fruit.id)) return "fruitTerrain";
    }
    return null;
  }

  function seasonProblem(state, level, season) {
    const candidate = clone(state);
    candidate.season = season;
    if (season === "autumn") {
      const dropProblem = fruitDropProblem(candidate, level);
      if (dropProblem) return dropProblem;
      candidate.objects.forEach(function (object) {
        if (object.type === "fruit") object.released = true;
      });
    }
    if (!supports(candidate, level, candidate.player.x, candidate.player.y, false)) return "unsafePlayer";
    for (const object of activeObjects(candidate)) {
      if (!canSupportObject(candidate, level, object.x, object.y, object.id)) return "unsafeObject";
    }
    return null;
  }

  function applyToState(state, level, action) {
    if (state.completed) return { ok: false, reason: "completed", state: state, events: [] };
    if (action.type === "season") {
      if (!SEASONS.includes(action.season)) return { ok: false, reason: "unknownSeason", state: state, events: [] };
      if (action.season === state.season) return { ok: false, reason: "sameSeason", state: state, events: [] };
      const problem = seasonProblem(state, level, action.season);
      if (problem) return { ok: false, reason: problem, state: state, events: ["invalid"] };
      const next = clone(state);
      const dropped = [];
      next.season = action.season;
      if (action.season === "autumn") {
        next.objects.forEach(function (object) {
          if (object.type === "fruit" && !object.released) {
            object.released = true;
            dropped.push(object.id);
          }
        });
      }
      next.moves += 1;
      return { ok: true, state: next, events: ["season"].concat(dropped.length ? ["fruitDropped"] : []) };
    }

    if (action.type !== "move") return { ok: false, reason: "unknownAction", state: state, events: [] };
    const direction = action.direction ? DIRECTIONS[action.direction] : action;
    if (!direction || !Number.isInteger(direction.x) || !Number.isInteger(direction.y) || Math.abs(direction.x) + Math.abs(direction.y) !== 1) {
      return { ok: false, reason: "badDirection", state: state, events: [] };
    }
    const target = { x: state.player.x + direction.x, y: state.player.y + direction.y };
    if (!supports(state, level, target.x, target.y, false)) {
      return { ok: false, reason: "blocked", state: state, events: ["bump"] };
    }
    const object = objectAt(state, target.x, target.y);
    const next = clone(state);
    const events = [];
    if (object) {
      const beyond = { x: target.x + direction.x, y: target.y + direction.y };
      if (!canSupportObject(state, level, beyond.x, beyond.y, object.id)) {
        return { ok: false, reason: "blockedObject", state: state, events: ["bump"] };
      }
      const nextObject = next.objects.find(function (item) { return item.id === object.id; });
      nextObject.x = beyond.x;
      nextObject.y = beyond.y;
      events.push("pushed");
    }
    next.player = target;
    next.moves += 1;
    events.push("step");
    if (!next.seedTaken && same(next.player, level.seed)) {
      next.seedTaken = true;
      events.push("seed");
    }
    if (next.seedTaken && same(next.player, level.exit)) {
      next.completed = true;
      events.push("complete");
    }
    return { ok: true, state: next, events: events };
  }

  function stateKey(state) {
    return JSON.stringify([
      state.season,
      state.player.x,
      state.player.y,
      state.seedTaken,
      state.completed,
      state.objects.map(function (object) {
        return [object.id, object.x, object.y, object.released];
      })
    ]);
  }

  function findPath(state, level, destination, maxStates) {
    if (same(state.player, destination)) return [];
    const limit = maxStates || 6000;
    const queue = [{ state: clone(state), actions: [] }];
    const seen = new Set([stateKey(state)]);
    for (let index = 0; index < queue.length && index < limit; index += 1) {
      const current = queue[index];
      for (const name of Object.keys(DIRECTIONS)) {
        const result = applyToState(current.state, level, { type: "move", direction: name });
        if (!result.ok) continue;
        const actions = current.actions.concat([{ type: "move", direction: name }]);
        if (same(result.state.player, destination)) return actions;
        const key = stateKey(result.state);
        if (!seen.has(key)) {
          seen.add(key);
          queue.push({ state: result.state, actions: actions });
        }
      }
    }
    return null;
  }

  function validState(state, level) {
    if (!state || state.levelId !== level.id || !SEASONS.includes(state.season)) return false;
    if (!state.player || !Number.isInteger(state.player.x) || !Number.isInteger(state.player.y)) return false;
    if (!Array.isArray(state.objects) || state.objects.length !== level.objects.length) return false;
    if (!supports(state, level, state.player.x, state.player.y, false)) return false;
    const ids = new Set();
    for (const original of level.objects) {
      const object = state.objects.find(function (item) { return item.id === original.id; });
      if (!object || object.type !== original.type || ids.has(object.id)) return false;
      if (!Number.isInteger(object.x) || !Number.isInteger(object.y)) return false;
      if (object.released && !canSupportObject(state, level, object.x, object.y, object.id)) return false;
      if (object.released && same(state.player, object)) return false;
      ids.add(object.id);
    }
    return true;
  }

  class Game {
    constructor(level) {
      this.level = level;
      this.state = initialState(level);
      this.history = [];
    }

    dispatch(action) {
      if (action.type === "undo") return this.undo();
      if (action.type === "reset") return this.reset();
      const result = applyToState(this.state, this.level, action);
      if (result.ok) {
        this.history.push(clone(this.state));
        if (this.history.length > 300) this.history.shift();
        this.state = result.state;
      }
      return result;
    }

    undo() {
      if (!this.history.length) return { ok: false, reason: "emptyHistory", state: this.state, events: ["bump"] };
      this.state = this.history.pop();
      return { ok: true, state: this.state, events: ["undo"] };
    }

    reset() {
      this.state = initialState(this.level);
      this.history = [];
      return { ok: true, state: this.state, events: ["reset"] };
    }

    serialize() {
      return JSON.stringify({ version: 1, levelId: this.level.id, state: this.state, history: this.history });
    }

    static restore(level, serialized) {
      const game = new Game(level);
      try {
        const saved = typeof serialized === "string" ? JSON.parse(serialized) : serialized;
        if (!saved || saved.version !== 1 || saved.levelId !== level.id || !validState(saved.state, level)) return game;
        game.state = clone(saved.state);
        game.history = Array.isArray(saved.history) ? saved.history.filter(function (state) {
          return validState(state, level);
        }).slice(-300).map(clone) : [];
      } catch (error) {
        return game;
      }
      return game;
    }
  }

  return {
    SEASONS: SEASONS,
    DIRECTIONS: DIRECTIONS,
    clone: clone,
    same: same,
    keyOf: keyOf,
    tileAt: tileAt,
    initialState: initialState,
    activeObjects: activeObjects,
    objectAt: objectAt,
    plates: plates,
    platePressed: platePressed,
    doorOpen: doorOpen,
    supports: supports,
    canOccupy: canOccupy,
    canSupportObject: canSupportObject,
    seasonProblem: seasonProblem,
    applyToState: applyToState,
    stateKey: stateKey,
    findPath: findPath,
    validState: validState,
    Game: Game
  };
});
