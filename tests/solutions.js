"use strict";

function season(name) { return { type: "season", season: name }; }
function move(direction, count) {
  return Array.from({ length: count || 1 }, function () { return { type: "move", direction: direction }; });
}
function actions() {
  return Array.from(arguments).flat();
}

module.exports = [
  {
    levelId: "winter-awakening",
    summary: "Freeze the basin, cross to the seed and return to the southern arch.",
    actions: actions(season("winter"), move("right", 5), move("up"), move("down", 2))
  },
  {
    levelId: "liana-promise",
    summary: "Grow the lianas, cross the void, collect the seed and descend to the arch.",
    actions: actions(season("spring"), move("right", 5), move("up"), move("down", 2))
  },
  {
    levelId: "sunlit-lock",
    summary: "Push the planter onto the plate, choose summer and pass the central door.",
    actions: actions(move("right"), season("summer"), move("up"), move("right", 4), move("up"), move("down", 2))
  },
  {
    levelId: "copper-harvest",
    summary: "Release and place the fruit, choose summer, then skirt the tree to the north.",
    actions: actions(season("autumn"), move("right"), season("summer"), move("left"), move("up", 2), move("right", 2), move("down"), move("right", 3), move("up"), move("down", 3))
  },
  {
    levelId: "glasshouse-gate",
    summary: "Harvest in autumn, slide the fruit onto the bank plate in winter, cross the northern liana in spring and enter in summer.",
    actions: actions(season("autumn"), season("winter"), move("up", 2), move("right", 4), move("up"), move("right"), season("spring"), move("right", 2), season("summer"), move("right", 2), move("up"), move("down", 2))
  },
  {
    levelId: "floating-orchard",
    summary: "Place the fruit on the north plate and the planter on the south plate over ice, then use the central liana and summer door.",
    actions: actions(season("autumn"), season("winter"), move("up", 3), move("right", 4), move("down"), move("left", 4), move("down"), move("right", 4), move("up"), move("right"), season("spring"), move("right", 2), season("summer"), move("right", 2), move("up"), move("down", 2))
  },
  {
    levelId: "heart-conservatory",
    summary: "Place the fruit over ice, cross the first liana, push the middle planter down, pass the summer door and use spring again for the second liana.",
    actions: actions(season("autumn"), season("winter"), move("up", 2), move("right", 4), move("up"), move("right"), season("spring"), move("right", 2), move("down"), season("summer"), move("up"), move("right", 3), season("spring"), move("right", 2), move("up"), move("down", 2))
  }
];
