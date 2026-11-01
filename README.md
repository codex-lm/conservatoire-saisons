# The Conservatory of Seasons

A warm isometric puzzle game about a tiny mechanical gardener restoring seven suspended gardens. Change season, transform the paths, push persistent fruit and planters, collect each light seed and bring it back to the central conservatory.

Created with Kimi for **Kimi Games**. English, French and Spanish are included; English is the default.

## Play

The committed `index.html` is the complete, self-contained playable export. It has no runtime dependencies, remote assets, network API, account or build requirement.

Serve this directory with any static HTTP server:

```sh
python -m http.server 8080
```

Open `http://localhost:8080`. The game also works from a local HTML file in browsers that permit canvas and local storage on file URLs.

## Controls

- **Arrow keys / WASD / ZQSD:** move one logical grid cell; moving into a fruit or planter pushes it when the next cell is free and supported.
- **Click or tap a tile:** find a legal path in the current season and walk it, including ordinary pushes.
- **1 / 2 / 3 / 4:** winter / spring / summer / autumn. The large seasonal buttons also work with touch.
- **Z or Backspace:** undo the previous movement or season change.
- **R:** reset the current garden without withdrawing completed restorations.
- **H:** reveal the next of three progressive hints.
- **M:** toggle the gentle synthesized sound.
- **? / F1:** help. **Escape:** return to the central conservatory.

## Seasonal rules

- **Winter:** basins freeze and carry the gardener and movable objects.
- **Spring:** lianas grow over the pale dashed gaps.
- **Summer:** solar flowers power doors when every round pressure plate is weighed down by an object.
- **Autumn:** trees release heavy fruit. Once released, fruit and planters keep their positions across every season.

Seasonal terrain is reversible. Released fruit, moved objects, collected seeds and restored gardens are visibly different persistent changes. A season change is refused with a short explanation if it would leave the gardener or an object unsupported. Undo and reset are always available while solving, so an experimental push cannot force a reload.

Each garden ends when its light seed has been collected and the gardener reaches the exit arch. Seven restored plots transform the central conservatory and unlock a visual conclusion. Completed gardens can be replayed.

## Save and accessibility

Progress, the current garden and its undo history, language and sound preference are stored locally on the device when local storage is available. Reloading returns to the conservatory, where **Resume garden** restores the exact state. Invalid or incompatible save data falls back to a fresh garden rather than creating an impossible state.

The camera never rotates. Interactive objects have distinct silhouettes, the walkable terrain uses bright surfaces, and essential controls remain available on narrow screens. Reduced-motion preferences disable ambient weather and shorten transitions. All interface and hint text is available in EN/FR/ES.

## Export and development

The `main` branch is the standalone static export accepted by LOB7. Editable sources are retained beside the generated entrypoint:

- `src/core.js`: deterministic grid rules, pushing, pressure plates, undo/reset, pathfinding and defensive serialization.
- `src/levels.js`: seven modifiable garden maps, names and translated progressive hints.
- `src/renderer.js`: original Canvas 2D isometric artwork, guardian, hub and seasonal animation.
- `src/game.js`: commands, interface translations, WebAudio, progression and local save.
- `src/index.template.html`, `src/styles.css`: semantic interface and responsive presentation.

The [`development` branch](https://github.com/codex-lm/conservatoire-saisons/tree/development) also contains `build.py`, `art/render_cover.py` and the complete Node test suite. Switch to that branch to rebuild and test:

```sh
python build.py
node --test tests/*.test.js
```

No npm install or third-party runtime package is needed. Node 18+ is sufficient for the test runner. `tests/solutions.js` records a known legal action sequence for every garden; `tests/solutions.test.js` replays all seven, checks state validity after each action and verifies undo/reset. `tests/core.test.js` covers seasonal reversibility, object persistence, unsafe-season refusal, complete undo, reset, save/reload, click pathfinding and solar doors.

`SOLUTIONS.md` gives the same walkthroughs in compact human-readable form.

## LOB7

`LOB7-GAME.json` is the browser-game manifest. `LOB7-ATTRIBUTION.json` records the actual contribution. The project is prepared for LOB7's `static-web-v1` recipe:

```sh
LOB7_CONFIG_DIR=C:/dev/kimi-games/_private/lob7 python C:/dev/lob7/site/tools/lob7.py check-local . --recipe static-web-v1 --json
```

The generated HTML deliberately has no favicon data URL, external script, module loader, `fetch`, worker, service worker or remote font. LOB7 serves the exact committed static export in its isolated player.

## Art, sound and licence

All garden artwork, the mechanical gardener, interface icons, animations and cover are original works created for this game. Sound effects are synthesized at runtime with WebAudio; there are no audio files or third-party assets. The optional cover generator uses Pillow, which is a development tool and is not bundled or required to play.

Code and original assets are released under the MIT License. See `LICENSE` and `CREDITS.md`.
