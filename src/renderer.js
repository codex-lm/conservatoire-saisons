(function (root) {
  "use strict";

  const Core = root.ConservatoryCore;
  const PALETTES = {
    winter: { sky: "#c7dfe1", horizon: "#779da5", distant: "#527881", top: "#aec4bf", side: "#637f7c", soil: "#8b7964", leaf: "#8fb4ae", accent: "#e9f8f4", glow: "#d9f6ff" },
    spring: { sky: "#d7e4bd", horizon: "#86ad94", distant: "#4f7b6b", top: "#9dbb79", side: "#617d55", soil: "#8b7658", leaf: "#6e9e64", accent: "#f2b9c5", glow: "#fff1ac" },
    summer: { sky: "#f3d99a", horizon: "#8bb17f", distant: "#527c5f", top: "#a9bb68", side: "#687b48", soil: "#94744d", leaf: "#4f8a4e", accent: "#ffd46d", glow: "#ffe89a" },
    autumn: { sky: "#eac69d", horizon: "#a47d67", distant: "#705e50", top: "#b18a5d", side: "#775c45", soil: "#806047", leaf: "#b6673e", accent: "#e79b63", glow: "#ffd38a" }
  };

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function lerp(a, b, amount) { return a + (b - a) * amount; }
  function smooth(value) { const v = clamp(value, 0, 1); return v * v * (3 - 2 * v); }
  function hash(x, y, seed) { const value = Math.sin(x * 127.1 + y * 311.7 + (seed || 0) * 71.3) * 43758.5453; return value - Math.floor(value); }
  function rgb(color) {
    if (color.slice(0, 3) === "rgb") {
      const channels = color.match(/[\d.]+/g);
      return channels.slice(0, 3).map(Number);
    }
    const value = color.replace("#", "");
    return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
  }
  function mix(a, b, amount) {
    const aa = rgb(a), bb = rgb(b);
    return "rgb(" + Math.round(lerp(aa[0], bb[0], amount)) + "," + Math.round(lerp(aa[1], bb[1], amount)) + "," + Math.round(lerp(aa[2], bb[2], amount)) + ")";
  }
  function rgba(hex, alpha) { const c = rgb(hex); return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + alpha + ")"; }

  class ConservatoryRenderer {
    constructor(canvas, levels) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.levels = levels;
      this.regions = [];
      this.onFrame = null;
      this.season = "spring";
      this.previousSeason = "spring";
      this.seasonStart = performance.now();
      this.reducedMotion = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.layout = null;
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.particles = Array.from({ length: 34 }, function (_, index) {
        return { x: hash(index, 2, 1), y: hash(index, 4, 2), speed: .35 + hash(index, 7, 4) * .65, drift: hash(index, 9, 3) * 2 - 1, size: 1 + hash(index, 11, 8) * 2 };
      });
    }

    setSeason(season, instant) {
      if (season === this.season && !instant) return;
      this.previousSeason = instant ? season : this.season;
      this.season = season;
      this.seasonStart = instant ? performance.now() - 1000 : performance.now();
    }

    start() {
      const frame = (time) => {
        if (this.onFrame) this.onFrame(time);
        root.requestAnimationFrame(frame);
      };
      root.requestAnimationFrame(frame);
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(root.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      if (width !== this.width || height !== this.height || dpr !== this.dpr) {
        this.width = width;
        this.height = height;
        this.dpr = dpr;
        this.canvas.width = Math.round(width * dpr);
        this.canvas.height = Math.round(height * dpr);
      }
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    seasonAmount(name, time) {
      if (this.reducedMotion) return this.season === name ? 1 : 0;
      const amount = smooth((time - this.seasonStart) / 700);
      if (this.season === name) return amount;
      if (this.previousSeason === name) return 1 - amount;
      return 0;
    }

    palette(time) {
      const amount = this.reducedMotion ? 1 : smooth((time - this.seasonStart) / 700);
      const from = PALETTES[this.previousSeason];
      const to = PALETTES[this.season];
      const result = {};
      Object.keys(to).forEach((key) => { result[key] = mix(from[key], to[key], amount); });
      return result;
    }

    draw(model) {
      this.resize();
      this.regions = [];
      const time = model.time || performance.now();
      const palette = this.palette(time);
      this.drawBackground(time, palette, model.mode === "hub", model.completed ? model.completed.length : 0);
      if (model.mode === "hub" || !model.game) this.drawHub(model, time, palette);
      else this.drawLevel(model, time, palette);
      this.drawWeather(time, model.mode === "hub" ? "spring" : this.season, model.mode === "hub" && model.completed.length === this.levels.length);
    }

    drawBackground(time, palette, hub, restored) {
      const ctx = this.ctx, w = this.width, h = this.height;
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, palette.sky);
      gradient.addColorStop(.58, palette.horizon);
      gradient.addColorStop(1, palette.distant);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(w * .72, h * .08, 0, w * .72, h * .08, w * .48);
      glow.addColorStop(0, "rgba(255,245,197,.42)");
      glow.addColorStop(1, "rgba(255,245,197,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.globalAlpha = hub ? .26 : .18;
      ctx.strokeStyle = "#315c55";
      ctx.lineWidth = 2;
      const archWidth = Math.max(100, w / 6);
      for (let x = -archWidth * .3; x < w + archWidth; x += archWidth) {
        const top = -archWidth * .35;
        ctx.beginPath();
        ctx.moveTo(x, h * .76);
        ctx.lineTo(x, archWidth * .5);
        ctx.arc(x + archWidth * .5, archWidth * .5, archWidth * .5, Math.PI, 0);
        ctx.lineTo(x + archWidth, h * .76);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + archWidth * .5, top + archWidth * .35);
        ctx.lineTo(x + archWidth * .5, h * .75);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "rgba(242,245,216,.17)";
      for (let index = 0; index < 5; index += 1) {
        const x = (index * 263 + 50) % (w + 180) - 90;
        const y = h * (.55 + (index % 3) * .1);
        ctx.beginPath();
        ctx.ellipse(x, y, 110, 19, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 65, y + 3, 80, 13, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(41,91,64,.32)";
      ctx.fillStyle = "rgba(67,113,72,.3)";
      ctx.lineWidth = 2;
      for (let index = 0; index < 7; index += 1) {
        const x = (index + .5) * w / 7;
        const length = 28 + hash(index, 3, 9) * 75;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.bezierCurveTo(x - 8, length * .35, x + 12, length * .65, x + Math.sin(time / 1700 + index) * 4, length);
        ctx.stroke();
        for (let leaf = 0; leaf < 3; leaf += 1) {
          const yy = length * (.3 + leaf * .22);
          ctx.beginPath();
          ctx.ellipse(x + (leaf % 2 ? 5 : -5), yy, 6, 3, leaf % 2 ? .5 : -.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      if (hub && restored) {
        ctx.save();
        ctx.globalAlpha = .05 + restored * .015;
        ctx.fillStyle = "#fff5b8";
        ctx.beginPath();
        ctx.moveTo(w * .58, 0);
        ctx.lineTo(w * .88, h);
        ctx.lineTo(w * .52, h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    configureLevelLayout(level) {
      const points = [];
      level.map.forEach(function (row, y) {
        Array.from(row).forEach(function (tile, x) {
          if (tile !== " ") points.push({ x: (x - y) * 36, y: (x + y) * 18 });
        });
      });
      const minX = Math.min.apply(null, points.map(function (p) { return p.x; })) - 36;
      const maxX = Math.max.apply(null, points.map(function (p) { return p.x; })) + 36;
      const minY = Math.min.apply(null, points.map(function (p) { return p.y; })) - 15;
      const maxY = Math.max.apply(null, points.map(function (p) { return p.y; })) + 50;
      const scale = Math.min((this.width - 42) / (maxX - minX), (this.height - 122) / (maxY - minY + 75), 1.3);
      this.layout = {
        scale: Math.max(.32, scale),
        ox: this.width * .5 - (minX + maxX) * .5 * Math.max(.32, scale),
        oy: this.height * .53 - (minY + maxY) * .5 * Math.max(.32, scale) + 16
      };
    }

    configureHubLayout() {
      const scale = Math.max(.4, Math.min(this.width / 760, (this.height - 60) / 510, 1.3));
      this.layout = { scale: scale, ox: this.width * .5, oy: this.height * .45 - 72 * scale };
    }

    project(x, y, z) {
      const layout = this.layout;
      return {
        x: layout.ox + (x - y) * 36 * layout.scale,
        y: layout.oy + (x + y) * 18 * layout.scale - (z || 0) * layout.scale
      };
    }

    diamond(center, width, height) {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y - height / 2);
      ctx.lineTo(center.x + width / 2, center.y);
      ctx.lineTo(center.x, center.y + height / 2);
      ctx.lineTo(center.x - width / 2, center.y);
      ctx.closePath();
    }

    drawFloor(x, y, tile, state, level, time, palette) {
      const ctx = this.ctx, s = this.layout.scale, p = this.project(x, y);
      const tw = 72 * s, th = 36 * s, depth = 10 * s;
      const winter = this.seasonAmount("winter", time), spring = this.seasonAmount("spring", time);
      const walkable = Core.supports(state, level, x, y, false);
      if (tile === "v" && spring < .02) {
        this.diamond({ x: p.x, y: p.y + 8 * s }, tw * .9, th * .86);
        ctx.fillStyle = "rgba(28,65,62,.48)";
        ctx.fill();
        ctx.strokeStyle = "rgba(225,237,199,.24)";
        ctx.lineWidth = Math.max(1, s);
        ctx.setLineDash([3 * s, 5 * s]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        let top = palette.top;
        if (tile === "w") top = mix("#3c7d88", "#709aa5", winter * .4);
        if (tile === "t" || tile === "x") top = palette.soil;
        if (tile === "d") top = "#9c946d";
        if (tile === "e") top = "#9aa778";
        const variation = hash(x, y, 4) * .08;
        ctx.fillStyle = mix(palette.side, "#243f3b", .18 + variation);
        ctx.beginPath();
        ctx.moveTo(p.x - tw / 2, p.y);
        ctx.lineTo(p.x, p.y + th / 2);
        ctx.lineTo(p.x, p.y + th / 2 + depth);
        ctx.lineTo(p.x - tw / 2, p.y + depth);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = mix(palette.side, "#1d3936", .32);
        ctx.beginPath();
        ctx.moveTo(p.x + tw / 2, p.y);
        ctx.lineTo(p.x, p.y + th / 2);
        ctx.lineTo(p.x, p.y + th / 2 + depth);
        ctx.lineTo(p.x + tw / 2, p.y + depth);
        ctx.closePath();
        ctx.fill();
        this.diamond(p, tw, th);
        ctx.fillStyle = mix(top, "#f6e9bd", variation);
        ctx.fill();
        ctx.strokeStyle = walkable ? "rgba(255,248,208,.2)" : "rgba(27,66,60,.18)";
        ctx.lineWidth = Math.max(.6, s);
        ctx.stroke();

        if (tile === "g" || tile === "p" || tile === "e") {
          ctx.strokeStyle = "rgba(72,88,53,.16)";
          ctx.lineWidth = Math.max(.5, s * .7);
          ctx.beginPath();
          ctx.moveTo(p.x - tw * .28, p.y + th * .06);
          ctx.quadraticCurveTo(p.x, p.y + th * .22, p.x + tw * .22, p.y + th * .06);
          ctx.stroke();
        }
        if (tile === "w") {
          ctx.save();
          this.diamond(p, tw * .94, th * .9);
          ctx.clip();
          ctx.strokeStyle = "rgba(197,238,224,.28)";
          ctx.lineWidth = Math.max(1, s);
          for (let wave = -1; wave <= 1; wave += 1) {
            ctx.beginPath();
            const yy = p.y + wave * 7 * s + Math.sin(time / 700 + x + y) * s;
            ctx.moveTo(p.x - tw * .3, yy);
            ctx.quadraticCurveTo(p.x, yy + 4 * s, p.x + tw * .3, yy);
            ctx.stroke();
          }
          ctx.restore();
          if (winter > .01) {
            ctx.save();
            ctx.globalAlpha = winter;
            this.diamond(p, tw * (.94 + .02 * winter), th * .92);
            const ice = ctx.createLinearGradient(p.x - tw / 2, p.y - th / 2, p.x + tw / 2, p.y + th / 2);
            ice.addColorStop(0, "#e9f7f2");
            ice.addColorStop(.5, "#bcdde0");
            ice.addColorStop(1, "#eef8ee");
            ctx.fillStyle = ice;
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,.85)";
            ctx.lineWidth = 1.4 * s;
            ctx.stroke();
            ctx.strokeStyle = "rgba(100,157,171,.45)";
            ctx.lineWidth = .8 * s;
            ctx.beginPath();
            ctx.moveTo(p.x - tw * .17, p.y - th * .19);
            ctx.lineTo(p.x - tw * .03, p.y + th * .03);
            ctx.lineTo(p.x + tw * .11, p.y - th * .05);
            ctx.moveTo(p.x - tw * .03, p.y + th * .03);
            ctx.lineTo(p.x + tw * .04, p.y + th * .22);
            ctx.stroke();
            ctx.restore();
          }
        }
        if (tile === "v") this.drawVines(p, spring, time);
        if (tile === "p") this.drawPlate(p, Core.platePressed(state, level, { x: x, y: y }), time);
      }
      this.regions.push({ type: "tile", x: x, y: y, points: [
        { x: p.x, y: p.y - th / 2 }, { x: p.x + tw / 2, y: p.y }, { x: p.x, y: p.y + th / 2 }, { x: p.x - tw / 2, y: p.y }
      ] });
    }

    drawVines(p, amount, time) {
      if (amount < .01) return;
      const ctx = this.ctx, s = this.layout.scale, tw = 72 * s, th = 36 * s;
      ctx.save();
      ctx.globalAlpha = amount;
      this.diamond(p, tw * amount, th * amount);
      ctx.fillStyle = "rgba(92,139,76,.86)";
      ctx.fill();
      ctx.strokeStyle = "#d0dfa0";
      ctx.lineWidth = 1.3 * s;
      ctx.stroke();
      for (let vine = -1; vine <= 1; vine += 1) {
        ctx.strokeStyle = vine === 0 ? "#527444" : "#6d934f";
        ctx.lineWidth = (3.2 - Math.abs(vine)) * s;
        ctx.beginPath();
        ctx.moveTo(p.x - tw * .43 * amount, p.y + vine * 5 * s);
        ctx.bezierCurveTo(p.x - tw * .12, p.y - 7 * s + vine * 4 * s, p.x + tw * .12, p.y + 7 * s + vine * 4 * s, p.x + tw * .43 * amount, p.y + vine * 5 * s);
        ctx.stroke();
      }
      for (let leaf = 0; leaf < 7; leaf += 1) {
        const xx = p.x + (leaf - 3) * 8 * s * amount;
        const yy = p.y + Math.sin(leaf * 2.2) * 5 * s;
        ctx.fillStyle = leaf % 3 === 0 ? "#eeb7c1" : "#a8cd79";
        ctx.beginPath();
        ctx.ellipse(xx, yy, 3.8 * s * amount, 2.1 * s * amount, leaf, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    drawPlate(p, pressed, time) {
      const ctx = this.ctx, s = this.layout.scale;
      ctx.save();
      if (pressed) { ctx.shadowColor = "#ffe29a"; ctx.shadowBlur = 15 * s; }
      ctx.fillStyle = pressed ? "#f3cf78" : "#a58d64";
      ctx.strokeStyle = "#584f42";
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 1 * s, 14 * s, 7 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = pressed ? "#fff2b9" : "#d1bb8c";
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, 9 * s, 4.2 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    visualPosition(id, current, visual, time) {
      if (!visual || time - visual.start > 190 || this.reducedMotion) return current;
      const beforeList = id === "player" ? [visual.before.player] : visual.before.objects;
      const afterList = id === "player" ? [visual.after.player] : visual.after.objects;
      const before = beforeList.find(function (item) { return id === "player" || item.id === id; });
      const after = afterList.find(function (item) { return id === "player" || item.id === id; });
      if (!before || !after) return current;
      const amount = smooth((time - visual.start) / 180);
      return { x: lerp(before.x, after.x, amount), y: lerp(before.y, after.y, amount) };
    }

    drawLevel(model, time, palette) {
      const game = model.game, level = game.level, state = game.state;
      this.configureLevelLayout(level);
      for (let y = 0; y < level.map.length; y += 1) {
        for (let x = 0; x < level.map[y].length; x += 1) {
          const tile = level.map[y][x];
          if (tile !== " ") this.drawFloor(x, y, tile, state, level, time, palette);
        }
      }
      if (model.hover) this.drawHoverPath(model.hover, game, time);
      const drawables = [];
      level.map.forEach(function (row, y) {
        Array.from(row).forEach(function (tile, x) {
          if (tile === "t") drawables.push({ x: x, y: y, kind: "tree" });
          if (tile === "d") drawables.push({ x: x, y: y, kind: "door" });
          if (tile === "e" || (x === level.exit.x && y === level.exit.y)) drawables.push({ x: x, y: y, kind: "exit" });
          if ((tile === "g" || tile === "b") && hash(x, y, 12) > .68) drawables.push({ x: x, y: y, kind: "plant" });
        });
      });
      Core.activeObjects(state).forEach(function (object) { drawables.push({ x: object.x, y: object.y, kind: object.type, object: object }); });
      if (!state.seedTaken) drawables.push({ x: level.seed.x, y: level.seed.y, kind: "seed" });
      drawables.push({ x: state.player.x, y: state.player.y, kind: "player" });
      drawables.sort(function (a, b) { return (a.x + a.y) - (b.x + b.y) || a.x - b.x; });
      drawables.forEach((item) => {
        if (item.kind === "tree") this.drawTree(item.x, item.y, time, palette);
        else if (item.kind === "door") this.drawDoor(item.x, item.y, game, time, palette);
        else if (item.kind === "exit") this.drawExit(item.x, item.y, state.seedTaken, time, palette);
        else if (item.kind === "plant") this.drawSmallPlant(item.x, item.y, time, palette);
        else if (item.kind === "seed") this.drawSeed(item.x, item.y, time, palette);
        else if (item.kind === "player") {
          const position = this.visualPosition("player", state.player, model.visual, time);
          this.drawPlayer(position.x, position.y, time, palette, model.visual);
        } else {
          const position = this.visualPosition(item.object.id, item.object, model.visual, time);
          if (item.kind === "fruit") this.drawFruit(position.x, position.y, time, palette);
          else this.drawPlanter(position.x, position.y, time, palette);
        }
      });
    }

    drawHoverPath(hover, game, time) {
      const ctx = this.ctx, s = this.layout.scale;
      let state = game.state;
      const points = [];
      for (const action of hover.actions) {
        const result = Core.applyToState(state, game.level, action);
        if (!result.ok) break;
        state = result.state;
        points.push(this.project(state.player.x, state.player.y));
      }
      ctx.save();
      points.forEach(function (point, index) {
        ctx.globalAlpha = .35 + .4 * (index + 1) / points.length;
        ctx.fillStyle = "#fff4bd";
        ctx.beginPath();
        ctx.ellipse(point.x, point.y + 1 * s, 3.1 * s, 1.8 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      if (points.length) {
        const last = points[points.length - 1];
        ctx.globalAlpha = .65 + Math.sin(time / 250) * .12;
        ctx.strokeStyle = "#fff3b2";
        ctx.lineWidth = 1.5 * s;
        ctx.beginPath();
        ctx.ellipse(last.x, last.y, 12 * s, 6 * s, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawTree(x, y, time, palette) {
      const ctx = this.ctx, s = this.layout.scale, p = this.project(x, y);
      const winter = this.seasonAmount("winter", time), spring = this.seasonAmount("spring", time), summer = this.seasonAmount("summer", time), autumn = this.seasonAmount("autumn", time);
      ctx.save();
      ctx.fillStyle = "rgba(27,49,38,.25)";
      ctx.beginPath(); ctx.ellipse(p.x, p.y + 5 * s, 22 * s, 8 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#634c38";
      ctx.lineCap = "round";
      ctx.lineWidth = 7 * s;
      ctx.beginPath(); ctx.moveTo(p.x, p.y + 2 * s); ctx.lineTo(p.x - 2 * s, p.y - 35 * s); ctx.stroke();
      ctx.lineWidth = 3 * s;
      ctx.beginPath(); ctx.moveTo(p.x - 1 * s, p.y - 22 * s); ctx.lineTo(p.x - 18 * s, p.y - 38 * s); ctx.moveTo(p.x, p.y - 28 * s); ctx.lineTo(p.x + 17 * s, p.y - 44 * s); ctx.stroke();
      const leafColor = autumn > .2 ? "#bd6d43" : (winter > .2 ? "#78938a" : "#5e9460");
      const clusters = [[-15,-40,18,13],[4,-49,21,16],[19,-38,16,13],[-2,-30,20,13]];
      clusters.forEach(function (cluster, index) {
        ctx.fillStyle = mix(leafColor, "#f1b65f", autumn * .22 + index * .025);
        ctx.beginPath(); ctx.ellipse(p.x + cluster[0] * s, p.y + cluster[1] * s, cluster[2] * s, cluster[3] * s, index * .3, 0, Math.PI * 2); ctx.fill();
      });
      if (spring > .02) {
        ctx.fillStyle = rgba("#f5c0cc", spring);
        for (let flower = 0; flower < 12; flower += 1) {
          const xx = p.x + (hash(flower, 1, 5) - .5) * 55 * s;
          const yy = p.y - (30 + hash(flower, 2, 7) * 32) * s;
          ctx.beginPath(); ctx.arc(xx, yy, (1.5 + hash(flower, 3, 2)) * s * spring, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (winter > .02) {
        ctx.strokeStyle = rgba("#eef9f4", winter * .9);
        ctx.lineWidth = 4 * s;
        ctx.beginPath(); ctx.arc(p.x + 3 * s, p.y - 48 * s, 20 * s, Math.PI * 1.08, Math.PI * 1.88); ctx.stroke();
      }
      if (autumn > .02) {
        ctx.fillStyle = rgba("#d99045", autumn);
        [[-14,-33],[7,-40],[18,-30]].forEach(function (pos) { ctx.beginPath(); ctx.arc(p.x + pos[0] * s, p.y + pos[1] * s, 3.2 * s, 0, Math.PI * 2); ctx.fill(); });
      }
      ctx.restore();
    }

    drawSmallPlant(x, y, time, palette) {
      const s = this.layout.scale, p = this.project(x, y), summer = this.seasonAmount("summer", time), spring = this.seasonAmount("spring", time), winter = this.seasonAmount("winter", time);
      const ctx = this.ctx;
      const ox = (hash(x, y, 15) > .5 ? 1 : -1) * 23 * s;
      const oy = 3 * s;
      ctx.save();
      ctx.strokeStyle = winter > .5 ? "#91aaa0" : "#50734b";
      ctx.lineWidth = 1.4 * s;
      ctx.beginPath(); ctx.moveTo(p.x + ox, p.y + oy); ctx.quadraticCurveTo(p.x + ox - 2 * s, p.y - 7 * s, p.x + ox + Math.sin(time / 1300 + x) * s, p.y - 12 * s); ctx.stroke();
      if (summer > .1 || spring > .1) this.drawFlower(p.x + ox, p.y - 11 * s, Math.max(summer, spring * .7), spring > summer ? "#efb0bf" : "#f6c951");
      else {
        ctx.fillStyle = winter > .5 ? "#e4f0e8" : "#a47a4e";
        ctx.beginPath(); ctx.ellipse(p.x + ox, p.y - 11 * s, 2.5 * s, 4 * s, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    drawFlower(x, y, openness, color) {
      const ctx = this.ctx, s = this.layout.scale;
      ctx.save();
      ctx.fillStyle = color;
      for (let petal = 0; petal < 7; petal += 1) {
        const angle = petal / 7 * Math.PI * 2;
        const distance = 4.5 * s * openness;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, 3.6 * s * openness, 2.1 * s * openness, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#8e6431";
      ctx.beginPath(); ctx.arc(x, y, 3 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    drawDoor(x, y, game, time, palette) {
      const ctx = this.ctx, s = this.layout.scale, p = this.project(x, y), open = Core.doorOpen(game.state, game.level), summer = this.seasonAmount("summer", time);
      ctx.save();
      ctx.fillStyle = "rgba(28,45,35,.25)";
      ctx.beginPath(); ctx.ellipse(p.x, p.y + 5 * s, 25 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();
      if (open) {
        ctx.shadowColor = "#ffe29a"; ctx.shadowBlur = 22 * s;
        ctx.fillStyle = "rgba(255,226,137,.35)";
        ctx.beginPath(); ctx.ellipse(p.x, p.y - 19 * s, 19 * s, 28 * s, 0, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.strokeStyle = open ? "#e5bd64" : "#665b4c";
      ctx.lineWidth = 5 * s;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(p.x - 22 * s, p.y + 2 * s); ctx.lineTo(p.x - 22 * s, p.y - 37 * s); ctx.quadraticCurveTo(p.x, p.y - 64 * s, p.x + 22 * s, p.y - 37 * s); ctx.lineTo(p.x + 22 * s, p.y + 2 * s); ctx.stroke();
      const panelAlpha = open ? .14 : .94;
      const lift = open ? 31 * s : 0;
      ctx.globalAlpha = panelAlpha;
      ctx.fillStyle = "#476c62";
      ctx.strokeStyle = "#d0b473";
      ctx.lineWidth = 1.4 * s;
      ctx.beginPath(); ctx.moveTo(p.x - 17 * s, p.y - 1 * s - lift); ctx.lineTo(p.x - 17 * s, p.y - 35 * s - lift); ctx.quadraticCurveTo(p.x, p.y - 53 * s - lift, p.x + 17 * s, p.y - 35 * s - lift); ctx.lineTo(p.x + 17 * s, p.y - 1 * s - lift); ctx.closePath(); ctx.fill(); ctx.stroke();
      for (let bar = -1; bar <= 1; bar += 1) { ctx.beginPath(); ctx.moveTo(p.x + bar * 9 * s, p.y - 4 * s - lift); ctx.lineTo(p.x + bar * 9 * s, p.y - 43 * s - lift); ctx.stroke(); }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#4f7749"; ctx.lineWidth = 2 * s;
      ctx.beginPath(); ctx.moveTo(p.x - 29 * s, p.y + 1 * s); ctx.lineTo(p.x - 29 * s, p.y - 19 * s); ctx.stroke();
      this.drawFlower(p.x - 29 * s, p.y - 22 * s, Math.max(.18, summer), summer > .4 ? "#ffd45f" : "#9d9d67");
      ctx.restore();
    }

    drawExit(x, y, active, time, palette) {
      const ctx = this.ctx, s = this.layout.scale, p = this.project(x, y);
      ctx.save();
      if (active) { ctx.shadowColor = "#ffe79b"; ctx.shadowBlur = 20 * s; }
      ctx.strokeStyle = active ? "#f0d487" : "#6e7f6a";
      ctx.lineWidth = 4 * s;
      ctx.beginPath(); ctx.moveTo(p.x - 19 * s, p.y + 3 * s); ctx.lineTo(p.x - 19 * s, p.y - 28 * s); ctx.arc(p.x, p.y - 28 * s, 19 * s, Math.PI, 0); ctx.lineTo(p.x + 19 * s, p.y + 3 * s); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = active ? "rgba(255,231,148,.28)" : "rgba(43,77,66,.2)";
      ctx.beginPath(); ctx.moveTo(p.x - 14 * s, p.y); ctx.lineTo(p.x - 14 * s, p.y - 27 * s); ctx.arc(p.x, p.y - 27 * s, 14 * s, Math.PI, 0); ctx.lineTo(p.x + 14 * s, p.y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = active ? "#fff0ac" : "#91a088";
      ctx.beginPath(); ctx.arc(p.x, p.y - 46 * s, (2.4 + Math.sin(time / 350) * .4) * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    drawSeed(x, y, time, palette) {
      const ctx = this.ctx, s = this.layout.scale, p = this.project(x, y), bob = this.reducedMotion ? 0 : Math.sin(time / 430) * 4 * s;
      ctx.save();
      ctx.fillStyle = "rgba(255,234,151,.23)";
      ctx.beginPath(); ctx.ellipse(p.x, p.y + 2 * s, 19 * s, 8 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.translate(p.x, p.y - 22 * s + bob);
      if (!this.reducedMotion) ctx.rotate(Math.sin(time / 900) * .15);
      ctx.shadowColor = "#fff0a5"; ctx.shadowBlur = 24 * s;
      ctx.fillStyle = "#fff3a9";
      ctx.beginPath();
      for (let point = 0; point < 16; point += 1) {
        const angle = -Math.PI / 2 + point * Math.PI / 8;
        const radius = (point % 2 ? 4.5 : 11) * s;
        const xx = Math.cos(angle) * radius, yy = Math.sin(angle) * radius;
        if (point === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#e5a94b"; ctx.beginPath(); ctx.arc(0, 0, 3.2 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    drawFruit(x, y, time, palette) {
      const ctx = this.ctx, s = this.layout.scale, p = this.project(x, y);
      ctx.save();
      ctx.fillStyle = "rgba(46,46,29,.28)"; ctx.beginPath(); ctx.ellipse(p.x, p.y + 4 * s, 13 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.shadowColor = "rgba(255,211,111,.45)"; ctx.shadowBlur = 8 * s;
      const gradient = ctx.createRadialGradient(p.x - 4 * s, p.y - 12 * s, 1, p.x, p.y - 6 * s, 15 * s);
      gradient.addColorStop(0, "#ffd07b"); gradient.addColorStop(.45, "#d88943"); gradient.addColorStop(1, "#9c4f34");
      ctx.fillStyle = gradient;
      ctx.beginPath(); ctx.arc(p.x, p.y - 7 * s, 12 * s, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(111,57,36,.45)"; ctx.lineWidth = 1 * s;
      ctx.beginPath(); ctx.arc(p.x, p.y - 7 * s, 8 * s, -1.2, 1.2); ctx.stroke();
      ctx.strokeStyle = "#5d5435"; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(p.x, p.y - 18 * s); ctx.lineTo(p.x + 2 * s, p.y - 23 * s); ctx.stroke();
      ctx.fillStyle = "#799654"; ctx.beginPath(); ctx.ellipse(p.x + 6 * s, p.y - 21 * s, 5 * s, 2.5 * s, -.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    drawPlanter(x, y, time, palette) {
      const ctx = this.ctx, s = this.layout.scale, p = this.project(x, y), summer = this.seasonAmount("summer", time), spring = this.seasonAmount("spring", time);
      ctx.save();
      ctx.fillStyle = "rgba(40,47,31,.25)"; ctx.beginPath(); ctx.ellipse(p.x, p.y + 4 * s, 20 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#a85f43";
      ctx.beginPath(); ctx.moveTo(p.x - 18 * s, p.y - 12 * s); ctx.lineTo(p.x + 18 * s, p.y - 12 * s); ctx.lineTo(p.x + 13 * s, p.y + 4 * s); ctx.lineTo(p.x - 13 * s, p.y + 4 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#d58d62"; ctx.beginPath(); ctx.ellipse(p.x, p.y - 12 * s, 18 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#554c36"; ctx.beginPath(); ctx.ellipse(p.x, p.y - 12 * s, 14 * s, 3.7 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#edd0a1"; ctx.lineWidth = 1.5 * s;
      ctx.beginPath(); ctx.moveTo(p.x - 9 * s, p.y - 3 * s); ctx.lineTo(p.x + 9 * s, p.y - 3 * s); ctx.moveTo(p.x - 6 * s, p.y - 6 * s); ctx.lineTo(p.x - 9 * s, p.y - 3 * s); ctx.lineTo(p.x - 6 * s, p.y); ctx.moveTo(p.x + 6 * s, p.y - 6 * s); ctx.lineTo(p.x + 9 * s, p.y - 3 * s); ctx.lineTo(p.x + 6 * s, p.y); ctx.stroke();
      for (let stem = -1; stem <= 1; stem += 1) {
        ctx.strokeStyle = "#4f784a"; ctx.lineWidth = 1.6 * s;
        ctx.beginPath(); ctx.moveTo(p.x + stem * 7 * s, p.y - 13 * s); ctx.quadraticCurveTo(p.x + stem * 8 * s, p.y - 24 * s, p.x + stem * 10 * s + Math.sin(time / 800 + stem) * s, p.y - 30 * s); ctx.stroke();
        this.drawFlower(p.x + stem * 10 * s, p.y - 30 * s, Math.max(.2, summer + spring * .6), stem === 0 ? "#f1b0c0" : "#f4ce6b");
      }
      ctx.restore();
    }

    drawPlayer(x, y, time, palette, visual) {
      const ctx = this.ctx, s = this.layout.scale, p = this.project(x, y);
      const moving = visual && time - visual.start < 190 && (visual.before.player.x !== visual.after.player.x || visual.before.player.y !== visual.after.player.y);
      const bob = this.reducedMotion ? 0 : Math.sin(time / (moving ? 90 : 500)) * (moving ? 2 : .8) * s;
      const dx = visual ? visual.after.player.x - visual.before.player.x : 1;
      const dy = visual ? visual.after.player.y - visual.before.player.y : 0;
      const facing = dx - dy >= 0 ? 1 : -1;
      ctx.save();
      ctx.translate(p.x, p.y + bob);
      ctx.scale(facing, 1);
      ctx.fillStyle = "rgba(29,46,37,.3)"; ctx.beginPath(); ctx.ellipse(0, 4 * s, 13 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#4b4d42"; ctx.lineWidth = 3 * s; ctx.lineCap = "round";
      const step = moving && !this.reducedMotion ? Math.sin(time / 80) * 3 * s : 0;
      ctx.beginPath(); ctx.moveTo(-6 * s, -5 * s); ctx.lineTo(-7 * s + step, 2 * s); ctx.moveTo(6 * s, -5 * s); ctx.lineTo(7 * s - step, 2 * s); ctx.stroke();
      ctx.strokeStyle = "#aa814b"; ctx.lineWidth = 3 * s;
      ctx.beginPath(); ctx.moveTo(-11 * s, -20 * s); ctx.lineTo(-16 * s, -12 * s + step); ctx.moveTo(11 * s, -20 * s); ctx.lineTo(15 * s, -14 * s - step); ctx.stroke();
      const body = ctx.createLinearGradient(-10 * s, -25 * s, 12 * s, -4 * s);
      body.addColorStop(0, "#e0b86f"); body.addColorStop(.55, "#ad814d"); body.addColorStop(1, "#725a3d");
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(0, -15 * s, 12 * s, 14 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#5b533f"; ctx.lineWidth = 1.2 * s; ctx.stroke();
      ctx.fillStyle = "#42685f"; ctx.beginPath(); ctx.ellipse(3 * s, -14 * s, 5 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#cfe6bc"; ctx.beginPath(); ctx.arc(4 * s, -16 * s, 1.5 * s, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#716044"; ctx.lineWidth = 2 * s;
      ctx.beginPath(); ctx.moveTo(-12 * s, -19 * s); ctx.lineTo(-19 * s, -19 * s); ctx.moveTo(-19 * s, -24 * s); ctx.lineTo(-19 * s, -14 * s); ctx.moveTo(-22 * s, -24 * s); ctx.lineTo(-16 * s, -24 * s); ctx.moveTo(-22 * s, -14 * s); ctx.lineTo(-16 * s, -14 * s); ctx.stroke();
      ctx.fillStyle = "rgba(205,239,218,.76)";
      ctx.beginPath(); ctx.arc(0, -31 * s, 13 * s, Math.PI, 0); ctx.lineTo(13 * s, -28 * s); ctx.quadraticCurveTo(0, -21 * s, -13 * s, -28 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#776748"; ctx.lineWidth = 2 * s; ctx.stroke();
      ctx.fillStyle = "#35544c"; ctx.beginPath(); ctx.ellipse(0, -28 * s, 10 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f5e69b"; ctx.shadowColor = "#fff0a5"; ctx.shadowBlur = 6 * s;
      ctx.beginPath(); ctx.arc(4 * s, -29 * s, 1.8 * s, 0, Math.PI * 2); ctx.arc(-3 * s, -29 * s, 1.8 * s, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#527449"; ctx.lineWidth = 1.5 * s; ctx.beginPath(); ctx.moveTo(0, -43 * s); ctx.quadraticCurveTo(1 * s, -49 * s, 5 * s, -50 * s); ctx.stroke();
      ctx.fillStyle = "#a8cc78"; ctx.beginPath(); ctx.ellipse(7 * s, -50 * s, 5 * s, 2.5 * s, -.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    drawHub(model, time, palette) {
      this.configureHubLayout();
      const ctx = this.ctx, s = this.layout.scale;
      const springState = { season: "spring", objects: [], player: { x: -10, y: -10 }, seedTaken: false, completed: false };
      const hubLevel = { map: [] };
      for (let y = 0; y < 9; y += 1) {
        hubLevel.map[y] = "";
        for (let x = 0; x < 9; x += 1) {
          const dx = x - 4, dy = y - 4;
          const ground = dx * dx + dy * dy <= 20;
          hubLevel.map[y] += ground ? "g" : " ";
          if (ground) this.drawFloor(x, y, "g", springState, hubLevel, time, palette);
        }
      }
      this.regions = [];
      const plotPositions = [[2,2],[4,1],[6,2],[7,4],[5,6],[3,6],[1,4]];
      const items = [];
      plotPositions.slice(0, this.levels.length).forEach(function (position, index) { items.push({ x: position[0], y: position[1], kind: "plot", index: index }); });
      items.push({ x: 4, y: 4, kind: "greenhouse" }, { x: 4, y: 6, kind: "gardener" });
      items.sort(function (a, b) { return a.x + a.y - b.x - b.y; });
      items.forEach((item) => {
        if (item.kind === "plot") this.drawHubPlot(item.x, item.y, item.index, model, time, palette);
        else if (item.kind === "greenhouse") this.drawGreenhouse(4, 4, model.completed.length, time, palette);
        else this.drawPlayer(4.7, 5.8, time, palette, null);
      });
      ctx.save();
      ctx.fillStyle = "rgba(255,244,196,.7)";
      ctx.font = (10 * s) + "px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.fillText(saveText(model.completed.length, this.levels.length), this.width / 2, this.height - 22);
      ctx.restore();
      function saveText(done, total) { return done === total && total > 0 ? "✦  " + done + " / " + total + "  ✦" : done + " / " + total; }
    }

    drawHubPlot(x, y, index, model, time, palette) {
      const ctx = this.ctx, s = this.layout.scale, p = this.project(x, y), restored = model.completed.includes(this.levels[index].id), selected = model.selected === index;
      ctx.save();
      if (selected) {
        ctx.strokeStyle = "#ffe4a0"; ctx.lineWidth = 2 * s; ctx.globalAlpha = .65 + Math.sin(time / 300) * .2;
        ctx.beginPath(); ctx.ellipse(p.x, p.y - 5 * s, 38 * s, 21 * s, 0, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      }
      this.diamond(p, 61 * s, 30 * s);
      ctx.fillStyle = restored ? "#87a967" : "#6d7560"; ctx.fill();
      ctx.strokeStyle = restored ? "#d8d99a" : "#94937a"; ctx.lineWidth = 1.5 * s; ctx.stroke();
      if (restored) {
        for (let flower = 0; flower < 5; flower += 1) {
          const xx = p.x + (flower - 2) * 8 * s, yy = p.y - (5 + (flower % 2) * 5) * s;
          ctx.strokeStyle = "#4e7548"; ctx.lineWidth = 1.2 * s; ctx.beginPath(); ctx.moveTo(xx, p.y + 3 * s); ctx.lineTo(xx, yy); ctx.stroke();
          this.drawFlower(xx, yy, .65, flower % 2 ? "#f3b5c3" : "#f4d16c");
        }
        this.drawLantern(p.x + 24 * s, p.y - 8 * s, true, time);
      } else {
        ctx.strokeStyle = "#4d594c"; ctx.lineWidth = 2 * s;
        ctx.beginPath(); ctx.moveTo(p.x - 15 * s, p.y); ctx.lineTo(p.x - 5 * s, p.y - 9 * s); ctx.lineTo(p.x + 5 * s, p.y - 2 * s); ctx.moveTo(p.x + 7 * s, p.y - 13 * s); ctx.lineTo(p.x + 16 * s, p.y - 5 * s); ctx.stroke();
        ctx.fillStyle = "#9a967a"; ctx.beginPath(); ctx.arc(p.x - 8 * s, p.y - 8 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = restored ? "#ffe69a" : "#e3d9b6";
      ctx.font = "bold " + (12 * s) + "px Georgia";
      ctx.textAlign = "center";
      ctx.fillText(restored ? "✦" : String(index + 1), p.x, p.y - 24 * s);
      ctx.restore();
      this.regions.push({ type: "hubLevel", index: index, circle: { x: p.x, y: p.y - 8 * s, r: 42 * s } });
    }

    drawLantern(x, y, lit, time) {
      const ctx = this.ctx, s = this.layout.scale;
      ctx.save();
      ctx.strokeStyle = "#4c5544"; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 25 * s); ctx.stroke();
      if (lit) { ctx.shadowColor = "#ffe092"; ctx.shadowBlur = 15 * s; }
      ctx.fillStyle = lit ? "#ffe49a" : "#718073";
      ctx.beginPath(); ctx.moveTo(x - 5 * s, y - 29 * s); ctx.lineTo(x + 5 * s, y - 29 * s); ctx.lineTo(x + 4 * s, y - 19 * s); ctx.lineTo(x - 4 * s, y - 19 * s); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0; ctx.strokeStyle = "#796745"; ctx.lineWidth = 1.2 * s; ctx.stroke();
      ctx.restore();
    }

    drawGreenhouse(x, y, restored, time, palette) {
      const ctx = this.ctx, s = this.layout.scale, p = this.project(x, y), total = this.levels.length;
      const w = 112 * s, h = 92 * s;
      ctx.save();
      ctx.fillStyle = "rgba(30,51,40,.25)"; ctx.beginPath(); ctx.ellipse(p.x, p.y + 7 * s, w * .62, 18 * s, 0, 0, Math.PI * 2); ctx.fill();
      if (restored) { ctx.shadowColor = "#ffe4a0"; ctx.shadowBlur = (10 + restored * 2) * s; }
      ctx.fillStyle = restored ? "rgba(255,225,145," + (.1 + restored / total * .18) + ")" : "rgba(50,77,65,.28)";
      ctx.beginPath(); ctx.moveTo(p.x - w / 2, p.y); ctx.lineTo(p.x - w / 2, p.y - h * .48); ctx.arc(p.x, p.y - h * .48, w / 2, Math.PI, 0); ctx.lineTo(p.x + w / 2, p.y); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = restored === total ? "#e2bc6f" : "#8c8766"; ctx.lineWidth = 2.4 * s;
      ctx.beginPath(); ctx.moveTo(p.x - w / 2, p.y); ctx.lineTo(p.x - w / 2, p.y - h * .48); ctx.arc(p.x, p.y - h * .48, w / 2, Math.PI, 0); ctx.lineTo(p.x + w / 2, p.y); ctx.closePath(); ctx.stroke();
      for (let rib = -2; rib <= 2; rib += 1) {
        const xx = p.x + rib * w / 5;
        ctx.beginPath(); ctx.moveTo(xx, p.y); ctx.lineTo(xx, p.y - h * (.65 + (2 - Math.abs(rib)) * .12)); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(p.x - w / 2, p.y - h * .48); ctx.lineTo(p.x + w / 2, p.y - h * .48); ctx.stroke();
      ctx.fillStyle = "#315f50"; ctx.beginPath(); ctx.moveTo(p.x - 14 * s, p.y); ctx.lineTo(p.x - 14 * s, p.y - 37 * s); ctx.quadraticCurveTo(p.x, p.y - 50 * s, p.x + 14 * s, p.y - 37 * s); ctx.lineTo(p.x + 14 * s, p.y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#c3a76a"; ctx.stroke();
      for (let seed = 0; seed < restored; seed += 1) {
        const angle = Math.PI + (seed + 1) / (total + 1) * Math.PI;
        const xx = p.x + Math.cos(angle) * w * .43, yy = p.y - h * .48 + Math.sin(angle) * w * .43;
        ctx.fillStyle = "#ffe69a"; ctx.shadowColor = "#ffe69a"; ctx.shadowBlur = 10 * s;
        ctx.beginPath(); ctx.arc(xx, yy, 2.8 * s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (restored < total) {
        ctx.strokeStyle = "rgba(225,222,178,.55)"; ctx.lineWidth = 1.2 * s;
        ctx.beginPath(); ctx.moveTo(p.x - 37 * s, p.y - 54 * s); ctx.lineTo(p.x - 24 * s, p.y - 41 * s); ctx.lineTo(p.x - 34 * s, p.y - 27 * s); ctx.moveTo(p.x + 30 * s, p.y - 65 * s); ctx.lineTo(p.x + 20 * s, p.y - 47 * s); ctx.stroke();
      }
      ctx.restore();
    }

    drawWeather(time, season, celebration) {
      if (this.reducedMotion) return;
      const ctx = this.ctx, w = this.width, h = this.height;
      ctx.save();
      this.particles.forEach(function (particle, index) {
        const cycle = (particle.y + time / 1000 * particle.speed * .045) % 1.15;
        const x = (particle.x * w + Math.sin(time / 1500 + index) * 22 * particle.drift + w) % w;
        const y = cycle * h - 30;
        if (season === "winter") {
          ctx.fillStyle = "rgba(244,252,247,.65)";
          ctx.beginPath(); ctx.arc(x, y, particle.size * .7, 0, Math.PI * 2); ctx.fill();
        } else if (season === "autumn") {
          ctx.fillStyle = index % 2 ? "rgba(218,133,69,.6)" : "rgba(238,181,82,.55)";
          ctx.save(); ctx.translate(x, y); ctx.rotate(time / 700 + index); ctx.beginPath(); ctx.ellipse(0, 0, particle.size * 1.6, particle.size * .8, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        } else if (season === "spring" || celebration) {
          ctx.fillStyle = index % 3 ? "rgba(246,196,204,.5)" : "rgba(255,237,162,.55)";
          ctx.save(); ctx.translate(x, y); ctx.rotate(time / 1100 + index); ctx.beginPath(); ctx.ellipse(0, 0, particle.size * 1.3, particle.size * .65, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        } else {
          ctx.fillStyle = "rgba(255,235,154,.38)";
          ctx.beginPath(); ctx.arc(x, y, particle.size * .45, 0, Math.PI * 2); ctx.fill();
        }
      });
      ctx.restore();
    }

    pick(x, y) {
      for (let index = this.regions.length - 1; index >= 0; index -= 1) {
        const region = this.regions[index];
        if (region.circle) {
          const dx = x - region.circle.x, dy = y - region.circle.y;
          if (dx * dx + dy * dy <= region.circle.r * region.circle.r) return region;
        } else if (region.points && pointInPolygon(x, y, region.points)) return region;
      }
      return null;
    }
  }

  function pointInPolygon(x, y, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
      const xi = points[i].x, yi = points[i].y, xj = points[j].x, yj = points[j].y;
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  root.ConservatoryRenderer = ConservatoryRenderer;
})(typeof globalThis !== "undefined" ? globalThis : this);
