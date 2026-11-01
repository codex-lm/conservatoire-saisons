# Verified garden solutions

These are reference solutions, not the only possible solutions. They are encoded in `tests/solutions.js` on the [`development` branch](https://github.com/codex-lm/conservatoire-saisons/tree/development) and replayed by `node --test tests/*.test.js`.

Notation: **W** winter, **P** spring, **S** summer, **A** autumn; **↑ ↓ ← →** move or push one grid cell. Every sequence begins from a fresh garden and ends on the exit with its light seed collected.

## 1. A Breath of Winter

**W, → ×5, ↑, ↓ ×2**

Freeze the central basin, cross to the far bank, collect the seed north of the landing and walk south into the arch.

## 2. The Liana’s Promise

**P, → ×5, ↑, ↓ ×2**

Grow the two liana beds, cross the void, collect the seed on the far bank and descend to the arch.

## 3. The Sunlit Lock

**→, S, ↑, → ×4, ↑, ↓ ×2**

The first move pushes the planter onto the round plate. Summer opens the central door. Take the seed north of the far passage and return to the southern arch.

## 4. The Copper Harvest

**A, →, S, ←, ↑ ×2, → ×2, ↓, → ×3, ↑, ↓ ×3**

Autumn drops the fruit; the first move pushes it onto the plate. Summer powers the door. The remaining moves go around the tree by the north path, pass the door, collect the seed and reach the exit.

## 5. The Glasshouse Gate

**A, W, ↑ ×2, → ×4, ↑, →, P, → ×2, S, → ×2, ↑, ↓ ×2**

Release the fruit in autumn. In winter, push it east over the ice onto the bank plate. Reach the northern liana, cross it in spring, choose summer on the island and pass the golden door. Collect the northern seed and return to the arch.

## 6. The Floating Orchard

**A, W, ↑ ×3, → ×4, ↓, ← ×4, ↓, → ×4, ↑, →, P, → ×2, S, → ×2, ↑, ↓ ×2**

Release the fruit. In winter, push it onto the north plate. Walk back to the planter and push it onto the south plate; both objects stay in place. Cross the central liana in spring, switch to summer on the island, pass the door, collect the seed and reach the arch.

## 7. Heart of the Conservatory

**A, W, ↑ ×2, → ×4, ↑, →, P, → ×2, ↓, S, ↑, → ×3, P, → ×2, ↑, ↓ ×2**

Use autumn and winter to place the fruit on the bank plate. Spring opens the first liana. On the middle island, push the planter down onto the lower plate. Summer opens the door; pass it and stop on the firm tile beyond. Choose spring again to cross the second liana, collect the seed and enter the final arch.

## Additional checks

- `tests/core.test.js` verifies that a refused season leaves state and history untouched, released objects persist, and undo restores both object positions and the previous season.
- `tests/solutions.test.js` checks every intermediate state, translated hints, supported objectives, and undo/redo after each solution prefix.
- Reset returns the current garden to its documented initial state and does not remove completed gardens from the central conservatory.
