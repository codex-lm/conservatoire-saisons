(function (root, factory) {
  const levels = factory();
  if (typeof module === "object" && module.exports) module.exports = levels;
  else root.CONSERVATORY_LEVELS = levels;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  return [
    {
      id: "winter-awakening",
      number: 1,
      name: { en: "A Breath of Winter", fr: "Un souffle d’hiver", es: "Un soplo de invierno" },
      subtitle: { en: "The water remembers how to carry you.", fr: "L’eau se souvient comment te porter.", es: "El agua recuerda cómo sostenerte." },
      map: [
        "gggwwwggg",
        "gggwwwggg",
        "gggwwwggg",
        "gggwwwggg",
        "gggwwwggg",
        "gggwwwggg",
        "gggwwwggg"
      ],
      start: { x: 1, y: 3 }, initialSeason: "spring", seed: { x: 6, y: 2 }, exit: { x: 6, y: 4 }, objects: [],
      hints: {
        en: ["The basin is beautiful, but your little feet are not waterproof.", "One season turns the whole central basin into a firm blue path.", "Choose winter, cross the ice to the seed, then walk south to the glowing arch."],
        fr: ["Le bassin est beau, mais tes petits pieds ne sont pas étanches.", "Une saison transforme tout le bassin central en un chemin bleu et solide.", "Choisis l’hiver, traverse la glace jusqu’à la graine, puis descends vers l’arche lumineuse."],
        es: ["El estanque es precioso, pero tus pequeños pies no son impermeables.", "Una estación convierte todo el estanque central en un camino azul y firme.", "Elige invierno, cruza el hielo hasta la semilla y baja hacia el arco luminoso."]
      }
    },
    {
      id: "liana-promise",
      number: 2,
      name: { en: "The Liana’s Promise", fr: "La promesse de la liane", es: "La promesa de la liana" },
      subtitle: { en: "A bridge that blooms only when it is needed.", fr: "Un pont qui fleurit quand on en a besoin.", es: "Un puente que florece cuando lo necesitas." },
      map: [
        "ggg  ggg",
        "ggg  ggg",
        "ggg  ggg",
        "gggvvggg",
        "ggg  ggg",
        "ggg  ggg"
      ],
      start: { x: 1, y: 3 }, initialSeason: "summer", seed: { x: 6, y: 2 }, exit: { x: 6, y: 4 }, objects: [],
      hints: {
        en: ["The pale dashed tiles are not holes forever.", "Spring wakes the two liana beds between the islands.", "Choose spring and cross the green vines. Collect the seed north of the far bank, then go south to the arch."],
        fr: ["Les cases pâles pointillées ne resteront pas des vides.", "Le printemps réveille les deux lianes entre les îles.", "Choisis le printemps et traverse les lianes vertes. Prends la graine au nord de l’autre rive, puis descends vers l’arche."],
        es: ["Las casillas pálidas de puntos no serán huecos para siempre.", "La primavera despierta las dos lianas entre las islas.", "Elige primavera y cruza las lianas verdes. Recoge la semilla al norte de la otra orilla y baja hacia el arco."]
      }
    },
    {
      id: "sunlit-lock",
      number: 3,
      name: { en: "The Sunlit Lock", fr: "La serrure du soleil", es: "La cerradura del sol" },
      subtitle: { en: "A little weight, a little sunlight.", fr: "Un peu de poids, un peu de soleil.", es: "Un poco de peso, un poco de sol." },
      map: [
        "ggggxggg",
        "gtggxggg",
        "ggggxggg",
        "ggggdggg",
        "gggpxggg",
        "ggggxggg",
        "ggggxggg"
      ],
      start: { x: 1, y: 4 }, initialSeason: "spring", seed: { x: 6, y: 2 }, exit: { x: 6, y: 4 },
      objects: [{ id: "planter-a", type: "planter", x: 2, y: 4, released: true }],
      hints: {
        en: ["The round plate and the door are parts of the same mechanism.", "Push the mobile planter onto the plate. The flower beside the door still needs sunlight.", "Push the planter right onto the plate, choose summer, then walk through the central door to the seed and the arch."],
        fr: ["La plaque ronde et la porte appartiennent au même mécanisme.", "Pousse la jardinière mobile sur la plaque. La fleur près de la porte a encore besoin de soleil.", "Pousse la jardinière vers la droite sur la plaque, choisis l’été, puis franchis la porte centrale vers la graine et l’arche."],
        es: ["La placa redonda y la puerta forman el mismo mecanismo.", "Empuja la jardinera móvil hasta la placa. La flor junto a la puerta aún necesita sol.", "Empuja la jardinera a la derecha hasta la placa, elige verano y cruza la puerta central hacia la semilla y el arco."]
      }
    },
    {
      id: "copper-harvest",
      number: 4,
      name: { en: "The Copper Harvest", fr: "La récolte de cuivre", es: "La cosecha de cobre" },
      subtitle: { en: "Autumn gives the sun something to carry.", fr: "L’automne donne au soleil quelque chose à porter.", es: "El otoño le da al sol algo que llevar." },
      map: [
        "ggggxggg",
        "ggggxggg",
        "ggtgdggg",
        "gggpxggg",
        "ggggxggg",
        "ggggxggg",
        "ggggxggg"
      ],
      start: { x: 1, y: 3 }, initialSeason: "spring", seed: { x: 6, y: 1 }, exit: { x: 6, y: 4 },
      objects: [{ id: "fruit-a", type: "fruit", x: 2, y: 3, released: false }],
      hints: {
        en: ["The empty plate needs something heavier than a gardener.", "Autumn releases the tree’s fruit. Once fallen, it can be pushed in any season.", "In autumn, push the fruit right onto the plate. Choose summer, then go around the tree by the north path to reach the open door."],
        fr: ["La plaque vide a besoin de quelque chose de plus lourd qu’un gardien.", "L’automne libère le fruit de l’arbre. Une fois tombé, il peut être poussé en toute saison.", "En automne, pousse le fruit à droite sur la plaque. Choisis l’été, puis contourne l’arbre par le nord pour atteindre la porte ouverte."],
        es: ["La placa vacía necesita algo más pesado que un jardinero.", "El otoño libera el fruto del árbol. Una vez caído, puedes empujarlo en cualquier estación.", "En otoño, empuja el fruto a la derecha hasta la placa. Elige verano y rodea el árbol por el norte para llegar a la puerta abierta."]
      }
    },
    {
      id: "glasshouse-gate",
      number: 5,
      name: { en: "The Glasshouse Gate", fr: "La porte de la serre", es: "La puerta del invernadero" },
      subtitle: { en: "Four seasons, one patient machine.", fr: "Quatre saisons, une machine patiente.", es: "Cuatro estaciones, una máquina paciente." },
      map: [
        "ggggwwggggg",
        "ggggwwggggg",
        "ggtgwwgvgdg",
        "ggggwwp ggg",
        "gggg    ggg",
        "gggg    ggg"
      ],
      start: { x: 1, y: 5 }, initialSeason: "spring", seed: { x: 10, y: 1 }, exit: { x: 10, y: 3 },
      objects: [
        { id: "fruit-a", type: "fruit", x: 2, y: 3, released: false },
        { id: "planter-a", type: "planter", x: 8, y: 4, released: true }
      ],
      hints: {
        en: ["The fruit, the pale gap and the golden door each listen to a different season.", "Autumn releases the fruit. Winter can carry it to the round plate across the water.", "Push the fruit onto the plate in winter. In spring, cross the vine north of the plate. On the island, switch to summer and pass the door."],
        fr: ["Le fruit, le vide pâle et la porte dorée répondent chacun à une saison différente.", "L’automne libère le fruit. L’hiver permet de le porter jusqu’à la plaque ronde, au-delà de l’eau.", "Pousse le fruit sur la plaque en hiver. Au printemps, traverse la liane au nord de la plaque. Sur l’île, passe à l’été et franchis la porte."],
        es: ["El fruto, el hueco pálido y la puerta dorada responden a estaciones distintas.", "El otoño libera el fruto. El invierno permite llevarlo hasta la placa redonda al otro lado del agua.", "Empuja el fruto hasta la placa en invierno. En primavera, cruza la enredadera al norte de la placa. En la isla, cambia a verano y pasa la puerta."]
      }
    },
    {
      id: "floating-orchard",
      number: 6,
      name: { en: "The Floating Orchard", fr: "Le verger flottant", es: "El huerto flotante" },
      subtitle: { en: "Two burdens. Two crossings. One golden door.", fr: "Deux fardeaux. Deux traversées. Une porte dorée.", es: "Dos cargas. Dos cruces. Una puerta dorada." },
      map: [
        "ggggwwg ggg",
        "ggtgwwg ggg",
        "ggggwwp ggg",
        "ggggwwgvgdg",
        "ggggwwp ggg",
        "ggggww  ggg",
        "gggg    ggg"
      ],
      start: { x: 1, y: 5 }, initialSeason: "spring", seed: { x: 10, y: 2 }, exit: { x: 10, y: 4 },
      objects: [
        { id: "fruit-a", type: "fruit", x: 2, y: 2, released: false },
        { id: "planter-a", type: "planter", x: 2, y: 4, released: true }
      ],
      hints: {
        en: ["Both round plates must stay weighted when you choose summer.", "Release the fruit in autumn. In winter, each object can be pushed across a different strip of ice.", "Push the fruit onto the north plate and the planter onto the south plate in winter. Cross the central liana in spring, then choose summer on the island."],
        fr: ["Les deux plaques rondes doivent rester lestées quand tu choisis l’été.", "Libère le fruit en automne. En hiver, chaque objet peut être poussé sur une bande de glace différente.", "En hiver, pousse le fruit sur la plaque nord et la jardinière sur la plaque sud. Traverse la liane centrale au printemps, puis choisis l’été sur l’île."],
        es: ["Las dos placas redondas deben conservar el peso al elegir verano.", "Libera el fruto en otoño. En invierno, cada objeto puede cruzar por una franja de hielo distinta.", "En invierno, empuja el fruto a la placa norte y la jardinera a la placa sur. Cruza la liana central en primavera y elige verano en la isla."]
      }
    },
    {
      id: "heart-conservatory",
      number: 7,
      name: { en: "Heart of the Conservatory", fr: "Le cœur du conservatoire", es: "El corazón del conservatorio" },
      subtitle: { en: "Every season has a part to play.", fr: "Chaque saison a un rôle à jouer.", es: "Cada estación tiene un papel." },
      map: [
        "ggggwwg ggxg gg",
        "ggtgwwg ggxg gg",
        "ggggwwgvggdgvgg",
        "ggggwwp ggxg gg",
        "ggggwwg pgxg gg",
        "ggggwwg ggxg gg",
        "ggggwwg ggxg gg"
      ],
      start: { x: 1, y: 5 }, initialSeason: "spring", seed: { x: 13, y: 1 }, exit: { x: 13, y: 3 },
      objects: [
        { id: "fruit-a", type: "fruit", x: 2, y: 3, released: false },
        { id: "planter-a", type: "planter", x: 8, y: 3, released: true }
      ],
      hints: {
        en: ["The last garden asks you to leave mechanisms behind and keep moving between seasons.", "The fruit belongs on the bank plate; the planter belongs on the middle island’s lower plate. Both need to stay there.", "Use autumn and winter to place the fruit. Spring opens the first liana; push the planter down. Summer opens the door. Beyond it, spring opens the second liana."],
        fr: ["Le dernier jardin demande de laisser des mécanismes derrière toi et de continuer à changer de saison.", "Le fruit va sur la plaque de la rive ; la jardinière va sur la plaque basse de l’île centrale. Ils doivent y rester.", "Utilise l’automne puis l’hiver pour placer le fruit. Le printemps ouvre la première liane ; pousse la jardinière vers le bas. L’été ouvre la porte. De l’autre côté, le printemps ouvre la seconde liane."],
        es: ["El último jardín te pide dejar mecanismos atrás y seguir cambiando de estación.", "El fruto va en la placa de la orilla; la jardinera, en la placa inferior de la isla central. Ambos deben quedarse allí.", "Usa otoño e invierno para colocar el fruto. La primavera abre la primera liana; empuja la jardinera hacia abajo. El verano abre la puerta. Al otro lado, la primavera abre la segunda liana."]
      }
    }
  ];
});
