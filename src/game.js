(function () {
  "use strict";

  const Core = window.ConservatoryCore;
  const LEVELS = window.CONSERVATORY_LEVELS;
  const SAVE_KEY = "conservatoire-saisons-save-v1";
  const $ = function (id) { return document.getElementById(id); };

  const TEXT = {
    en: {
      title: "The Conservatory of Seasons", byline: "A little gardener. Four seasons. Seven gardens.", sound: "Sound", soundOff: "Toggle sound", help: "How to play", conservatory: "Conservatory", clickTip: "Click a lit tile to walk there", winter: "Winter", spring: "Spring", summer: "Summer", autumn: "Autumn", restoration: "Restoration", hubIntro: "Seven sleeping gardens wait above the clouds. Bring back their light seeds.", enterGarden: "Enter garden", resumeGarden: "Resume garden", objective: "Objective", seedObjective: "Find the light seed, then reach the arch.", seedWaiting: "Seed waiting", seedFound: "Light seed found", undo: "Undo", reset: "Reset", hintTitle: "A gentle nudge", hintPrompt: "Observe first. Three hints are here if you need them.", revealHint: "Reveal the next hint", ruleIce: "Ice carries you and objects.", ruleVine: "Vines bridge the open gaps.", ruleSun: "Sunflowers power every plate-fed door.", ruleFruit: "Fallen fruit stays where you push it.", saveNote: "Your restoration is saved on this device.", moveControls: "Arrows / WASD / ZQSD to move", seasonControls: "1–4 to change season", undoControls: "Z to undo", gardenerManual: "THE GARDENER’S LITTLE MANUAL", helpTitle: "Let the garden change.", helpIntro: "Explore at your own pace. Nothing here needs quick reflexes.", winterHelp: "Basins freeze into solid paths.", springHelp: "Lianas grow over pale open gaps.", summerHelp: "Sunflowers open doors when every round plate is weighed down.", autumnHelp: "Trees release heavy fruit. Fruit and planters keep their positions in every season.", safetyHelp: "A season that would strand the gardener or an object is refused. Undo any move or season, or reset the garden without losing restored gardens.", move: "Move", seasons: "Seasons", hint: "Hint", backGarden: "Back to the garden", gardenRestored: "GARDEN RESTORED", restoredCopy: "A light seed returns to the conservatory. Somewhere, an old flower wakes.", returnConservatory: "Return to the conservatory", replayGarden: "Replay this garden", restorationComplete: "THE RESTORATION IS COMPLETE", conclusionTitle: "The conservatory breathes again.", conclusionCopy: "Seven lights glow beneath the glass. The little gardener’s work will keep growing, season after season.", wander: "Wander through the restored gardens", central: "CENTRAL CONSERVATORY", garden: "GARDEN", finalGarden: "FINAL GARDEN", moves: "moves", locked: "Restore the previous garden to open this path.", restored: "Restored", newGarden: "A sleeping garden", finalSubtitle: "Every season has a part to play.", unsafePlayer: "That change would leave you without solid ground.", unsafeObject: "An object would be left unsupported. Move it to firm ground first.", fruitPlayer: "Step away from the fruit’s falling place.", fruitObject: "The fruit needs room to fall.", fruitTerrain: "The fruit needs firm ground beneath its fall.", blocked: "That path is closed in this season.", blockedObject: "The object needs a clear, supported tile ahead.", sameSeason: "This season is already here.", emptyHistory: "Nothing to undo yet.", noPath: "No clear path in this season. Try changing the garden.", resetDone: "The garden is back to its beginning.", completed: "This garden is already restored.", unknownAction: "That action is not available.", winterArrival: "Winter — the basins turn to ice.", springArrival: "Spring — lianas reach across the gaps.", summerArrival: "Summer — sunflowers wake the mechanisms.", autumnArrival: "Autumn — heavy fruit falls from the trees.", undoDone: "One action rewound.", soundEnabled: "Soft sound on", soundDisabled: "Sound off", seedChime: "A light seed joins your satchel.", exitWaiting: "The arch needs the light seed first."
    },
    fr: {
      title: "Le Conservatoire des Saisons", byline: "Un petit gardien. Quatre saisons. Sept jardins.", sound: "Son", soundOff: "Activer ou couper le son", help: "Comment jouer", conservatory: "Conservatoire", clickTip: "Clique sur une case éclairée pour t’y rendre", winter: "Hiver", spring: "Printemps", summer: "Été", autumn: "Automne", restoration: "Restauration", hubIntro: "Sept jardins endormis flottent au-dessus des nuages. Rapporte leurs graines lumineuses.", enterGarden: "Entrer dans le jardin", resumeGarden: "Reprendre le jardin", objective: "Objectif", seedObjective: "Trouve la graine lumineuse, puis rejoins l’arche.", seedWaiting: "Graine à trouver", seedFound: "Graine lumineuse trouvée", undo: "Annuler", reset: "Réinitialiser", hintTitle: "Un petit coup de pouce", hintPrompt: "Observe d’abord. Trois indices sont là si tu en as besoin.", revealHint: "Révéler l’indice suivant", ruleIce: "La glace porte le gardien et les objets.", ruleVine: "Les lianes franchissent les vides.", ruleSun: "Les fleurs solaires alimentent les portes liées aux plaques.", ruleFruit: "Les fruits tombés restent où tu les pousses.", saveNote: "Ta restauration est sauvegardée sur cet appareil.", moveControls: "Flèches / WASD / ZQSD pour se déplacer", seasonControls: "1–4 pour changer de saison", undoControls: "Z pour annuler", gardenerManual: "LE PETIT MANUEL DU JARDINIER", helpTitle: "Laisse le jardin changer.", helpIntro: "Explore à ton rythme. Aucun réflexe rapide n’est nécessaire.", winterHelp: "Les bassins gèlent et deviennent praticables.", springHelp: "Les lianes poussent au-dessus des vides pâles.", summerHelp: "Les fleurs solaires ouvrent les portes lorsque toutes les plaques rondes sont lestées.", autumnHelp: "Les arbres libèrent des fruits lourds. Fruits et jardinières conservent leur position en toute saison.", safetyHelp: "Une saison qui laisserait le gardien ou un objet sans support est refusée. Annule tout déplacement ou changement de saison, ou réinitialise le jardin sans perdre les restaurations.", move: "Déplacement", seasons: "Saisons", hint: "Indice", backGarden: "Retour au jardin", gardenRestored: "JARDIN RESTAURÉ", restoredCopy: "Une graine lumineuse revient au conservatoire. Quelque part, une vieille fleur s’éveille.", returnConservatory: "Retour au conservatoire", replayGarden: "Rejouer ce jardin", restorationComplete: "LA RESTAURATION EST TERMINÉE", conclusionTitle: "Le conservatoire respire à nouveau.", conclusionCopy: "Sept lumières brillent sous la verrière. Le travail du petit gardien continuera de pousser, saison après saison.", wander: "Flâner dans les jardins restaurés", central: "CONSERVATOIRE CENTRAL", garden: "JARDIN", finalGarden: "JARDIN FINAL", moves: "coups", locked: "Restaure le jardin précédent pour ouvrir ce passage.", restored: "Restauré", newGarden: "Un jardin endormi", finalSubtitle: "Chaque saison a un rôle à jouer.", unsafePlayer: "Ce changement te laisserait sans sol solide.", unsafeObject: "Un objet resterait sans support. Déplace-le d’abord sur un sol ferme.", fruitPlayer: "Écarte-toi de la zone de chute du fruit.", fruitObject: "Le fruit a besoin d’espace pour tomber.", fruitTerrain: "Le fruit a besoin d’un sol ferme sous sa chute.", blocked: "Ce passage est fermé en cette saison.", blockedObject: "L’objet a besoin d’une case libre et solide devant lui.", sameSeason: "Cette saison est déjà là.", emptyHistory: "Rien à annuler pour le moment.", noPath: "Aucun chemin libre en cette saison. Essaie de transformer le jardin.", resetDone: "Le jardin a retrouvé son état initial.", completed: "Ce jardin est déjà restauré.", unknownAction: "Cette action n’est pas disponible.", winterArrival: "Hiver — les bassins se changent en glace.", springArrival: "Printemps — les lianes s’élancent au-dessus des vides.", summerArrival: "Été — les fleurs solaires réveillent les mécanismes.", autumnArrival: "Automne — les fruits lourds tombent des arbres.", undoDone: "Une action annulée.", soundEnabled: "Son doux activé", soundDisabled: "Son coupé", seedChime: "Une graine lumineuse rejoint ta besace.", exitWaiting: "L’arche attend d’abord la graine lumineuse."
    },
    es: {
      title: "El Conservatorio de las Estaciones", byline: "Un pequeño jardinero. Cuatro estaciones. Siete jardines.", sound: "Sonido", soundOff: "Activar o silenciar el sonido", help: "Cómo jugar", conservatory: "Conservatorio", clickTip: "Haz clic en una casilla iluminada para caminar", winter: "Invierno", spring: "Primavera", summer: "Verano", autumn: "Otoño", restoration: "Restauración", hubIntro: "Siete jardines dormidos esperan sobre las nubes. Recupera sus semillas de luz.", enterGarden: "Entrar al jardín", resumeGarden: "Continuar el jardín", objective: "Objetivo", seedObjective: "Encuentra la semilla de luz y llega al arco.", seedWaiting: "Semilla pendiente", seedFound: "Semilla de luz encontrada", undo: "Deshacer", reset: "Reiniciar", hintTitle: "Una pequeña ayuda", hintPrompt: "Observa primero. Tienes tres pistas si las necesitas.", revealHint: "Mostrar la siguiente pista", ruleIce: "El hielo sostiene al jardinero y los objetos.", ruleVine: "Las lianas cruzan los huecos.", ruleSun: "Las flores solares activan las puertas conectadas a placas.", ruleFruit: "Los frutos caídos quedan donde los empujas.", saveNote: "Tu restauración se guarda en este dispositivo.", moveControls: "Flechas / WASD / ZQSD para moverte", seasonControls: "1–4 para cambiar de estación", undoControls: "Z para deshacer", gardenerManual: "EL PEQUEÑO MANUAL DEL JARDINERO", helpTitle: "Deja que el jardín cambie.", helpIntro: "Explora a tu ritmo. No necesitas reflejos rápidos.", winterHelp: "Los estanques se congelan y se pueden cruzar.", springHelp: "Las lianas crecen sobre los huecos pálidos.", summerHelp: "Las flores solares abren puertas cuando todas las placas redondas tienen peso.", autumnHelp: "Los árboles sueltan frutos pesados. Frutos y jardineras conservan su posición en todas las estaciones.", safetyHelp: "Se rechaza una estación que deje al jardinero o a un objeto sin apoyo. Deshaz movimientos y estaciones, o reinicia el jardín sin perder restauraciones.", move: "Movimiento", seasons: "Estaciones", hint: "Pista", backGarden: "Volver al jardín", gardenRestored: "JARDÍN RESTAURADO", restoredCopy: "Una semilla de luz vuelve al conservatorio. En algún lugar, una vieja flor despierta.", returnConservatory: "Volver al conservatorio", replayGarden: "Repetir este jardín", restorationComplete: "LA RESTAURACIÓN ESTÁ COMPLETA", conclusionTitle: "El conservatorio vuelve a respirar.", conclusionCopy: "Siete luces brillan bajo el cristal. El trabajo del pequeño jardinero seguirá creciendo, estación tras estación.", wander: "Pasear por los jardines restaurados", central: "CONSERVATORIO CENTRAL", garden: "JARDÍN", finalGarden: "JARDÍN FINAL", moves: "jugadas", locked: "Restaura el jardín anterior para abrir este camino.", restored: "Restaurado", newGarden: "Un jardín dormido", finalSubtitle: "Cada estación tiene un papel.", unsafePlayer: "Ese cambio te dejaría sin suelo firme.", unsafeObject: "Un objeto quedaría sin apoyo. Muévelo primero a suelo firme.", fruitPlayer: "Apártate del lugar donde cae el fruto.", fruitObject: "El fruto necesita espacio para caer.", fruitTerrain: "El fruto necesita suelo firme bajo su caída.", blocked: "Ese camino está cerrado en esta estación.", blockedObject: "El objeto necesita una casilla libre y firme delante.", sameSeason: "Ya estás en esta estación.", emptyHistory: "Aún no hay nada que deshacer.", noPath: "No hay camino libre en esta estación. Prueba a transformar el jardín.", resetDone: "El jardín ha vuelto al principio.", completed: "Este jardín ya está restaurado.", unknownAction: "Esa acción no está disponible.", winterArrival: "Invierno — los estanques se convierten en hielo.", springArrival: "Primavera — las lianas cruzan los huecos.", summerArrival: "Verano — las flores solares despiertan los mecanismos.", autumnArrival: "Otoño — los frutos pesados caen de los árboles.", undoDone: "Acción deshecha.", soundEnabled: "Sonido suave activado", soundDisabled: "Sonido silenciado", seedChime: "Una semilla de luz entra en tu bolsa.", exitWaiting: "El arco necesita primero la semilla de luz."
    }
  };

  function defaultSave() {
    return { version: 1, language: "en", sound: true, completed: [], active: null, selected: 0, conclusionSeen: false };
  }

  function loadSave() {
    try {
      const value = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!value || value.version !== 1) return defaultSave();
      const clean = Object.assign(defaultSave(), value);
      clean.completed = Array.isArray(value.completed) ? value.completed.filter(function (id) {
        return LEVELS.some(function (level) { return level.id === id; });
      }) : [];
      if (!TEXT[clean.language]) clean.language = "en";
      return clean;
    } catch (error) {
      return defaultSave();
    }
  }

  let save = loadSave();
  let language = save.language;
  let mode = "hub";
  let selected = Math.max(0, Math.min(LEVELS.length - 1, Number(save.selected) || 0));
  let game = null;
  let hintStage = 0;
  let pathQueue = [];
  let pathTimer = null;
  let toastTimer = null;
  let seasonToastTimer = null;
  let hoverInfo = null;
  let lastVisual = null;
  let completionTimer = null;

  function t(key) {
    return (TEXT[language] && TEXT[language][key]) || TEXT.en[key] || key;
  }

  function persist() {
    save.language = language;
    save.selected = selected;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (error) { /* storage is optional */ }
  }

  function isComplete(index) {
    return save.completed.includes(LEVELS[index].id);
  }

  function isUnlocked(index) {
    return index === 0 || isComplete(index - 1);
  }

  function firstUnresolved() {
    const index = LEVELS.findIndex(function (level) { return !save.completed.includes(level.id); });
    return index < 0 ? 0 : index;
  }

  function roman(number) {
    return ["I", "II", "III", "IV", "V", "VI", "VII"][number - 1] || String(number);
  }

  function localized(level, field) {
    return (level[field] && (level[field][language] || level[field].en)) || "";
  }

  class GentleAudio {
    constructor() { this.context = null; this.enabled = save.sound !== false; }
    ensure() {
      if (!this.enabled) return null;
      if (!this.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;
        this.context = new AudioContext();
      }
      if (this.context.state === "suspended") this.context.resume().catch(function () {});
      return this.context;
    }
    tone(frequency, delay, duration, type, volume) {
      const context = this.ensure();
      if (!context) return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + (delay || 0);
      oscillator.type = type || "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume || 0.045, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }
    play(events, season) {
      if (!this.enabled || !events.length) return;
      if (events.includes("invalid") || events.includes("bump")) { this.tone(155, 0, .12, "triangle", .025); return; }
      if (events.includes("season")) {
        const roots = { winter: 392, spring: 440, summer: 523.25, autumn: 349.23 };
        const root = roots[season] || 440;
        this.tone(root, 0, .38, "sine", .035);
        this.tone(root * 1.25, .09, .42, "sine", .025);
        this.tone(root * 1.5, .18, .48, "sine", .02);
      } else if (events.includes("pushed")) {
        this.tone(130, 0, .1, "triangle", .045);
        this.tone(195, .035, .12, "sine", .02);
      } else if (events.includes("step")) {
        this.tone(260 + Math.random() * 25, 0, .055, "sine", .014);
      }
      if (events.includes("fruitDropped")) this.tone(105, .12, .2, "triangle", .055);
      if (events.includes("undo")) this.tone(330, 0, .16, "sine", .025);
      if (events.includes("reset")) { this.tone(294, 0, .2, "sine", .025); this.tone(220, .1, .25, "sine", .02); }
      if (events.includes("seed")) [660, 825, 990].forEach((note, index) => this.tone(note, index * .08, .42, "sine", .035));
      if (events.includes("complete")) [392, 493.88, 587.33, 783.99].forEach((note, index) => this.tone(note, index * .12, .75, "sine", .04));
    }
  }

  const audio = new GentleAudio();
  const renderer = new window.ConservatoryRenderer($("garden-canvas"), LEVELS);

  function showToast(message, duration) {
    clearTimeout(toastTimer);
    const element = $("toast");
    element.textContent = message;
    element.classList.add("visible");
    toastTimer = setTimeout(function () {
      element.classList.remove("visible");
    }, duration || 6000);
  }

  function showSeasonToast(message) {
    clearTimeout(seasonToastTimer);
    const element = $("season-toast");
    element.textContent = message;
    element.classList.add("visible");
    seasonToastTimer = setTimeout(function () { element.classList.remove("visible"); }, 1900);
  }

  function buildGardenNav() {
    const nav = $("garden-nav");
    nav.textContent = "";
    LEVELS.forEach(function (level, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "garden-node" + (index === LEVELS.length - 1 ? " final" : "");
      button.setAttribute("aria-current", String(index === selected));
      button.setAttribute("aria-label", localized(level, "name") + (isComplete(index) ? " — " + t("restored") : ""));
      button.innerHTML = "<span class=\"node-number\">" + (isComplete(index) ? "✦" : roman(index + 1)) + "</span><span class=\"node-state\">" + (isComplete(index) ? t("restored") : (isUnlocked(index) ? "·" : "◇")) + "</span>";
      button.addEventListener("click", function () { selectGarden(index); });
      nav.appendChild(button);
    });
  }

  function selectGarden(index) {
    selected = index;
    if (mode === "hub" && !isUnlocked(index)) showToast(t("locked"));
    persist();
    updateUI();
  }

  function updateUI() {
    $("app").dataset.mode = mode;
    $("app").dataset.season = game ? game.state.season : "spring";
    $("app").dataset.level = game ? game.state.levelId : "";
    $("progress-count").textContent = save.completed.length + " / " + LEVELS.length;
    $("progress-fill").style.width = (save.completed.length / LEVELS.length * 100) + "%";
    $("hub-panel").hidden = mode !== "hub";
    $("level-panel").hidden = mode !== "level";
    $("garden-nav").hidden = mode !== "hub";
    $("season-dock").hidden = mode !== "level";
    $("hub-button").hidden = mode !== "level";
    $("click-tip").hidden = mode !== "level";

    if (mode === "hub") {
      const level = LEVELS[selected];
      $("scene-eyebrow").textContent = t("central");
      $("scene-title").textContent = t("title");
      $("selected-number").textContent = (selected === LEVELS.length - 1 ? t("finalGarden") : t("garden")) + " " + roman(selected + 1);
      $("selected-title").textContent = localized(level, "name");
      $("selected-subtitle").textContent = localized(level, "subtitle") || t("finalSubtitle");
      const enterLabel = $("enter-button").querySelector("[data-i18n]");
      const canResume = save.active && save.active.levelId === level.id;
      enterLabel.textContent = t(canResume ? "resumeGarden" : "enterGarden");
      $("enter-button").disabled = !isUnlocked(selected);
      buildGardenNav();
    } else if (game) {
      const level = game.level;
      $("scene-eyebrow").textContent = (level.number === LEVELS.length ? t("finalGarden") : t("garden")) + " " + roman(level.number);
      $("scene-title").textContent = localized(level, "name");
      $("move-count").textContent = game.state.moves + " " + t("moves");
      $("seed-status").textContent = t(game.state.seedTaken ? "seedFound" : "seedWaiting");
      $("seed-status").classList.toggle("taken", game.state.seedTaken);
      $("undo-button").disabled = !game.history.length;
      $("hint-step").textContent = hintStage + " / 3";
      $("hint-text").textContent = hintStage ? level.hints[language][hintStage - 1] : t("hintPrompt");
      $("hint-button").hidden = hintStage >= 3;
      document.querySelectorAll(".season-button").forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.season === game.state.season));
      });
    }
  }

  function applyLanguage(next) {
    language = TEXT[next] ? next : "en";
    document.documentElement.lang = language;
    $("language").value = language;
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      const key = element.dataset.i18n;
      if (TEXT.en[key]) element.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (element) {
      element.setAttribute("aria-label", t(element.dataset.i18nAria));
    });
    document.title = t("title");
    persist();
    updateUI();
  }

  function clearPath() {
    pathQueue = [];
    clearInterval(pathTimer);
    pathTimer = null;
  }

  function enterLevel(index, fresh) {
    clearTimeout(completionTimer);
    clearPath();
    if (!isUnlocked(index)) { showToast(t("locked")); return; }
    selected = index;
    const level = LEVELS[index];
    game = null;
    if (!fresh && save.active && save.active.levelId === level.id) {
      game = Core.Game.restore(level, save.active.data);
      if (game.state.completed) game = null;
    }
    if (!game) game = new Core.Game(level);
    mode = "level";
    hintStage = 0;
    lastVisual = null;
    $("rule-message").hidden = true;
    renderer.setSeason(game.state.season, true);
    save.active = { levelId: level.id, data: game.serialize() };
    persist();
    updateUI();
    $("garden-canvas").focus({ preventScroll: true });
  }

  function closeDialog(id) {
    const dialog = $(id);
    if (dialog.open) dialog.close();
  }

  function showHub(selectNext) {
    clearTimeout(completionTimer);
    clearPath();
    closeDialog("complete-dialog");
    closeDialog("conclusion-dialog");
    mode = "hub";
    game = null;
    lastVisual = null;
    if (selectNext) selected = firstUnresolved();
    renderer.setSeason("spring", true);
    persist();
    updateUI();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishLevel() {
    const index = selected;
    if (!save.completed.includes(game.level.id)) save.completed.push(game.level.id);
    save.active = null;
    persist();
    $("complete-title").textContent = localized(game.level, "name");
    completionTimer = setTimeout(function () {
      if (mode !== "level" || !game || !game.state.completed) return;
      $("complete-dialog").showModal();
    }, 650);
  }

  function dispatch(action, fromPath) {
    if (mode !== "level" || !game || document.querySelector("dialog[open]")) return { ok: false };
    if (!fromPath) clearPath();
    const before = Core.clone(game.state);
    const result = game.dispatch(action);
    if (!result.ok) {
      const message = t(result.reason) || t("blocked");
      $("rule-message").textContent = message;
      $("rule-message").hidden = false;
      showToast(message);
      audio.play(result.events || ["invalid"], game.state.season);
      if (fromPath) clearPath();
      return result;
    }
    $("rule-message").hidden = true;
    lastVisual = { before: before, after: Core.clone(game.state), start: performance.now() };
    if (before.season !== game.state.season) {
      renderer.setSeason(game.state.season, false);
      showSeasonToast(t(game.state.season + "Arrival"));
    } else if (result.events.includes("undo")) {
      renderer.setSeason(game.state.season, false);
      showToast(t("undoDone"), 1200);
    } else if (result.events.includes("reset")) {
      renderer.setSeason(game.state.season, false);
      hintStage = 0;
      showToast(t("resetDone"));
    } else if (result.events.includes("seed")) {
      showToast(t("seedChime"), 1800);
    }
    save.active = game.state.completed ? null : { levelId: game.level.id, data: game.serialize() };
    audio.play(result.events, game.state.season);
    hoverInfo = null;
    persist();
    updateUI();
    if (result.events.includes("complete")) finishLevel();
    return result;
  }

  function revealHint() {
    if (mode !== "level" || hintStage >= 3) return;
    hintStage += 1;
    updateUI();
  }

  function runPath(actions) {
    clearPath();
    if (!actions || !actions.length) return;
    pathQueue = actions.slice();
    const step = function () {
      if (!pathQueue.length || mode !== "level") { clearPath(); return; }
      const action = pathQueue.shift();
      const result = dispatch(action, true);
      if (!result.ok || result.events && result.events.includes("complete")) clearPath();
    };
    step();
    pathTimer = setInterval(step, 145);
  }

  function canvasPoint(event) {
    const rect = $("garden-canvas").getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function handleCanvasAction(event) {
    const point = canvasPoint(event);
    const region = renderer.pick(point.x, point.y);
    if (!region) return;
    if (mode === "hub" && region.type === "hubLevel") {
      if (selected === region.index && isUnlocked(region.index)) enterLevel(region.index);
      else selectGarden(region.index);
      return;
    }
    if (mode === "level" && region.type === "tile") {
      const path = Core.findPath(game.state, game.level, { x: region.x, y: region.y });
      if (path === null) showToast(t("noPath"));
      else runPath(path);
      $("garden-canvas").focus({ preventScroll: true });
    }
  }

  $("garden-canvas").addEventListener("pointerdown", handleCanvasAction);
  $("garden-canvas").addEventListener("pointermove", function (event) {
    const point = canvasPoint(event);
    const region = renderer.pick(point.x, point.y);
    hoverInfo = null;
    if (mode === "level" && region && region.type === "tile" && !pathQueue.length) {
      const actions = Core.findPath(game.state, game.level, { x: region.x, y: region.y });
      if (actions && actions.length) hoverInfo = { destination: region, actions: actions };
    }
    $("garden-canvas").style.cursor = region ? "pointer" : "default";
  });
  $("garden-canvas").addEventListener("pointerleave", function () { hoverInfo = null; });

  $("enter-button").addEventListener("click", function () { enterLevel(selected); });
  $("hub-button").addEventListener("click", function () { showHub(false); });
  $("brand-button").addEventListener("click", function () { showHub(false); });
  $("undo-button").addEventListener("click", function () { dispatch({ type: "undo" }); });
  $("reset-button").addEventListener("click", function () { dispatch({ type: "reset" }); });
  $("hint-button").addEventListener("click", revealHint);
  $("help-button").addEventListener("click", function () { clearPath(); $("help-dialog").showModal(); });
  $("language").addEventListener("change", function (event) { applyLanguage(event.target.value); });
  $("sound-button").addEventListener("click", function () {
    audio.enabled = !audio.enabled;
    save.sound = audio.enabled;
    $("sound-button").setAttribute("aria-pressed", String(audio.enabled));
    $("sound-icon").textContent = audio.enabled ? "♪" : "∅";
    showToast(t(audio.enabled ? "soundEnabled" : "soundDisabled"), 1200);
    if (audio.enabled) audio.play(["seed"], "spring");
    persist();
  });
  document.querySelectorAll(".season-button").forEach(function (button) {
    button.addEventListener("click", function () { dispatch({ type: "season", season: button.dataset.season }); });
  });
  document.querySelectorAll("[data-close]").forEach(function (button) {
    button.addEventListener("click", function () { closeDialog(button.dataset.close); });
  });
  $("continue-button").addEventListener("click", function () {
    const showConclusion = save.completed.length === LEVELS.length && selected === LEVELS.length - 1 && !save.conclusionSeen;
    if (showConclusion) { save.conclusionSeen = true; persist(); }
    showHub(true);
    if (showConclusion) setTimeout(function () { $("conclusion-dialog").showModal(); }, 350);
  });
  $("replay-button").addEventListener("click", function () {
    closeDialog("complete-dialog");
    save.active = null;
    enterLevel(selected, true);
  });
  $("wander-button").addEventListener("click", function () { closeDialog("conclusion-dialog"); });

  document.addEventListener("keydown", function (event) {
    if (document.querySelector("dialog[open]")) return;
    const key = event.key.toLowerCase();
    if (key === "m") {
      event.preventDefault();
      $("sound-button").click();
      return;
    }
    if (key === "?" || event.key === "F1") {
      event.preventDefault();
      $("help-button").click();
      return;
    }
    if (mode !== "level") {
      if (event.key === "Enter") { event.preventDefault(); enterLevel(selected); }
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        selectGarden((selected + (event.key === "ArrowRight" ? 1 : -1) + LEVELS.length) % LEVELS.length);
      }
      return;
    }
    const movement = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right" }[event.code];
    if (movement) {
      event.preventDefault();
      dispatch({ type: "move", direction: movement });
      return;
    }
    const season = { Digit1: "winter", Digit2: "spring", Digit3: "summer", Digit4: "autumn", Numpad1: "winter", Numpad2: "spring", Numpad3: "summer", Numpad4: "autumn" }[event.code];
    if (season) {
      event.preventDefault();
      dispatch({ type: "season", season: season });
      return;
    }
    if (event.code === "KeyZ" || (event.ctrlKey && key === "z") || event.key === "Backspace") {
      event.preventDefault();
      dispatch({ type: "undo" });
    } else if (event.code === "KeyR") {
      event.preventDefault();
      dispatch({ type: "reset" });
    } else if (event.code === "KeyH") {
      event.preventDefault();
      revealHint();
    } else if (event.key === "Escape") {
      showHub(false);
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) clearPath();
  });

  renderer.onFrame = function (time) {
    renderer.draw({ mode: mode, game: game, selected: selected, completed: save.completed, hover: hoverInfo, visual: lastVisual, time: time });
  };

  applyLanguage(language);
  $("sound-button").setAttribute("aria-pressed", String(audio.enabled));
  $("sound-icon").textContent = audio.enabled ? "♪" : "∅";
  if (!isUnlocked(selected)) selected = firstUnresolved();
  showHub(false);
  renderer.start();
})();
