// Rudobór – survival 2D. Plik sam tworzy interfejs oraz płótno gry.
// Umieść go na stronie jako <script type="module" src="rudobor.js"></script>.
// Firebase 12.6.0 jest ładowany po wybraniu gry online.
(() => {
  'use strict';

  // Konfiguracja Firebase z oryginalnego skryptu.
  const firebaseConfig = {
    apiKey: "AIzaSyCanH2BBs2Up7BtN1AXQ1uyQd6YsmthT0w",
    authDomain: "pandixif-multiplayer.firebaseapp.com",
    databaseURL: "https://pandixif-multiplayer-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pandixif-multiplayer",
    storageBucket: "pandixif-multiplayer.firebasestorage.app",
    messagingSenderId: "226124925060",
    appId: "1:226124925060:web:c414a82236e554deb7dad1",
    measurementId: "G-8R64FCKHGQ"
  };
  function startRudobor() {
    let root = document.getElementById('rudobor');
    if (root?.dataset.running === 'true') return;
    if (!root) {
      root = document.createElement('div');
      root.id = 'rudobor';
      document.body.append(root);
    }
    root.dataset.running = 'true';
    if (Array.from(document.body.children).every(el => el === root || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName))) document.body.classList.add('rb-host');
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1';
      document.head.append(meta);
    }
    root.lang = 'pl';
    const style = document.createElement('style');
    style.textContent = `#rudobor { color-scheme: dark; }
body.rb-host { margin:0; min-height:100vh; background:#11191b; }
#rudobor, #rudobor * { box-sizing:border-box; }
#rudobor { --ink:#eff0da; --muted:#a4b3a5; --dim:#71877d; --line:#374841; --card:#1d2a27; --gold:#ffcd83; --mono:"IBM Plex Mono",ui-monospace,Consolas,monospace; color:var(--ink); font:15px/1.45 "DM Sans",system-ui,sans-serif; min-height:100vh; background:radial-gradient(ellipse at 42% 0%,#24332d 0%,#182321 48%,#101818 100%); }
#rudobor .rb-shell { max-width:1296px; margin:auto; padding:clamp(14px,3.4vh,42px) clamp(12px,3.6vw,54px) 20px; }
#rudobor button { color:var(--ink); font:inherit; font-size:13px; font-weight:650; cursor:pointer; border:1px solid var(--line); background:#25332e; border-radius:5px; user-select:none; -webkit-tap-highlight-color:transparent; }
#rudobor button:hover { background:#34443a; border-color:#78947e; }
#rudobor button:focus-visible, #rudobor input:focus-visible, #rb-view:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }
#rudobor button:disabled { color:#9aa69a; opacity:.55; cursor:default; }
#rudobor canvas { image-rendering:pixelated; }
#rudobor [data-icon] { width:18px; height:18px; flex:none; }
#rudobor .rb-head, #rudobor .rb-brand, #rudobor nav, #rudobor .rb-worldbar, #rudobor .rb-worldtitle, #rudobor .rb-worldactions, #rudobor .rb-head button, #rudobor .rb-pack, #rudobor .rb-dialog-head, #rudobor .rb-hud { display:flex; align-items:center; }
#rudobor .rb-head { justify-content:space-between; margin-bottom:clamp(16px,3vh,32px); gap:10px; }
#rudobor .rb-brand { gap:12px; }
#rudobor .rb-brand canvas { width:48px; height:48px; }
#rudobor h1, #rudobor h2 { margin:0; font-family:"Barlow Condensed","Archivo Narrow","Arial Narrow",system-ui,sans-serif; letter-spacing:-.055em; line-height:1; font-weight:850; }
#rudobor h1 { font-size:clamp(32px,3.3vw,48px); }
#rudobor nav { gap:10px; }
#rudobor .rb-head button { justify-content:center; gap:9px; min-height:40px; padding:0 15px; }
#rudobor .rb-head .rb-quiet { background:transparent; border-color:transparent; color:#c4cdbd; }
#rudobor .rb-head .rb-quiet:hover { background:#29382f; }
#rudobor .rb-question { display:grid; place-items:center; width:16px; height:16px; border-radius:50%; border:1.5px solid currentColor; font:700 11px/1 var(--mono); }
#rudobor .rb-primary { color:#2d281c; background:var(--gold); border-color:var(--gold); }
#rudobor .rb-primary:hover { color:#211e16; background:#ffdc9e; border-color:#ffdc9e; }
#rudobor .rb-console { border:1px solid #47584a; overflow:hidden; border-radius:10px; background:#1a2522; box-shadow:0 12px 45px #07100c66; }
#rudobor .rb-worldbar { height:44px; padding:0 16px; justify-content:space-between; gap:10px; border-bottom:1px solid #121e19; }
#rudobor .rb-worldtitle, #rudobor .rb-worldactions { gap:9px; }
#rudobor .rb-worldtitle strong { font-size:13px; letter-spacing:.01em; }
#rudobor .rb-worldtitle canvas { width:17px; height:17px; }
#rb-status { display:flex; align-items:center; gap:7px; color:#c6d0bf; font:11px var(--mono); }
#rb-status i { width:6px; height:6px; background:#a8c59e; border-radius:100%; }
#rb-status[data-mode="online"] i { background:#9be5bb; box-shadow:0 0 6px #7cbb8d; }
#rudobor .rb-divider { width:1px; height:17px; background:#46564a; margin:0 3px 0 7px; }
#rudobor .rb-iconbtn { background:transparent; border-color:transparent; display:grid; place-content:center; width:30px; height:30px; padding:0; }
#rudobor .rb-iconbtn:hover { background:#304039; }
#rudobor .rb-iconbtn canvas { width:16px; height:16px; }
#rudobor .rb-stage { position:relative; height:clamp(330px,60vh,620px); isolation:isolate; overflow:hidden; background:#c7b396; }
#rb-view { display:block; width:100%; height:100%; touch-action:none; outline:0; cursor:crosshair; }
#rudobor .rb-hud { position:absolute; top:14px; height:33px; background:#192320e6; border:1px solid #b9bb8f66; border-radius:4px; pointer-events:none; padding:0 10px; gap:8px; color:#f1e8d2; font:600 11px var(--mono); font-variant-numeric:tabular-nums; }
#rudobor .rb-health { left:14px; }
#rb-hearts { width:89px; height:14px; }
#rb-hp { color:#dfdec9; }
#rudobor .rb-time { right:14px; }
#rudobor .rb-time canvas { width:16px; height:16px; }
#rb-toast { position:absolute; left:50%; bottom:15px; transform:translate(-50%,5px); border-radius:4px; color:#fff2d8; background:#18241ff0; border:1px solid #8b997f; padding:6px 12px; max-width:85%; width:max-content; text-align:center; font-size:12px; opacity:0; pointer-events:none; transition:opacity .18s,transform .18s; }
#rb-toast.rb-show { opacity:1; transform:translate(-50%,0); }
#rudobor .rb-belt { display:flex; align-items:center; padding:13px 18px; gap:18px; border-top:1px solid #54614e; }
#rudobor .rb-gear { min-width:100px; flex:1; }
#rudobor .rb-gear span { display:block; color:var(--muted); text-transform:uppercase; font:10px var(--mono); letter-spacing:.12em; margin-bottom:3px; }
#rb-gear { font-size:17px; }
#rb-slots { display:flex; gap:6px; }
#rudobor .rb-slot { width:51px; height:48px; border-radius:4px; position:relative; padding:0; background:#27332e; border:1px solid #435447; }
#rudobor .rb-slot[aria-pressed="true"] { background:#4a4230; border:2px solid var(--gold); box-shadow:0 0 0 1px #141f19; }
#rudobor .rb-slot i,#rudobor .rb-slot b { font:10px/1 var(--mono); position:absolute; }
#rudobor .rb-slot i { top:3px; left:4px; color:#a4b4a2; }
#rudobor .rb-slot[aria-pressed="true"] i { color:var(--gold); }
#rudobor .rb-slot b { color:#f3e9cf; right:4px; bottom:3px; text-shadow:1px 1px #18231e; }
#rudobor .rb-slot canvas { width:27px; height:27px; vertical-align:middle; }
#rudobor .rb-slot[data-empty="true"] canvas { opacity:.4; filter:grayscale(.65); }
#rudobor .rb-pack { gap:8px; margin-left:auto; padding:9px 11px; }
#rudobor kbd { display:inline-block; font:10px/1 var(--mono); padding:3px 4px; border:1px solid #526051; border-radius:3px; color:#d4d7c3; background:#29352e; }
#rudobor .rb-hints { display:flex; flex-wrap:wrap; gap:10px 20px; justify-content:center; margin-top:15px; }
#rudobor .rb-hints span { display:flex; align-items:center; gap:4px; color:var(--muted); font-size:11px; }
#rudobor .rb-touch, #rudobor .rb-touchhint { display:none; }
#rb-dialog { color:var(--ink); width:min(425px,calc(100% - 28px)); max-height:84dvh; padding:22px; overflow:auto; background:#202d28; border:1px solid #74816a; border-radius:9px; box-shadow:0 22px 80px #07100caa; }
#rb-dialog::backdrop { background:#0d1615ae; }
#rudobor .rb-dialog-head { justify-content:space-between; margin-bottom:16px; }
#rudobor h2 { font-size:28px; }
#rudobor .rb-close { font:22px/1 system-ui; width:30px; height:30px; padding:0; border-color:transparent; background:transparent; }
#rb-dialog p { color:#c4cdbf; margin:10px 0 16px; font-size:14px; }
#rb-dialog form,#rb-dialog label { display:grid; gap:8px; }
#rb-dialog label { font-weight:650; font-size:13px; }
#rb-dialog input { display:block; width:100%; border:1px solid #657662; background:#17241e; color:var(--ink); border-radius:4px; padding:10px; font:inherit; margin-bottom:6px; }
#rb-dialog .rb-wide { width:100%; margin-top:8px; padding:10px 12px; }
#rb-dialog .rb-msg { color:var(--gold); font-size:13px; margin:0; }
#rb-dialog .rb-mats { display:flex; flex-wrap:wrap; gap:7px; margin:0 0 18px; }
#rb-dialog .rb-mats span { display:inline-flex; align-items:center; padding:4px 7px; background:#2a392f; border:1px solid #415443; border-radius:4px; gap:5px; font:11px var(--mono); }
#rb-dialog h3 { font-size:14px; margin:12px 0 6px; }
#rb-dialog .rb-recipe { display:flex; gap:9px; align-items:center; padding:9px 0; border-top:1px solid #415041; }
#rb-dialog .rb-recipe canvas { width:27px; height:27px; }
#rb-dialog .rb-recipe div { flex:1; }
#rb-dialog .rb-recipe strong,#rb-dialog .rb-recipe small { display:block; }
#rb-dialog .rb-recipe small { color:#bfcbba; font-size:11px; }
#rb-dialog .rb-recipe button { padding:6px 8px; }
#rb-dialog dl { margin:0; display:grid; grid-template-columns:auto 1fr; gap:9px 15px; font-size:13px; }
#rb-dialog dt { color:var(--gold); font:12px/1.5 var(--mono); }
#rb-dialog dd { margin:0; }
@media (min-width:780px) { #rudobor .rb-belt { display:grid; grid-template-columns:1fr auto 1fr; } #rudobor .rb-pack { justify-self:end; } }
@media (max-width:779px) { #rudobor .rb-belt { gap:8px; padding:10px; } #rudobor .rb-gear { display:none; } #rudobor .rb-slot { width:44px; height:45px; } }
@media (max-width:540px) {
  #rudobor .rb-shell { padding:12px 7px 16px; } #rudobor .rb-head { padding:0 4px; margin-bottom:12px; }
  #rudobor .rb-brand { gap:6px; } #rudobor .rb-brand canvas { width:35px; height:35px; }
  #rudobor .rb-head button { padding:0 9px; min-height:36px; } #rudobor nav { gap:1px; }
  #rudobor .rb-help-label { display:none; } #rudobor .rb-stage { height:clamp(320px,59dvh,550px); }
  #rudobor .rb-worldbar { height:38px; padding:0 9px; } #rudobor .rb-worldactions { gap:3px; }
  #rudobor .rb-hud { top:7px; height:28px; padding:0 6px; gap:4px; font-size:9px; }
  #rudobor .rb-health { left:6px; } #rudobor .rb-time { right:6px; } #rb-hearts { width:65px; height:10px; } #rb-hp { display:none; }
  #rudobor .rb-belt { padding:7px 5px; gap:3px; } #rb-slots { gap:3px; flex:1; }
  #rudobor .rb-slot { width:auto; min-width:0; height:42px; flex:1; } #rudobor .rb-slot canvas { width:23px; height:23px; }
  #rudobor .rb-pack { padding:7px 5px; font-size:11px; gap:3px; } #rudobor .rb-pack kbd { display:none; }
}
@media (pointer:coarse), (hover:none) {
  #rudobor .rb-touch { display:flex; justify-content:space-between; padding:0 8px; position:absolute; left:0; right:0; bottom:9px; pointer-events:none; }
  #rudobor .rb-touch div { display:flex; gap:5px; }
  #rudobor .rb-touch button { width:44px; height:44px; display:grid; place-content:center; border:1px solid #a9b49b; background:#17251fc9; color:#f2ecce; font-size:16px; pointer-events:auto; touch-action:none; }
  #rudobor .rb-touch button:active { background:#56654a; }
  #rudobor .rb-hints { display:none; } #rudobor .rb-touchhint { display:block; text-align:center; color:var(--muted); font-size:11px; margin:9px 4px; }
  #rb-toast { bottom:62px; }
}
@media (max-height:540px) and (orientation:landscape) {
  #rudobor .rb-shell { padding:3px 8px; } #rudobor .rb-head { margin:0 0 3px; } #rudobor .rb-brand canvas { width:25px; height:25px; }
  #rudobor h1 { font-size:24px; } #rudobor .rb-head button { min-height:27px; }
  #rudobor .rb-stage { height:calc(100dvh - 122px); min-height:175px; } #rudobor .rb-worldbar { height:30px; }
  #rudobor .rb-belt { padding:3px 9px; } #rudobor .rb-slot { width:43px; height:39px; } #rudobor .rb-hints,#rudobor .rb-touchhint { display:none; }
}`;
    document.head.append(style);
    root.innerHTML = `<div class="rb-shell">
  <header class="rb-head">
    <div class="rb-brand"><canvas data-icon="emblem" width="32" height="32" aria-hidden="true"></canvas><h1>Rudobór</h1></div>
    <nav aria-label="Menu gry">
      <button class="rb-quiet" data-action="help" aria-label="Sterowanie"><span class="rb-question" aria-hidden="true">?</span><span class="rb-help-label">Sterowanie</span></button>
      <button class="rb-primary" data-action="network"><canvas data-icon="people" aria-hidden="true"></canvas><span id="rb-online-label">Graj online</span></button>
    </nav>
  </header>
  <main class="rb-console" aria-label="Gra Rudobór">
    <div class="rb-worldbar">
      <div class="rb-worldtitle"><canvas data-icon="pine" aria-hidden="true"></canvas><strong>Dolina Sosen</strong></div>
      <div class="rb-worldactions">
        <span id="rb-status"><i></i><span>Solo</span></span>
        <span class="rb-divider"></span>
        <button class="rb-iconbtn" data-action="sound" aria-label="Włącz dźwięk" title="Włącz dźwięk" aria-pressed="false"><canvas data-icon="mute" aria-hidden="true"></canvas></button>
        <button class="rb-iconbtn" data-action="pause" aria-label="Pauza" title="Pauza (Esc)"><canvas data-icon="pause" aria-hidden="true"></canvas></button>
      </div>
    </div>
    <div class="rb-stage">
      <canvas id="rb-view" tabindex="0" aria-label="Świat gry. A i D poruszają postacią, spacja skacze, F atakuje. Przytrzymaj lewy przycisk myszy na bloku, aby kopać."></canvas>
      <div class="rb-hud rb-health" aria-label="Zdrowie"><canvas id="rb-hearts" width="59" height="9" aria-hidden="true"></canvas><span id="rb-hp">100 / 100</span></div>
      <div class="rb-hud rb-time"><canvas data-icon="sun" aria-hidden="true"></canvas><span id="rb-time">Dzień 1 · 07:00</span></div>
      <div id="rb-toast" role="status" aria-live="polite"></div>
      <div class="rb-touch" aria-label="Sterowanie dotykowe">
        <div><button data-hold="left" aria-label="Idź w lewo">◀</button><button data-hold="right" aria-label="Idź w prawo">▶</button></div>
        <div><button data-hold="attack" aria-label="Atak"><canvas data-icon="blade" aria-hidden="true"></canvas></button><button data-hold="jump" aria-label="Skok">▲</button></div>
      </div>
    </div>
    <div class="rb-belt">
      <div class="rb-gear"><span>W ręku</span><strong id="rb-gear">Kilof</strong></div>
      <div id="rb-slots" role="group" aria-label="Pasek narzędzi"></div>
      <button class="rb-pack" data-action="pack"><canvas data-icon="pack" aria-hidden="true"></canvas>Plecak <kbd>E</kbd></button>
    </div>
  </main>
  <footer class="rb-hints" aria-label="Skróty sterowania">
    <span><kbd>A</kbd><kbd>D</kbd> Ruch</span><span><kbd>Spacja</kbd> Skok</span><span><kbd>LPM</kbd> Kop / użyj</span><span><kbd>PPM</kbd> Postaw</span><span><kbd>F</kbd> Atak</span><span><kbd>1–6</kbd> Wybór</span>
  </footer>
  <p class="rb-touchhint">Przytrzymaj blok, aby kopać. Wybierz materiał i dotknij pustego pola, aby budować.</p>
  <dialog id="rb-dialog" aria-labelledby="rb-dialog-title"><div class="rb-dialog-head"><h2 id="rb-dialog-title"></h2><button data-action="close" aria-label="Zamknij" class="rb-close">×</button></div><div id="rb-dialog-body"></div></dialog>
</div>`;

    // Świat jest taki sam na każdym urządzeniu. Zapisy przechowują tylko zmienione pola.
    const T = 12,
      COLS = 224,
      ROWS = 76,
      HOME_X = 112;
    const AIR = 0,
      DIRT = 1,
      ROCK = 2,
      TREE = 3,
      LOG = 4,
      TORCH = 5,
      ORE = 6,
      BEDROCK = 7;
    const TILE_TIME = [0, .31, .65, .72, .42, .12, .88, Infinity];
    const SLOT_KEYS = ['pick', 'blade', 'dirt', 'wood', 'stone', 'torch'];
    const LABEL = {
      pick: 'Kilof',
      blade: 'Ostrze',
      dirt: 'Ziemia',
      wood: 'Drewno',
      stone: 'Kamień',
      torch: 'Pochodnia',
      gem: 'Kryształ'
    };
    const BUILD = {
      dirt: DIRT,
      wood: LOG,
      stone: ROCK,
      torch: TORCH
    };
    const CYCLE = 240,
      START_HOUR = 7,
      REACH = T * 5.25;
    const PLAYER_W = 8,
      PLAYER_H = 19;
    const base = new Uint8Array(COLS * ROWS);
    const heights = new Int16Array(COLS);
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const mix = (a, b, t) => a + (b - a) * t;
    const idx = (x, y) => y * COLS + x;
    const inside = (x, y) => x >= 0 && y >= 0 && x < COLS && y < ROWS;
    const solid = type => type === DIRT || type === ROCK || type === ORE || type === LOG || type === BEDROCK;
    const finite = (n, def, lo, hi) => Number.isFinite(n) ? clamp(n, lo, hi) : def;
    function hash(x, y = 0, seed = 0) {
      let n = Math.imul(x ^ seed + 593, 0x1f1f1f1f) ^ Math.imul(y + 719, 0x45d9f3b);
      n = Math.imul(n ^ n >>> 16, 0x45d9f3b);
      return ((n ^ n >>> 16) >>> 0) / 4294967296;
    }
    function noise(x, y, seed) {
      const i = Math.floor(x),
        j = Math.floor(y);
      let u = x - i,
        v = y - j;
      u = u * u * (3 - 2 * u);
      v = v * v * (3 - 2 * v);
      return mix(mix(hash(i, j, seed), hash(i + 1, j, seed), u), mix(hash(i, j + 1, seed), hash(i + 1, j + 1, seed), u), v);
    }
    function generateWorld() {
      for (let x = 0; x < COLS; x++) {
        const dx = x - HOME_X;
        const rolling = (noise(x * .075, 0, 41) - .5) * 9 + Math.sin(dx * .12) * 2;
        heights[x] = 30 + Math.round(rolling * clamp((Math.abs(dx) - 5) / 8, 0, 1));
        for (let y = heights[x]; y < ROWS; y++) {
          const depth = y - heights[x];
          const cavern = depth > 4 && noise(x * .12, y * .16, 72) + noise(x * .25, y * .31, 96) * .25 < .405;
          const grotto = ((dx - 8) / 5.8) ** 2 + ((y - 36) / 2.4) ** 2 < 1 || ((dx + 12) / 4.5) ** 2 + ((y - 36.5) / 1.8) ** 2 < 1;
          let tile = DIRT;
          if (depth >= 3 + Math.floor(noise(x * .14, 0, 3) * 3)) tile = ROCK;
          if (tile === ROCK && (noise(x * .44, y * .46, 31) > .75 || hash(x, y, 20) > .963)) tile = ORE;
          if (cavern || depth >= 3 && grotto) tile = AIR;
          if (y >= ROWS - 2) tile = BEDROCK;
          base[idx(x, y)] = tile;
        }
      }
      for (let x = 2; x < COLS - 2; x += 5 + Math.floor(hash(x, 0, 81) * 5)) {
        if (Math.abs(x - HOME_X) > 13) base[idx(x, heights[x] - 1)] = TREE;
      }
      for (const dx of [-12, -4, 8, 13]) {
        const x = HOME_X + dx;
        base[idx(x, heights[x] - 1)] = TREE;
      }
      for (const dx of [5, 9, 11, -11]) {
        const x = HOME_X + dx;
        for (let y = 34; y < 42; y++) {
          if (!solid(base[idx(x, y - 1)]) && solid(base[idx(x, y)])) {
            base[idx(x, y)] = ORE;
            break;
          }
        }
      }
    }
    generateWorld();
    function tileAt(world, x, y) {
      if (x < 0 || x >= COLS || y >= ROWS) return BEDROCK;
      if (y < 0) return AIR;
      const k = idx(x, y);
      return world.edits.get(k) ?? base[k];
    }
    function writeTile(world, x, y, type) {
      const k = idx(x, y);
      if (type === base[k]) world.edits.delete(k);else world.edits.set(k, type);
    }
    function blocksBox(world, x, y, w, h) {
      for (let row = Math.floor(y / T); row <= Math.floor((y + h - .001) / T); row++) for (let col = Math.floor(x / T); col <= Math.floor((x + w - .001) / T); col++) if (solid(tileAt(world, col, row))) return true;
      return false;
    }
    function overlaps(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }
    function safeSpawn(world, col = HOME_X) {
      const x = clamp(Math.floor(col), 1, COLS - 2);
      for (let y = 2; y < ROWS - 1; y++) {
        const px = x * T + (T - PLAYER_W) / 2,
          py = y * T - PLAYER_H;
        if (solid(tileAt(world, x, y)) && !blocksBox(world, px, py, PLAYER_W, PLAYER_H)) return {
          x: px,
          y: py
        };
      }
      return {
        x: x * T + 2,
        y: -PLAYER_H
      };
    }
    function moveBody(world, body, dt) {
      const nextX = clamp(body.x + body.vx * dt, 0, COLS * T - body.w);
      let wall = false;
      if (blocksBox(world, nextX, body.y, body.w, body.h)) {
        wall = true;
        if (body.vx > 0) body.x = Math.floor((nextX + body.w - .001) / T) * T - body.w;
        if (body.vx < 0) body.x = (Math.floor(nextX / T) + 1) * T;
        body.vx = 0;
      } else body.x = nextX;
      body.vy = Math.min(220, body.vy + 360 * dt);
      const nextY = body.y + body.vy * dt;
      body.grounded = false;
      if (blocksBox(world, body.x, nextY, body.w, body.h)) {
        if (body.vy > 0) {
          body.y = Math.floor((nextY + body.h - .001) / T) * T - body.h;
          body.grounded = true;
        } else body.y = (Math.floor(nextY / T) + 1) * T;
        body.vy = 0;
      } else body.y = nextY;
      return wall;
    }
    function parseSave(key) {
      try {
        return JSON.parse(localStorage.getItem(key)) || {};
      } catch {
        return {};
      }
    }
    function loadWorld(room = '', nick = '') {
      const key = room ? 'rudobor.v1.room.' + room + '.' + nick.toLowerCase() : 'rudobor.v1.solo';
      const saved = parseSave(key);
      const bag = {
        blade: 0,
        dirt: 6,
        wood: 2,
        stone: 0,
        torch: 2,
        gem: 0,
        upgrade: 0
      };
      for (const k of Object.keys(bag)) bag[k] = Math.floor(finite(saved.bag?.[k], bag[k], 0, k === 'blade' || k === 'upgrade' ? 1 : 99999));
      const world = {
        key,
        room,
        nick,
        bag,
        edits: new Map(),
        mobs: [],
        particles: [],
        slot: Math.round(finite(saved.slot, 0, 0, 5)),
        time: finite(saved.time, 0, 0, 1e10),
        spawnTimer: 4,
        epoch: 0,
        nextAttack: 0,
        flash: 0,
        swing: 0,
        hurt: 0,
        grace: 0,
        jumpBuffer: 0
      };
      if (!room && Array.isArray(saved.edits)) {
        for (const pair of saved.edits) {
          if (!Array.isArray(pair)) continue;
          const [k, v] = pair;
          if (Number.isInteger(k) && k >= 0 && k < COLS * (ROWS - 2) && Number.isInteger(v) && v >= AIR && v <= ORE) world.edits.set(k, v);
        }
      }
      const spawn = safeSpawn(world);
      world.hero = {
        ...spawn,
        w: PLAYER_W,
        h: PLAYER_H,
        vx: 0,
        vy: 0,
        dir: saved.dir === -1 ? -1 : 1,
        grounded: false,
        hp: Math.round(finite(saved.hp, 100, 0, 100))
      };
      if (Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
        world.hero.x = clamp(saved.x, 0, COLS * T - PLAYER_W);
        world.hero.y = clamp(saved.y, -2 * T, (ROWS - 2) * T - PLAYER_H);
      }
      if (!room && blocksBox(world, world.hero.x, world.hero.y, PLAYER_W, PLAYER_H)) Object.assign(world.hero, spawn);
      return world;
    }
    let saveWarned = false;
    function saveWorld(world) {
      const {
        hero,
        bag,
        slot,
        time
      } = world;
      const data = {
        x: hero.x,
        y: hero.y,
        dir: hero.dir,
        hp: hero.hp,
        bag,
        slot,
        time
      };
      if (!world.room) data.edits = [...world.edits];
      try {
        localStorage.setItem(world.key, JSON.stringify(data));
      } catch {
        if (!saveWarned) {
          saveWarned = true;
          toast('Przeglądarka nie może zapisać postępu na tym urządzeniu.');
        }
      }
    }
    function clockAt(world) {
      const hours = world.time / CYCLE * 24 + START_HOUR;
      return {
        day: 1 + Math.floor(hours / 24),
        hour: (hours % 24 + 24) % 24
      };
    }
    function sunlight(hour) {
      if (hour < 4.7 || hour > 20.7) return 0;
      return Math.min(1, (hour - 4.7) / 2.4, (20.7 - hour) / 2.4);
    }
    function crownSize(col) {
      return 40 + Math.floor(hash(col, 0, 56) * 39);
    }
    let game = loadWorld();

    // Grafika pikselowa jest rysowana w przeglądarce, również bez internetu.
    function surface(w, h) {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      return ctx;
    }
    function rect(c, color, x, y, w, h) {
      c.fillStyle = color;
      c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    }
    function line(c, color, x1, y1, x2, y2) {
      x1 = Math.round(x1);
      y1 = Math.round(y1);
      x2 = Math.round(x2);
      y2 = Math.round(y2);
      const dx = Math.abs(x2 - x1),
        dy = -Math.abs(y2 - y1),
        sx = x1 < x2 ? 1 : -1,
        sy = y1 < y2 ? 1 : -1;
      let err = dx + dy;
      c.fillStyle = color;
      for (;;) {
        c.fillRect(x1, y1, 1, 1);
        if (x1 === x2 && y1 === y2) break;
        const e = 2 * err;
        if (e >= dy) {
          err += dy;
          x1 += sx;
        }
        if (e <= dx) {
          err += dx;
          y1 += sy;
        }
      }
    }
    function poly(c, color, pts) {
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(Math.round(pts[0][0]), Math.round(pts[0][1]));
      for (let i = 1; i < pts.length; i++) c.lineTo(Math.round(pts[i][0]), Math.round(pts[i][1]));
      c.closePath();
      c.fill();
    }
    const iconCache = new Map();
    function iconSprite(name) {
      if (iconCache.has(name)) return iconCache.get(name);
      const big = name === 'emblem',
        c = surface(big ? 32 : 16, big ? 32 : 16);
      const r = (color, x, y, w, h) => rect(c, color, x, y, w, h);
      const l = (color, x, y, xx, yy) => line(c, color, x, y, xx, yy);
      const p = (color, pts) => poly(c, color, pts);
      const gold = '#f7c67a',
        cream = '#f5e6b5',
        dark = '#253b38',
        metal = '#93bab1',
        sage = '#b4c8ad';
      if (name === 'emblem') {
        p('#e4b46c', [[4, 0], [27, 0], [32, 5], [32, 27], [27, 32], [5, 32], [0, 27], [0, 5]]);
        p('#213c35', [[5, 2], [26, 2], [30, 6], [30, 26], [26, 30], [6, 30], [2, 26], [2, 6]]);
        r('#ffd38a', 21, 5, 5, 5);
        r('#ffd38a', 20, 6, 7, 3);
        p('#8baf8d', [[4, 24], [14, 9], [17, 15], [20, 12], [29, 25]]);
        p('#d8d5a1', [[8, 20], [14, 9], [17, 15], [14, 13], [12, 16], [11, 15]]);
        p('#547665', [[14, 11], [22, 25], [11, 25], [17, 20]]);
        for (const [x, y] of [[5, 16], [22, 18], [9, 20]]) {
          p('#203f35', [[x, y], [x + 3, y + 4], [x + 2, y + 4], [x + 5, y + 8], [x + 2, y + 8], [x + 2, y + 11], [x, y + 11], [x, y + 8], [x - 4, y + 8], [x - 1, y + 4], [x - 2, y + 4]]);
        }
        r('#dfb575', 8, 27, 12, 1);
        r('#8d9b73', 14, 25, 10, 1);
      } else if (name === 'pick' || name === 'upgrade') {
        p('#503b2c', [[2, 13], [10, 4], [13, 5], [4, 15], [2, 15]]);
        l('#d99352', 3, 13, 11, 5);
        l('#efb775', 4, 13, 11, 6);
        p(dark, [[3, 2], [7, 1], [12, 3], [14, 6], [15, 11], [12, 7], [8, 5], [3, 4]]);
        p(name === 'upgrade' ? '#65bfb0' : metal, [[2, 2], [7, 1], [12, 3], [14, 6], [14, 9], [11, 6], [7, 4], [3, 3]]);
        l(cream, 3, 2, 7, 2);
        l(cream, 9, 3, 12, 4);
        r('#675241', 9, 4, 2, 2);
      } else if (name === 'blade') {
        p('#49645f', [[4, 10], [12, 2], [15, 1], [14, 5], [7, 12]]);
        p('#c8d7c1', [[4, 10], [12, 2], [15, 1], [12, 5], [6, 11]]);
        l('#edcf8e', 3, 8, 8, 13);
        l('#906940', 2, 9, 7, 14);
        l('#c59159', 2, 13, 4, 11);
        r(gold, 1, 13, 2, 2);
      } else if (name === 'dirt' || name === 'stone' || name === 'wood') {
        const col = name === 'dirt' ? ['#8e6746', '#6d4e39', '#553f31'] : name === 'wood' ? ['#b5814f', '#97683f', '#755035'] : ['#9ca49a', '#79887e', '#5b6a66'];
        p(col[0], [[1, 5], [8, 2], [15, 5], [8, 8]]);
        p(col[1], [[1, 5], [8, 8], [8, 15], [1, 12]]);
        p(col[2], [[8, 8], [15, 5], [15, 12], [8, 15]]);
        if (name === 'dirt') {
          p('#9aaa62', [[1, 5], [8, 2], [15, 5], [8, 8]]);
          l('#657c4d', 1, 6, 7, 8);
          r('#ad7851', 3, 9, 2, 1);
        }
        if (name === 'wood') {
          l('#dbab6b', 4, 5, 8, 3);
          l('#936341', 6, 6, 11, 4);
          l('#bc925e', 3, 8, 3, 11);
          l('#a1744a', 10, 9, 10, 12);
        }
        if (name === 'stone') {
          l('#c0c3a6', 3, 5, 6, 4);
          r('#62756c', 3, 10, 2, 1);
          r('#879486', 10, 10, 2, 1);
        }
      } else if (name === 'torch') {
        p('#795139', [[6, 7], [10, 6], [9, 14], [6, 15]]);
        r('#c69256', 7, 8, 1, 6);
        r(dark, 6, 8, 4, 2);
        p('#dc743b', [[5, 7], [5, 4], [7, 2], [8, 0], [9, 3], [11, 2], [11, 6], [9, 8], [6, 8]]);
        p(gold, [[6, 6], [8, 2], [9, 5], [10, 4], [9, 7], [7, 7]]);
        r(cream, 7, 5, 2, 2);
      } else if (name === 'gem') {
        p('#3e827f', [[2, 8], [5, 4], [7, 7], [10, 1], [13, 3], [13, 10], [7, 15], [3, 13]]);
        p('#71c8b5', [[5, 4], [7, 7], [7, 13], [4, 10]]);
        p('#a0edcf', [[10, 1], [12, 3], [9, 10], [8, 10]]);
        l('#d6f5d4', 10, 3, 9, 6);
        r('#4d9e99', 10, 10, 2, 2);
      } else if (name === 'pack') {
        r('#a1744e', 5, 1, 6, 3);
        r('#1b302a', 7, 2, 2, 2);
        r('#a37e55', 3, 4, 10, 10);
        r('#cfad78', 4, 4, 8, 3);
        r('#73583e', 2, 8, 2, 5);
        r('#775c3f', 12, 8, 2, 5);
        r('#805f42', 4, 9, 8, 4);
        r(gold, 7, 7, 2, 3);
      } else if (name === 'pine') {
        p('#a8c296', [[8, 0], [12, 6], [10, 6], [14, 11], [10, 11], [11, 13], [5, 13], [6, 11], [2, 11], [6, 6], [4, 6]]);
        r('#b89b65', 7, 13, 2, 3);
      } else if (name === 'people') {
        for (const [x, y] of [[9, 2], [2, 4]]) {
          r('#384b36', x + 1, y, 3, 3);
          r('#384b36', x, y + 4, 5, 2);
          r('#384b36', x - 1, y + 6, 7, 3);
        }
      } else if (name === 'sun' || name === 'moon') {
        if (name === 'sun') {
          r(gold, 5, 4, 6, 8);
          r(gold, 4, 5, 8, 6);
          for (const [x, y] of [[7, 0], [7, 14], [0, 7], [14, 7], [2, 2], [12, 2], [2, 12], [12, 12]]) r(cream, x, y, 2, 2);
        } else {
          p('#ebdfb8', [[9, 1], [6, 4], [6, 8], [9, 11], [13, 11], [11, 14], [6, 14], [2, 10], [2, 6], [5, 2]]);
          r(gold, 12, 3, 2, 2);
        }
      } else if (name === 'sound' || name === 'mute') {
        p(sage, [[1, 6], [4, 6], [8, 2], [8, 14], [4, 10], [1, 10]]);
        if (name === 'mute') {
          l(sage, 10, 6, 14, 10);
          l(sage, 14, 6, 10, 10);
        } else {
          l(sage, 10, 5, 11, 6);
          r(sage, 11, 6, 1, 4);
          l(sage, 13, 3, 14, 5);
          r(sage, 14, 5, 1, 6);
          l(sage, 14, 11, 13, 12);
        }
      } else if (name === 'pause') {
        r(sage, 3, 3, 3, 10);
        r(sage, 10, 3, 3, 10);
      } else if (name === 'tonic') {
        r(gold, 6, 1, 4, 2);
        r('#bcd1b8', 6, 3, 4, 4);
        p('#85b6a0', [[6, 5], [10, 5], [13, 9], [13, 13], [11, 15], [5, 15], [3, 13], [3, 9]]);
        r('#4f9f83', 4, 10, 8, 3);
        r('#c8e0b9', 5, 8, 2, 2);
      }
      iconCache.set(name, c.canvas);
      return c.canvas;
    }
    function paintIcons(parent) {
      parent.querySelectorAll('canvas[data-icon]').forEach(canvas => {
        const sprite = iconSprite(canvas.dataset.icon);
        if (canvas.width !== sprite.width) canvas.width = sprite.width;
        if (canvas.height !== sprite.height) canvas.height = sprite.height;
        const c = canvas.getContext('2d');
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.drawImage(sprite, 0, 0);
      });
    }
    const treeCache = new Map();
    function treeSprite(col) {
      const variant = (col % 53 + 53) % 53,
        h = crownSize(col),
        key = variant + '-' + h;
      if (treeCache.has(key)) return treeCache.get(key);
      const w = Math.ceil(h * .68) | 1,
        mid = w >> 1,
        c = surface(w, h + 2);
      const green = ['#203d34', '#2b4d3b', '#385d43', '#496d49', '#668152'];
      const trunk = Math.max(3, Math.floor(h / 15)),
        stemY = Math.floor(h * .55);
      rect(c, '#4a3c30', mid - trunk / 2, stemY, trunk, h - stemY);
      rect(c, '#896242', mid - trunk / 2, stemY, 2, h - stemY - 1);
      rect(c, '#b08050', mid - trunk / 2, h * .81, 1, h * .14);
      for (let k = 0; k < 5; k++) {
        const y = h * (.62 + k * .069);
        line(c, '#604a37', mid - 1, y, mid + 1, y - 1);
      }
      poly(c, '#5a4936', [[mid - 1, h - 5], [mid + 2, h - 4], [mid + 5, h], [mid - 5, h]]);
      for (let level = 8; level >= 0; level--) {
        const by = Math.round(h * (.057 + level * .083));
        const rad = Math.max(2, Math.round(w * (.08 + level * .049)));
        const tip = Math.max(0, by - h * .17);
        const bend = Math.round((hash(variant, level, 6) - .5) * 3);
        const pts = [[mid + bend, tip], [mid + rad * .46, by - h * .081], [mid + rad * .62, by - h * .052], [mid + rad * .83 + 1, by - h * .037], [mid + rad * .78, by - h * .020], [mid + rad, by], [mid + rad * .67, by + 1], [mid + rad * .74, by + 3], [mid + rad * .35, by + 2], [mid + rad * .15, by + 4], [mid - rad * .13, by + 2], [mid - rad * .54, by + 4], [mid - rad * .45, by + 1], [mid - rad * .91, by + 2], [mid - rad * .78, by], [mid - rad, by], [mid - rad * .64, by - h * .061], [mid - rad * .47, by - h * .075]];
        poly(c, green[0], pts);
        poly(c, green[1], [[mid + bend, tip], [mid + rad * .39, by - h * .065], [mid + rad * .68, by - 2], [mid + rad * .42, by - 2], [mid + rad * .52, by], [mid + rad * .12, by - 1], [mid - rad * .06, by + 1], [mid - rad * .33, by - 1], [mid - rad * .73, by + 1], [mid - rad * .58, by - 2], [mid - rad * .9, by - 1], [mid - rad * .45, by - h * .075]]);
        poly(c, green[2], [[mid + bend, tip], [mid + 1, by - h * .072], [mid + rad * .19, by - 2], [mid - rad * .1, by - 3], [mid - rad * .24, by - 1], [mid - rad * .36, by - 3], [mid - rad * .78, by], [mid - rad * .46, by - h * .068]]);
        for (let j = 0; j < Math.max(2, rad * .7); j++) {
          const lx = Math.round((hash(variant, level * 24 + j, 17) - .75) * rad);
          const ly = Math.round(by - 2 - hash(variant, j + level * 33, 12) * Math.max(2, h * .064));
          rect(c, green[3 + (j % 5 === 0 ? 1 : 0)], mid + lx, ly, 1 + Math.floor(hash(j, variant, 4) * 3), 1);
        }
      }
      treeCache.set(key, c.canvas);
      return c.canvas;
    }
    const atlas = new Map();
    function tileSprite(type, x, y) {
      const variant = Math.floor(hash(x, y, 2) * 12),
        key = type * 16 + variant;
      if (atlas.has(key)) return atlas.get(key);
      const c = surface(T, T),
        dirt = type === DIRT;
      const colors = dirt ? ['#79583f', '#6b4c37', '#896447', '#a07b56', '#5e4635'] : type === LOG ? ['#8a6746', '#6f533c', '#b28a60', '#a17b53', '#574634'] : type === BEDROCK ? ['#354442', '#293836', '#4b5650', '#53605a', '#273532'] : ['#536062', '#485456', '#687573', '#7c8780', '#404e50'];
      rect(c, colors[0], 0, 0, T, T);
      if (type === LOG) {
        for (let i = 0; i < 3; i++) {
          const yy = i * 4;
          rect(c, colors[1], 0, yy, T, 1);
          rect(c, colors[2], 1, yy + 1, 9, 1);
          rect(c, colors[4], (variant + i * 3) % 10, yy, 1, 3);
        }
      } else {
        for (let j = 0; j < 10; j++) {
          const a = Math.floor(hash(j, variant, 8) * T),
            b = Math.floor(hash(variant, j, 5) * T);
          const len = 1 + Math.floor(hash(j, variant, 9) * (dirt ? 3 : 6));
          rect(c, colors[1 + j % 3], a, b, len, 1);
          if (j % 3 === 0) rect(c, colors[1], a + 1, b + 1, len - 1, 1);
        }
        if (!dirt) {
          const yy = 2 + variant % 7;
          line(c, colors[4], 0, yy, 3, yy - 1);
          line(c, colors[4], 3, yy - 1, 7, yy - 1);
          rect(c, colors[2], 3, yy, 3, 1);
        }
        if (type === ORE) {
          for (const [a, b, k] of [[2, 6, 3], [6, 3, 4], [8, 8, 2]]) {
            const ox = (a + variant % 3) % 10;
            poly(c, '#376a66', [[ox - 1, b + 2], [ox, b - k + 1], [ox + 2, b - k], [ox + 4, b - k + 1], [ox + 3, b + 1], [ox + 1, b + 2]]);
            poly(c, '#67b7a7', [[ox, b + 1], [ox + 1, b - k + 1], [ox + 3, b - k], [ox + 2, b]]);
            rect(c, '#bce9c3', ox + 1, b - k + 1, 2, 1);
          }
        }
      }
      atlas.set(key, c.canvas);
      return c.canvas;
    }
    function actor(c, x, y, dir, walk, swing, scarf = '#d78c54', t = 0, held = 'pick') {
      c.save();
      c.translate(Math.round(x + PLAYER_W / 2), Math.round(y));
      c.scale(dir, 1);
      const r = (color, a, b, w, h) => rect(c, color, a, b, w, h);
      const bob = walk ? Math.round(Math.sin(t * 12) * .7) : 0;
      const step = walk ? Math.round(Math.sin(t * 12) * 2) : 0;
      r('#252e2c', -4, 15 + step, 3, 4 - step);
      r('#252e2c', 1, 15 - step, 3, 4 + step);
      r('#6c5a44', -4, 16 + step, 3, 2);
      r('#886747', 1, 16 - step, 3, 2);
      r('#3a4237', -4, 18, 4, 1);
      r('#474c3b', 1, 18, 4, 1);
      c.translate(0, bob);
      r('#3f3b30', -6, 8, 4, 7);
      r('#956b47', -6, 8, 3, 5);
      r('#c89b60', -6, 9, 3, 1);
      r('#273e3e', -3, 7, 7, 10);
      r('#52827a', -3, 8, 6, 6);
      r('#64928a', -3, 8, 2, 4);
      r('#365b57', 1, 10, 2, 5);
      r('#7ca296', -1, 13, 1, 1);
      r('#6c533a', -3, 14, 7, 2);
      r('#d7b16b', 0, 14, 2, 1);
      r('#9b6648', -2, 2, 7, 6);
      r('#e0a772', 0, 3, 5, 4);
      r('#f5c18b', 2, 3, 3, 2);
      r('#322f2c', 3, 4, 1, 1);
      r('#473b30', -4, 0, 8, 4);
      r('#bd854b', -3, -1, 6, 4);
      r('#e2ae5f', -2, -1, 5, 2);
      r('#684f3b', -4, 2, 10, 2);
      r('#e0aa5e', -4, 2, 9, 1);
      r('#ffe3a0', 3, 0, 2, 2);
      r(scarf, -3, 7, 7, 2);
      r(scarf, -5, 9, 3, 1);
      const hand = swing > 0 ? -1 : 0;
      r('#416a62', 2, 9 + hand, 3, 3);
      r('#e2ad79', 3, 11 + hand, 3, 2);
      c.save();
      c.translate(5, 12 + hand);
      c.rotate(swing > 0 ? -.65 + Math.sin((1 - swing) * Math.PI) * 1.45 : 0.08);
      if (held === 'pick' || held === 'upgrade') {
        line(c, '#ad8052', 0, 2, 4, -4);
        line(c, held === 'upgrade' ? '#8ad1bb' : '#7c9d98', 1, -5, 4, -5);
        line(c, '#d3d2ad', 4, -5, 7, -3);
      } else if (held === 'torch') {
        torchArt(c, -4, -9, t);
      } else {
        const size = held === 'blade' ? 12 : 7;
        c.drawImage(iconSprite(held), -1, 2 - size, size, size);
      }
      c.restore();
      c.restore();
    }
    function slime(c, m, t) {
      const x = Math.round(m.x),
        y = Math.round(m.y),
        s = m.grounded ? Math.round((Math.sin(t * 4 + m.phase) + 1) * .55) : 0;
      poly(c, '#213933', [[x, y + 8], [x + 1, y + 4 + s], [x + 4, y + 1 + s], [x + 9, y + s], [x + 13, y + 3 + s], [x + 15, y + 7], [x + 14, y + 10], [x + 2, y + 10]]);
      poly(c, '#497964', [[x + 1, y + 7], [x + 3, y + 3 + s], [x + 7, y + 2 + s], [x + 11, y + 3 + s], [x + 13, y + 7], [x + 11, y + 8], [x + 4, y + 8]]);
      rect(c, '#71a489', x + 4, y + 3 + s, 4, 1);
      rect(c, '#b2d6a1', x + 5, y + 3 + s, 2, 1);
      const f = m.dir > 0 ? 3 : 0;
      rect(c, '#eed18d', x + 4 + f, y + 5 + s, 2, 1);
      rect(c, '#eed18d', x + 8 + f, y + 5 + s, 2, 1);
    }
    const view = root.querySelector('#rb-view'),
      ctx = view.getContext('2d', {
        alpha: false
      });
    const cam = {
        x: 0,
        y: 0
      },
      mouse = {
        sx: 0,
        sy: 0,
        known: false,
        down: false,
        touch: false
      };
    let vw = 0,
      vh = 0,
      lightMask,
      clockIcon = '',
      lastHp = -1;
    const mod = (x, n) => (x % n + n) % n;
    const landscape = new Map();
    function follow(dt = 1) {
      const p = game.hero;
      const x = clamp(p.x + p.w / 2 - vw * .5, 0, Math.max(0, COLS * T - vw));
      const y = clamp(p.y + p.h - vh * .62, -4 * T, Math.max(0, ROWS * T - vh));
      const s = dt >= 1 ? 1 : 1 - Math.exp(-10 * dt);
      cam.x = mix(cam.x, x, s);
      cam.y = mix(cam.y, y, s);
    }
    function resizeView() {
      const b = view.getBoundingClientRect();
      if (b.width < 1 || b.height < 1) return;
      const scale = b.height < 260 ? 1.55 : 2;
      const w = Math.max(1, Math.round(b.width / scale)),
        h = Math.max(1, Math.round(b.height / scale));
      if (w === vw && h === vh) return;
      vw = view.width = w;
      vh = view.height = h;
      ctx.imageSmoothingEnabled = false;
      lightMask = surface(w, h);
      landscape.clear();
      follow();
    }
    function blendRGB(a, b, f) {
      return 'rgb(' + a.map((v, i) => Math.round(mix(v, b[i], f))).join(',') + ')';
    }
    function disk(c, color, x, y, r) {
      for (let j = -r; j <= r; j++) {
        const span = Math.round(Math.sqrt(r * r - j * j));
        rect(c, color, x - span, y + j, span * 2 + 1, 1);
      }
    }
    function glow(c, x, y, r, color) {
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, color.slice(0, 7) + '00');
      c.fillStyle = g;
      c.fillRect(x - r, y - r, r * 2, r * 2);
    }
    function mountains(h, far) {
      const width = 540,
        c = surface(width, h);
      const knots = far ? [[0, .66], [27, .42], [44, .49], [83, .15], [103, .37], [123, .28], [146, .56], [176, .47], [206, .31], [221, .43], [261, .11], [286, .39], [305, .32], [345, .67], [366, .48], [400, .6], [441, .28], [467, .42], [486, .34], [520, .57], [540, .66]] : [[0, .85], [25, .68], [43, .77], [70, .51], [85, .55], [119, .20], [137, .40], [147, .35], [171, .57], [192, .68], [216, .43], [233, .49], [267, .72], [294, .55], [312, .61], [343, .27], [358, .38], [374, .20], [391, .45], [409, .52], [429, .68], [446, .57], [473, .72], [500, .51], [529, .8], [540, .85]];
      const ridge = [];
      for (let i = 0; i < knots.length - 1; i++) {
        const [x, a] = knots[i],
          [end, b] = knots[i + 1],
          steps = Math.ceil((end - x) / 4);
        for (let j = 0; j < steps; j++) {
          const f = j / steps;
          ridge.push([mix(x, end, f), h * mix(a, b, f) + (j === 0 ? 0 : (hash(i, j, far ? 5 : 7) - .5) * 3)]);
        }
      }
      ridge.push([width, knots.at(-1)[1] * h]);
      poly(c, far ? '#aa9da2' : '#788695', [...ridge, [width, h], [0, h]]);
      c.save();
      c.clip();
      for (let i = 1; i < knots.length - 1; i++) {
        const [x, k] = knots[i],
          [prev, pk] = knots[i - 1],
          [next, nk] = knots[i + 1];
        if (k >= pk || k >= nk) continue;
        const top = k * h,
          left = prev,
          right = next,
          bottom = Math.min(h, top + h * .5);
        poly(c, far ? '#93939e' : '#5c7082', [[x, top], [right, nk * h], [right + 14, bottom], [x + 11, bottom - 6], [x + 7, top + 15], [x + 5, top + 14]]);
        poly(c, far ? '#c4afa8' : '#929e9f', [[x, top], [x + 3, top + 11], [x - 4, top + 17], [x - 3, top + 24], [left + 4, bottom - 6], [left + 9, top + 16]]);
        for (let j = 0; j < 5; j++) {
          const yy = top + 12 + hash(i, j, 64) * Math.max(8, bottom - top - 15),
            xx = x - 1 - (yy - top) * .36 + hash(i, j, 73) * 9;
          line(c, far ? '#b4a5a3' : '#85929a', xx, yy, xx - 3, yy + 5);
          line(c, far ? '#aaa0a1' : '#7d8e98', xx - 3, yy + 5, xx - 3, yy + 8);
        }
        if (k < (far ? .4 : .54)) {
          const d = far ? 14 : Math.max(13, h * .14);
          poly(c, far ? '#e0c7b7' : '#e4cdb0', [[x, top], [x + 9, top + 12], [x + 6, top + 9], [x + 6, top + 13], [x + 2, top + 7], [x - 3, top + 13], [x - 5, top + 12], [x - 14, top + d + 3], [x - 9, top + 10]]);
          poly(c, far ? '#c9b5ad' : '#b8b6ae', [[x + 1, top + 1], [x + 14, top + 16], [x + 9, top + 11], [x + 10, top + 17], [x + 5, top + 10]]);
          for (let j = 0; j < 5; j++) {
            const ex = x - 5 - j * 2,
              yy = top + 9 + j * 3;
            line(c, far ? '#bcafa4' : '#a5a094', ex, yy, ex - 3 - Math.floor(hash(i, j, 3) * 4), yy + 4);
          }
        }
      }
      c.restore();
      return c.canvas;
    }
    function forest(h, near) {
      const width = 400,
        c = surface(width, h),
        low = h * .94;
      const silhouette = near ? '#3d605a' : '#6b817d',
        highlight = near ? '#537567' : '#81938a';
      const ground = x => low + Math.sin(x / width * Math.PI * 2 + .4) * h * .045 + Math.cos(x / width * Math.PI * 4) * h * .025;
      const pts = [];
      for (let x = 0; x <= width; x += 5) pts.push([x, ground(x) - 3]);
      poly(c, silhouette, [...pts, [width, h], [0, h]]);
      for (let i = -2; i < 83; i++) {
        const id = mod(i, 80),
          x = i * 5 + Math.floor(hash(id, 1, near ? 55 : 52) * 3);
        const bottom = ground(mod(x, width)) + 3,
          size = (near ? 11 : 6) + hash(id, 3, near ? 42 : 45) * (near ? 22 : 15),
          w = size * .20;
        rect(c, silhouette, x - 1, bottom - size * .4, 2, size * .5);
        for (let z = 0; z < 3; z++) {
          const top = bottom - size + z * size * .17,
            by = top + size * (.43 + z * .055),
            rad = w * (.46 + z * .28);
          poly(c, silhouette, [[x, top], [x + rad * .5, by - 2], [x + rad + 1, by], [x + rad * .4, by], [x + rad * .2, by + 2], [x - rad * .55, by], [x - rad, by + 1]]);
        }
        if (id % 4 === 0) line(c, highlight, x - 1, bottom - size + 3, x - 3, bottom - size + 8);
      }
      return c.canvas;
    }
    function strip(sprite, speed, y) {
      const start = -mod(Math.floor(cam.x * speed), sprite.width);
      for (let x = start; x < vw; x += sprite.width) ctx.drawImage(sprite, x, Math.round(y));
    }
    function sky(t, hour, daylight) {
      const sunrise = clamp(1 - Math.min(Math.abs(hour - 7), Math.abs(hour - 18)) / 4, 0, 1);
      const g = ctx.createLinearGradient(0, 0, 0, vh * .85);
      g.addColorStop(0, blendRGB([34, 43, 63], [132 + 23 * sunrise, 171 - 3 * sunrise, 191 - 13 * sunrise], daylight));
      g.addColorStop(.55, blendRGB([65, 70, 85], [223 + 18 * sunrise, 210 - 17 * sunrise, 174 - 21 * sunrise], daylight));
      g.addColorStop(1, blendRGB([86, 83, 89], [244, 214, 165], daylight));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, vw, vh);
      if (daylight < .85) {
        ctx.globalAlpha = 1 - daylight;
        for (let i = 0; i < 75; i++) {
          const x = mod(hash(i, 4, 1) * 780 - cam.x * .04, vw),
            y = hash(i, 4, 2) * vh * .52;
          rect(ctx, i % 6 ? '#a7baba' : '#f5dfae', x, y, i % 7 ? 1 : 2, 1);
        }
        ctx.globalAlpha = 1;
      }
      const night = hour < 5.5 || hour > 19.7;
      const phase = night ? mod(hour - 19.7, 24) / 9.8 : clamp((hour - 5.5) / 14.2, 0, 1);
      const sx = Math.round(vw * (.81 - .64 * phase)),
        sy = Math.round(vh * (.21 - .13 * Math.sin(phase * Math.PI)));
      const radius = clamp(Math.round(vh * .061), 8, 17);
      glow(ctx, sx, sy, radius * 2.9, night ? '#b7cfcd44' : '#ffdc9e80');
      disk(ctx, night ? '#e7dfbd' : '#ffdfa7', sx, sy, radius);
      if (night) {
        disk(ctx, '#445266', sx + radius * .45, sy - radius * .22, radius - 2);
      } else {
        rect(ctx, '#f6c995', sx - radius * .85, sy + radius * .58, radius * 1.55, 1);
        rect(ctx, '#f6c995', sx - radius * .73, sy + radius * .76, radius, 1);
      }
      ctx.globalAlpha = .54 * daylight + .12;
      for (let i = 0; i < 14; i++) {
        const x = mod(i * 61 + hash(i, 1) * 38 - cam.x * .08 + t * .36, vw + 90) - 55,
          y = 6 + hash(i, 37) * vh * .27;
        const w = 11 + hash(i, 35) * 37;
        rect(ctx, '#edd2b9', x, y, w, 2);
        rect(ctx, '#f4dcc0', x + w * .22, y - 2, w * .53, 2);
        rect(ctx, '#f5dcc0', x + w * .6, y + 2, w * .58, 1);
      }
      ctx.globalAlpha = 1;
      const bh = Math.max(80, Math.round(vh * .65)),
        shift = clamp((cam.y - (heights[HOME_X] * T - vh * .62)) * .17, -35, 38);
      if (!landscape.size) {
        landscape.set('far', mountains(bh, true));
        landscape.set('mid', mountains(bh, false));
        landscape.set('woods', forest(bh, false));
        landscape.set('near', forest(bh, true));
      }
      strip(landscape.get('far'), .11, -shift + 6);
      strip(landscape.get('mid'), .21, -shift + 14);
      strip(landscape.get('woods'), .34, -shift - 6);
      strip(landscape.get('near'), .49, -shift + 1);
      rect(ctx, '#3d605a', 0, bh - shift + 1, vw, vh);
      if (daylight > .55) {
        for (let i = 0; i < 4; i++) {
          const x = mod(vw * .31 + i * 6 + t * 1.1 - cam.x * .025, vw + 45) - 10,
            y = vh * .18 + Math.sin(i * 2.4 + t * .2) * 3 + i;
          rect(ctx, '#696d67', x, y, 1, 1);
          rect(ctx, '#696d67', x + 1, y + 1, 1, 1);
          rect(ctx, '#696d67', x + 2, y, 1, 1);
        }
      }
    }
    function grass(x, y) {
      const px = x * T,
        py = y * T;
      rect(ctx, '#536244', px, py, T, 3);
      rect(ctx, '#809759', px, py, T, 2);
      rect(ctx, '#b8b877', px, py, T, 1);
      for (let j = 0; j < 5; j++) {
        const dx = Math.floor(hash(x, j, 5) * T),
          tall = 1 + Math.floor(hash(x, j, 12) * 4);
        line(ctx, j % 2 ? '#778c50' : '#8d9e5f', px + dx, py, px + dx + (j % 3 - 1), py - tall);
        if (j < 2) rect(ctx, '#647848', px + dx, py + 2, 2, 1 + Math.floor(hash(x, j, 6) * 2));
        if (j === 0 && hash(x, 2, 5) > .38) {
          line(ctx, '#725239', px + dx, py + 3, px + dx + 1, py + 6);
          line(ctx, '#a47e50', px + dx + 1, py + 6, px + dx - 1, py + 9);
        }
      }
      const n = hash(x, y, 45);
      if (n > .78) {
        const dx = px + 3 + Math.floor(n * 5),
          h = n > .9 ? 4 : 3;
        rect(ctx, '#597448', dx, py - h, 1, h);
        rect(ctx, n > .9 ? '#e0ad65' : '#d1c58d', dx - 1, py - h - 1, 3, 1);
        rect(ctx, '#ebc67b', dx, py - h - 2, 1, 1);
      } else if (n < .17) {
        poly(ctx, '#7c8270', [[px + 2, py], [px + 3, py - 3], [px + 6, py - 3], [px + 8, py]]);
        rect(ctx, '#aaa68a', px + 3, py - 3, 3, 1);
      }
    }
    function torchArt(c, x, y, t) {
      rect(c, '#654f38', x + 5, y + 5, 2, 7);
      rect(c, '#ba9158', x + 6, y + 5, 1, 6);
      const flick = Math.sin(t * 13 + x) > .25 ? 1 : 0;
      rect(c, '#d78246', x + 4, y + 2, 4, 4);
      rect(c, '#f6b454', x + 5, y + flick, 2, 5);
      rect(c, '#ffe3a4', x + 5, y + 3, 1, 2);
    }
    function ground(t) {
      const left = Math.max(0, Math.floor(cam.x / T) - 3),
        right = Math.min(COLS - 1, Math.ceil((cam.x + vw) / T) + 3);
      const top = Math.max(0, Math.floor(cam.y / T) - 1),
        bottom = Math.min(ROWS - 1, Math.ceil((cam.y + vh) / T) + 1);
      const lights = [],
        trees = [];
      for (let x = left; x <= right; x++) {
        for (let y = top; y <= bottom; y++) {
          const type = tileAt(game, x, y),
            px = x * T,
            py = y * T,
            depth = y - heights[x];
          if (depth >= 0 && !solid(type)) {
            const a = hash(x, y, 25);
            rect(ctx, depth < 3 ? '#514636' : depth < 7 ? '#38403a' : '#2e3935', px, py, T, T);
            if (a > .35) {
              rect(ctx, depth < 3 ? '#584c3a' : '#414940', px + 2, py + 3, 3 + a * 4, 1);
              rect(ctx, '#354037', px + 6, py + 8, 3, 1);
            }
          }
          if (solid(type)) {
            ctx.drawImage(tileSprite(type, x, y), px, py);
            const above = tileAt(game, x, y - 1);
            if (!solid(above)) {
              if (type === DIRT && depth <= 1) grass(x, y);else {
                rect(ctx, type === LOG ? '#c19767' : type === DIRT ? '#967351' : '#899080', px, py, T, 1);
                if (type === ORE) lights.push({
                  x: px + 6,
                  y: py,
                  r: 14,
                  gem: true
                });
              }
            }
            if (!solid(tileAt(game, x - 1, y))) rect(ctx, '#b3a08655', px, py + 1, 1, T - 1);
            if (!solid(tileAt(game, x + 1, y))) rect(ctx, '#23372e75', px + T - 1, py + 1, 1, T - 1);
            if (!solid(tileAt(game, x, y + 1))) rect(ctx, '#2d352b95', px, py + T - 2, T, 2);
          } else if (type === TORCH) {
            torchArt(ctx, px, py, t);
            lights.push({
              x: px + 6,
              y: py + 4,
              r: 44,
              gem: false
            });
          } else if (type === TREE) trees.push([x, y]);
        }
        const baseRow = heights[x] - 1;
        if (baseRow > bottom && baseRow * T < crownSize(x) + cam.y + vh && tileAt(game, x, baseRow) === TREE) trees.push([x, baseRow]);
      }
      for (const [x, y] of trees) {
        const img = treeSprite(x);
        ctx.drawImage(img, Math.round((x + .5) * T - img.width / 2), (y + 1) * T - img.height + 1);
      }
      return lights;
    }
    function eraseLight(c, x, y, r, strength) {
      const glow = c.createRadialGradient(x, y, 1, x, y, r);
      glow.addColorStop(0, 'rgba(0,0,0,' + strength + ')');
      glow.addColorStop(.4, 'rgba(0,0,0,' + strength * .8 + ')');
      glow.addColorStop(1, 'transparent');
      c.fillStyle = glow;
      c.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    function lighting(lights, daylight) {
      const ox = Math.round(cam.x),
        oy = Math.round(cam.y);
      const c = lightMask;
      c.clearRect(0, 0, vw, vh);
      c.fillStyle = 'rgba(18,26,47,' + (1 - daylight) * .64 + ')';
      c.fillRect(0, 0, vw, vh);
      const surfaceY = (heights[clamp(Math.floor(game.hero.x / T), 0, COLS - 1)] + 1) * T - oy;
      const g = c.createLinearGradient(0, surfaceY - 3, 0, surfaceY + T * 11);
      g.addColorStop(0, 'transparent');
      g.addColorStop(.5, 'rgba(15,24,27,.23)');
      g.addColorStop(1, 'rgba(12,22,27,.76)');
      c.fillStyle = g;
      c.fillRect(0, 0, vw, vh);
      c.globalCompositeOperation = 'destination-out';
      const carriedTorch = SLOT_KEYS[game.slot] === 'torch' && game.bag.torch > 0;
      eraseLight(c, game.hero.x + 5 - ox, game.hero.y + 5 - oy, carriedTorch ? 50 : 31, .91);
      for (const light of lights) eraseLight(c, light.x - ox, light.y - oy, light.r, light.gem ? .6 : 1);
      c.globalCompositeOperation = 'source-over';
      ctx.drawImage(c.canvas, 0, 0);
      for (const light of lights) glow(ctx, light.x - ox, light.y - oy, light.gem ? 12 : 25, light.gem ? '#83dfbc23' : '#ffd07c50');
      if (carriedTorch) glow(ctx, game.hero.x + 5 - ox, game.hero.y + 5 - oy, 20, '#ffc16a38');
    }
    function hud() {
      const p = game.hero,
        cl = clockAt(game),
        hour = cl.hour | 0,
        min = Math.floor((cl.hour - hour) * 60 / 5) * 5;
      const clock = 'Dzień ' + cl.day + ' · ' + String(hour).padStart(2, '0') + ':' + String(min).padStart(2, '0');
      const label = root.querySelector('#rb-time');
      if (label.textContent !== clock) label.textContent = clock;
      const icon = hour >= 6 && hour < 19 ? 'sun' : 'moon';
      if (icon !== clockIcon) {
        clockIcon = icon;
        const bar = root.querySelector('.rb-time');
        bar.querySelector('canvas').dataset.icon = icon;
        paintIcons(bar);
      }
      if (p.hp === lastHp) return;
      lastHp = p.hp;
      const hearts = root.querySelector('#rb-hearts').getContext('2d');
      hearts.clearRect(0, 0, 59, 9);
      const rows = ['0110110', '1111111', '1111111', '1111111', '0111110', '0011100', '0001000'];
      for (let i = 0; i < 5; i++) {
        const fill = clamp((p.hp - i * 20) / 20, 0, 1) * 7;
        rows.forEach((row, y) => {
          [...row].forEach((v, x) => {
            if (v === '1') rect(hearts, x < fill ? y < 2 ? '#f4ae88' : y > 4 ? '#bf6a58' : '#e1886d' : '#526156', i * 12 + x + 2, y + 1, 1, 1);
          });
        });
      }
      root.querySelector('#rb-hp').textContent = p.hp + ' / 100';
      root.querySelector('.rb-health').setAttribute('aria-label', 'Zdrowie ' + p.hp + ' na 100');
    }
    function render(t) {
      const {
          hour
        } = clockAt(game),
        daylight = sunlight(hour),
        p = game.hero,
        ox = Math.round(cam.x),
        oy = Math.round(cam.y);
      sky(t, hour, daylight);
      ctx.save();
      ctx.translate(-ox, -oy);
      const lights = ground(t);
      for (const m of game.mobs) slime(ctx, m, t);
      drawPeers(ctx, t);
      if (game.hurt <= 0 || Math.floor(game.hurt * 12) % 2 === 0) {
        let held = game.swing > 0 && game.swingTool ? game.swingTool : SLOT_KEYS[game.slot];
        if (held === 'pick' && game.bag.upgrade) held = 'upgrade';
        if (held !== 'pick' && held !== 'upgrade' && !game.bag[held]) held = 'pick';
        actor(ctx, p.x, p.y, p.dir, Math.abs(p.vx) > 1 && p.grounded, game.swing / .26, '#d78c54', t, held);
      }
      for (const a of game.particles) {
        ctx.globalAlpha = Math.min(1, a.life * 4);
        rect(ctx, a.color, a.x, a.y, 2, 2);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      lighting(lights, daylight);
      drawAim();
      if (game.flash > 0) {
        ctx.fillStyle = 'rgba(198,88,63,' + game.flash * .32 + ')';
        ctx.fillRect(0, 0, vw, vh);
      }
      hud();
    }
    const keys = new Set();
    const pendingProfiles = new Map();
    let panel = '',
      mine = null,
      lastBuild = 'dirt',
      toastTimer,
      audioEngine;
    let soundOn = false;
    try {
      soundOn = localStorage.getItem('rudobor.v1.audio') === 'on';
    } catch {}
    function toast(message) {
      const el = root.querySelector('#rb-toast');
      el.textContent = message;
      el.classList.add('rb-show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => el.classList.remove('rb-show'), 3300);
    }
    function sound(freq = 220, duration = .06, type = 'triangle', end = freq * .6) {
      if (!soundOn) return;
      try {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        audioEngine ??= new Audio();
        if (audioEngine.state === 'suspended') audioEngine.resume().catch(() => {});
        const osc = audioEngine.createOscillator(),
          gain = audioEngine.createGain(),
          now = audioEngine.currentTime;
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(end, now + duration);
        gain.gain.setValueAtTime(.047, now);
        gain.gain.exponentialRampToValueAtTime(.001, now + duration);
        osc.connect(gain);
        gain.connect(audioEngine.destination);
        osc.start(now);
        osc.stop(now + duration + .01);
      } catch {}
    }
    function particles(x, y, color, n = 7) {
      for (let i = 0; i < n; i++) game.particles.push({
        x,
        y,
        vx: (Math.random() - .5) * 55,
        vy: -8 - Math.random() * 40,
        life: .27 + Math.random() * .25,
        color
      });
    }
    function cancelInput() {
      keys.clear();
      mouse.down = false;
      mine = null;
      game.jumpBuffer = 0;
    }
    function switchWorld(world) {
      cancelInput();
      game = world;
      lastBuild = 'dirt';
      lastHp = -1;
      mouse.known = false;
      follow();
      updateBelt();
      hud();
    }
    function selectSlot(index) {
      game.slot = mod(index, SLOT_KEYS.length);
      const item = SLOT_KEYS[game.slot];
      if (BUILD[item]) lastBuild = item;
      mine = null;
      updateBelt();
    }
    function validEdge(x, y) {
      return !solid(tileAt(game, x - 1, y)) || !solid(tileAt(game, x + 1, y)) || !solid(tileAt(game, x, y - 1)) || !solid(tileAt(game, x, y + 1));
    }
    function hasSupport(x, y) {
      return solid(tileAt(game, x - 1, y)) || solid(tileAt(game, x + 1, y)) || solid(tileAt(game, x, y - 1)) || solid(tileAt(game, x, y + 1));
    }
    function target(lookForTree = false) {
      if (!mouse.known) return null;
      const wx = mouse.sx + Math.round(cam.x),
        wy = mouse.sy + Math.round(cam.y);
      let x = Math.floor(wx / T),
        y = Math.floor(wy / T);
      if (!inside(x, y)) return null;
      if (lookForTree && tileAt(game, x, y) === AIR) {
        for (let col = Math.max(0, x - 1); col <= Math.min(COLS - 1, x + 1); col++) {
          const row = heights[col] - 1,
            cy = (row + 1) * T,
            h = crownSize(col),
            dy = cy - wy;
          if (tileAt(game, col, row) === TREE && dy >= 0 && dy <= h && Math.abs(wx - (col + .5) * T) < (dy < h * .27 ? 3.5 : (h - dy) * .20 + 2)) {
            x = col;
            y = row;
            break;
          }
        }
      }
      const p = game.hero,
        dist = Math.hypot((x + .5) * T - (p.x + p.w / 2), (y + .5) * T - (p.y + p.h / 2));
      return {
        x,
        y,
        type: tileAt(game, x, y),
        inRange: dist <= REACH,
        key: idx(x, y)
      };
    }
    function drawAim() {
      if (panel || !mouse.known || mouse.touch && !mouse.down) return;
      const sel = SLOT_KEYS[game.slot],
        a = target(sel === 'pick');
      if (!a) return;
      const x = a.x * T - Math.round(cam.x),
        y = a.y * T - Math.round(cam.y);
      const col = a.inRange ? '#ffe3a2' : '#aaa79b';
      ctx.globalAlpha = a.inRange ? .92 : .55;
      for (const [xx, yy, sx, sy] of [[x, y, 1, 1], [x + T - 1, y, -1, 1], [x, y + T - 1, 1, -1], [x + T - 1, y + T - 1, -1, -1]]) {
        line(ctx, col, xx, yy, xx + sx * 2, yy);
        line(ctx, col, xx, yy, xx, yy + 2 * sy);
      }
      if (mine && mine.key === a.key && mine.progress > 0) {
        const f = clamp(mine.progress / mine.duration, 0, 1);
        line(ctx, '#3c4136', x + 4, y + 2, x + 6, y + 5);
        if (f > .35) line(ctx, '#3c4136', x + 6, y + 5, x + 3, y + 8);
        if (f > .62) line(ctx, '#3c4136', x + 6, y + 5, x + 9, y + 8);
        rect(ctx, '#2b382d', x, y - 4, T, 2);
        rect(ctx, col, x, y - 4, T * f, 1);
      }
      ctx.globalAlpha = 1;
    }
    async function editTile(a, next, applyInventory) {
      const world = game;
      if (world.pending || world.hero.hp <= 0) return;
      world.pending = true;
      if (world.room) pendingProfiles.set(world.key, world);
      try {
        let ok = true;
        if (world.room) ok = await commitOnlineTile(world, a, next);
        if (!ok) return;
        if (!world.room) writeTile(world, a.x, a.y, next);
        applyInventory(world.bag);
        if (world === game) {
          particles((a.x + .5) * T, (a.y + .5) * T, a.type === ORE ? '#8accab' : a.type === TREE ? '#91a467' : next === TORCH ? '#e9ba72' : '#aa9572');
          sound(next === AIR ? 125 : 205, .075);
          updateBelt();
        }
        saveWorld(world);
      } catch (error) {
        if (game === world) toast(networkError(error));
      } finally {
        world.pending = false;
        if (world.room) pendingProfiles.delete(world.key);
        if (world === game && panel === 'pack') drawPack();
      }
    }
    const DROPS = {
      [DIRT]: ['dirt', 1],
      [ROCK]: ['stone', 1],
      [TREE]: ['wood', 5],
      [LOG]: ['wood', 1],
      [TORCH]: ['torch', 1],
      [ORE]: ['gem', 1]
    };
    function dig(dt) {
      if (!mouse.down || game.slot !== 0 || game.pending) {
        mine = null;
        return;
      }
      const a = target(true);
      if (!a || !a.inRange || !DROPS[a.type] || solid(a.type) && !validEdge(a.x, a.y)) {
        mine = null;
        return;
      }
      if (!mine || mine.key !== a.key || mine.type !== a.type) mine = {
        key: a.key,
        type: a.type,
        progress: 0,
        duration: TILE_TIME[a.type] * (game.bag.upgrade ? .52 : 1)
      };
      mine.progress += dt;
      if (game.swing <= .015) {
        game.swing = .26;
        game.swingTool = 'pick';
        sound(94, .035, 'triangle', 67);
      }
      if (mine.progress < mine.duration) return;
      const [item, qty] = DROPS[a.type];
      mine = null;
      void editTile(a, AIR, bag => {
        bag[item] += qty;
      });
    }
    function place() {
      if (game.pending || game.hero.hp <= 0) return;
      const a = target(),
        item = BUILD[SLOT_KEYS[game.slot]] ? SLOT_KEYS[game.slot] : lastBuild;
      if (!a) return;
      if (!a.inRange) {
        toast('Podejdź bliżej wybranego pola.');
        return;
      }
      if (!game.bag[item]) {
        toast('Brak materiału: ' + LABEL[item].toLowerCase() + '.');
        return;
      }
      if (a.type !== AIR) return;
      if (!hasSupport(a.x, a.y)) {
        toast('Postaw obok ziemi, skały albo drewna.');
        return;
      }
      const block = {
          x: a.x * T,
          y: a.y * T,
          w: T,
          h: T
        },
        type = BUILD[item];
      if (solid(type) && (overlaps(game.hero, block) || peerInBox(block) || game.mobs.some(m => overlaps(m, block)))) return;
      game.swing = .26;
      game.swingTool = item;
      void editTile(a, type, bag => {
        bag[item]--;
      });
    }
    function attack() {
      if (game.nextAttack > 0 || game.hero.hp <= 0) return;
      const p = game.hero;
      game.nextAttack = .38;
      game.swing = .26;
      game.swingTool = game.bag.blade ? 'blade' : 'pick';
      sound(178, .09, 'triangle', 63);
      const strength = game.bag.blade ? 3 : 1,
        reach = game.bag.blade ? 34 : 25;
      for (const m of [...game.mobs]) {
        const dx = m.x + m.w / 2 - p.x - p.w / 2,
          dy = m.y + m.h / 2 - p.y - p.h / 2;
        if (dx * p.dir < -6 || Math.abs(dx) > reach || Math.abs(dy) > 22) continue;
        m.hp -= strength;
        m.vy = -55;
        m.shove = p.dir * 75;
        m.delay = .45;
        particles(m.x + 7, m.y + 4, '#9aba8e', 5);
        if (m.hp <= 0) {
          game.mobs.splice(game.mobs.indexOf(m), 1);
          game.bag.gem++;
          updateBelt();
          saveWorld(game);
          toast('Kryształ +1');
        }
      }
    }
    function usePointer(button) {
      if (panel || game.hero.hp <= 0) return;
      const p = game.hero;
      p.dir = mouse.sx + Math.round(cam.x) < p.x + p.w / 2 ? -1 : 1;
      if (button === 2) {
        place();
        return;
      }
      const item = SLOT_KEYS[game.slot];
      if (item === 'blade') {
        if (!game.bag.blade) {
          toast('Ostrze możesz wykonać w plecaku.');
          return;
        }
        attack();
        return;
      }
      if (BUILD[item]) {
        place();
        return;
      }
      const wx = mouse.sx + Math.round(cam.x),
        wy = mouse.sy + Math.round(cam.y);
      if (game.mobs.some(m => wx >= m.x - 2 && wx <= m.x + m.w + 2 && wy >= m.y - 2 && wy <= m.y + m.h + 2)) {
        attack();
        return;
      }
      mouse.down = true;
    }
    function spawnMob() {
      const p = game.hero,
        px = Math.floor((p.x + p.w / 2) / T),
        py = Math.floor((p.y + p.h) / T);
      for (let attempt = 0; attempt < 8; attempt++) {
        const col = clamp(px + (Math.random() < .5 ? -1 : 1) * (7 + Math.floor(Math.random() * 7)), 2, COLS - 3);
        for (let off = 0; off <= 10; off++) {
          const row = py + Math.ceil(off / 2) * (off % 2 ? -1 : 1);
          if (row < 2 || row >= ROWS - 2 || !solid(tileAt(game, col, row))) continue;
          const m = {
            x: col * T,
            y: row * T - 10,
            w: 15,
            h: 10,
            vx: 0,
            vy: 0,
            dir: 1,
            grounded: false,
            delay: .4,
            shove: 0,
            hp: 3,
            phase: Math.random() * 5
          };
          if (!blocksBox(game, m.x, m.y, m.w, m.h)) {
            game.mobs.push(m);
            return;
          }
        }
      }
    }
    function monsters(dt) {
      const p = game.hero,
        col = clamp(Math.floor(p.x / T), 0, COLS - 1),
        hour = clockAt(game).hour;
      const danger = hour >= 19 || hour < 5.5 || p.y / T > heights[col] + 4;
      game.spawnTimer -= dt;
      if (game.spawnTimer <= 0) {
        game.spawnTimer = 5 + Math.random() * 3;
        if (danger && game.mobs.length < 4) spawnMob();
      }
      for (const m of [...game.mobs]) {
        const dx = p.x - m.x;
        if (Math.abs(dx) > T * 32 || !danger && Math.abs(dx) > T * 6) {
          game.mobs.splice(game.mobs.indexOf(m), 1);
          continue;
        }
        m.dir = dx < 0 ? -1 : 1;
        m.delay -= dt;
        if (m.grounded && m.delay <= 0) {
          m.vy = -67 - Math.random() * 21;
          m.delay = .75 + Math.random() * .45;
        }
        m.vx = (m.grounded ? 0 : m.dir * 29) + m.shove;
        m.shove *= Math.exp(-7 * dt);
        const hitWall = moveBody(game, m, dt);
        if (hitWall && m.grounded) {
          m.vy = -90;
          m.delay = .6;
        }
        if (!game.hurt && overlaps(m, p)) {
          p.hp = Math.max(0, p.hp - 15);
          game.hurt = 1.3;
          game.flash = .7;
          p.vy = -53;
          particles(p.x + 4, p.y + 9, '#d78e74', 4);
          sound(88, .17, 'sawtooth', 40);
          if (p.hp === 0) {
            saveWorld(game);
            openPanel('death');
            break;
          }
        }
      }
    }
    function respawn() {
      const p = game.hero;
      Object.assign(p, safeSpawn(game), {
        hp: 100,
        vx: 0,
        vy: 0,
        grounded: false
      });
      game.mobs = [];
      game.spawnTimer = 6;
      game.hurt = 1;
      game.flash = 0;
      saveWorld(game);
      hidePanel();
      follow();
      toast('Powrót na polanę. Ekwipunek jest w plecaku.');
    }
    const RECIPES = [{
      id: 'torch',
      title: '4 pochodnie',
      icon: 'torch',
      cost: {
        wood: 2
      },
      make: b => {
        b.torch += 4;
      }
    }, {
      id: 'blade',
      title: 'Kamienne ostrze',
      icon: 'blade',
      cost: {
        wood: 2,
        stone: 4
      },
      make: b => {
        b.blade = 1;
      }
    }, {
      id: 'upgrade',
      title: 'Kryształowy kilof',
      icon: 'upgrade',
      cost: {
        wood: 2,
        stone: 4,
        gem: 2
      },
      make: b => {
        b.upgrade = 1;
      }
    }, {
      id: 'tonic',
      title: 'Napar leczniczy',
      icon: 'tonic',
      cost: {
        gem: 2
      },
      make: () => {
        game.hero.hp = Math.min(100, game.hero.hp + 40);
      }
    }];
    function canCraft(r) {
      if (game.pending || game.hero.hp <= 0 || (r.id === 'blade' || r.id === 'upgrade') && game.bag[r.id] || r.id === 'tonic' && game.hero.hp === 100) return false;
      return Object.entries(r.cost).every(([k, n]) => game.bag[k] >= n);
    }
    function craft(id) {
      const r = RECIPES.find(a => a.id === id);
      if (!r || !canCraft(r)) return;
      for (const [k, n] of Object.entries(r.cost)) game.bag[k] -= n;
      r.make(game.bag);
      sound(390, .12, 'sine', 570);
      updateBelt();
      hud();
      saveWorld(game);
      drawPack();
      root.querySelector('.rb-msg').textContent = r.id === 'tonic' ? 'Wypito napar. Zdrowie: ' + game.hero.hp + ' / 100.' : 'Wytworzono: ' + r.title + '.';
    }
    function step(dt) {
      if (net?.active) game.time = Math.max(0, (Date.now() + net.offset - game.epoch) / 1000);
      if (panel || document.hidden || game.hero.hp <= 0) return;
      const before = clockAt(game).hour;
      if (!game.room) game.time += dt;
      if (!game.room && before < 6 && clockAt(game).hour >= 6) toast('Świta. Udało ci się przetrwać noc!');
      const p = game.hero;
      const dx = Number(keys.has('right')) - Number(keys.has('left'));
      p.vx = dx * 70;
      if (dx) p.dir = dx;
      game.jumpBuffer = Math.max(0, game.jumpBuffer - dt);
      game.grace = p.grounded ? .105 : Math.max(0, game.grace - dt);
      if (game.jumpBuffer > 0 && game.grace > 0) {
        p.vy = -138;
        p.grounded = false;
        game.grace = 0;
        game.jumpBuffer = 0;
        sound(205, .085, 'sine', 305);
      }
      moveBody(game, p, dt);
      game.swing = Math.max(0, game.swing - dt);
      game.nextAttack = Math.max(0, game.nextAttack - dt);
      game.hurt = Math.max(0, game.hurt - dt);
      game.flash = Math.max(0, game.flash - dt * 3);
      if (keys.has('attack')) attack();
      dig(dt);
      monsters(dt);
      for (let i = game.particles.length - 1; i >= 0; i--) {
        const a = game.particles[i];
        a.life -= dt;
        if (a.life <= 0) {
          game.particles.splice(i, 1);
          continue;
        }
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        a.vy += 135 * dt;
      }
      follow(dt);
    }

    // Pokój współdzieli zmiany terenu, zegar i pozycje obecnych graczy.
    let sdkPromise = null,
      net = null;
    async function firebase() {
      if (!sdkPromise) sdkPromise = (async () => {
        const [{
          initializeApp
        }, sdk] = await Promise.all([import('https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js'), import('https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js')]);
        const app = initializeApp(firebaseConfig);
        const db = sdk.getDatabase(app);
        return {
          sdk,
          db
        };
      })().catch(error => {
        sdkPromise = null;
        throw error;
      });
      return sdkPromise;
    }
    function networkError(error) {
      const msg = String(error?.code || '') + ' ' + String(error?.message || '');
      if (/permission|denied/i.test(msg)) return 'Firebase odrzucił dostęp do pokoju. Sprawdź jego uprawnienia w bazie.';
      if (/timeout/i.test(msg)) return 'Pokój nie odpowiada. Możesz spróbować ponownie lub grać solo.';
      return 'Nie udało się połączyć z pokojem. Sprawdź połączenie i spróbuj ponownie.';
    }
    function setStatus() {
      const el = root.querySelector('#rb-status');
      el.dataset.mode = net?.active ? 'online' : 'solo';
      el.querySelector('span').textContent = net?.active ? 'Online · ' + (net.peers.size + 1) : net ? 'Łączenie…' : 'Solo';
      root.querySelector('#rb-online-label').textContent = net?.active ? 'Pokój online' : 'Graj online';
    }
    function discardRoom(s) {
      if (net !== s) return;
      net = null;
      clearTimeout(s.timer);
      for (const off of s.off.splice(0)) off();
      if (s.published && s.me) s.sdk.remove(s.me).catch(() => {});
      if (s.active) {
        saveWorld(s.world);
        switchWorld(s.soloWorld);
      }
      setStatus();
    }
    function roomFailed(s, error) {
      if (net !== s) return;
      const message = s.active ? 'Utracono połączenie z pokojem. Przywrócono grę solo.' : networkError(error);
      discardRoom(s);
      if (panel === 'network') {
        drawNetwork(message);
      } else {
        hidePanel();
        toast(message);
      }
      if (!game.hero.hp) openPanel('death');
    }
    function readEdits(s, value) {
      const edits = new Map();
      if (value && typeof value === 'object') for (const [key, v] of Object.entries(value)) {
        if (!/^\d{1,3}_\d{1,2}$/.test(key) || !Number.isInteger(v) || v < AIR || v > ORE) continue;
        const [x, y] = key.split('_').map(Number);
        if (!inside(x, y) || y >= ROWS - 2) continue;
        const k = idx(x, y);
        if (v !== base[k]) edits.set(k, v);
      }
      s.world.edits = edits;
      const p = s.world.hero;
      if (s.active && blocksBox(s.world, p.x, p.y, p.w, p.h)) Object.assign(p, safeSpawn(s.world, Math.floor(p.x / T)), {
        vx: 0,
        vy: 0
      });
    }
    const scarfColors = ['#a3bb77', '#e19a65', '#8eb4c6', '#c994a4'];
    function readPeers(s, values) {
      const keep = new Set(),
        now = performance.now();
      if (values && typeof values === 'object') for (const [id, v] of Object.entries(values)) {
        if (id === s.id || !v || !Number.isFinite(v.x) || !Number.isFinite(v.y)) continue;
        if (Number.isFinite(v.at) && Date.now() + s.offset - v.at > 60000) continue;
        keep.add(id);
        const x = clamp(v.x, 0, COLS * T - PLAYER_W),
          y = clamp(v.y, -2 * T, ROWS * T);
        const old = s.peers.get(id),
          f = old ? clamp((now - old.start) / 145, 0, 1) : 1;
        if (old && old.x === x && old.y === y && old.dir === v.dir && old.hp === v.hp && old.name === v.name) continue;
        s.peers.set(id, {
          x,
          y,
          ox: old ? mix(old.ox, old.x, f) : x,
          oy: old ? mix(old.oy, old.y, f) : y,
          start: now,
          moving: !!old && Math.abs(old.x - x) > .35,
          dir: v.dir === -1 ? -1 : 1,
          hp: finite(v.hp, 100, 0, 100),
          name: typeof v.name === 'string' ? v.name.slice(0, 16) : 'Wędrowiec',
          color: scarfColors[id.charCodeAt(id.length - 1) % scarfColors.length]
        });
      }
      for (const id of s.peers.keys()) if (!keep.has(id)) s.peers.delete(id);
      if (s.active) setStatus();
    }
    function peerInBox(box) {
      if (!net?.active) return false;
      for (const p of net.peers.values()) if (p.hp > 0 && overlaps({
        x: p.x,
        y: p.y,
        w: PLAYER_W,
        h: PLAYER_H
      }, box)) return true;
      return false;
    }
    function drawPeers(c, t) {
      if (!net?.active) return;
      for (const p of net.peers.values()) {
        if (p.hp <= 0) continue;
        const elapsed = performance.now() - p.start,
          f = clamp(elapsed / 145, 0, 1),
          x = mix(p.ox, p.x, f),
          y = mix(p.oy, p.y, f);
        if (x < cam.x - 25 || x > cam.x + vw + 25 || y < cam.y - 30 || y > cam.y + vh) continue;
        actor(c, x, y, p.dir, p.moving && elapsed < 210, 0, p.color, t);
        c.font = '7px monospace';
        c.textAlign = 'center';
        const w = Math.ceil(c.measureText(p.name).width) + 4;
        rect(c, '#223931e8', x + 4 - w / 2, y - 12, w, 9);
        c.fillStyle = '#f5e6bc';
        c.fillText(p.name, Math.round(x + 4), Math.round(y - 5));
      }
    }
    function playerData(s) {
      const p = s.world.hero;
      return {
        name: s.world.nick,
        x: Math.round(p.x * 10) / 10,
        y: Math.round(p.y * 10) / 10,
        dir: p.dir,
        hp: p.hp,
        at: s.sdk.serverTimestamp()
      };
    }
    function publishPosition() {
      const s = net;
      if (!s?.active || s.writing) return;
      const t = performance.now();
      if (t - s.lastSent < 145) return;
      const data = playerData(s),
        signature = [data.x, data.y, data.dir, data.hp].join('/');
      if (signature === s.signature && t - s.lastSent < 12000) return;
      s.lastSent = t;
      s.signature = signature;
      s.writing = true;
      s.sdk.set(s.me, data).catch(e => roomFailed(s, e)).finally(() => {
        s.writing = false;
      });
    }
    function subscribe(s, path, consume) {
      return new Promise((resolve, reject) => {
        const off = s.sdk.onValue(path, snapshot => {
          if (net !== s) return;
          consume(snapshot.val());
          resolve();
        }, error => {
          reject(error);
          roomFailed(s, error);
        });
        s.off.push(() => {
          off();
          reject(new Error('CANCELLED'));
        });
      });
    }
    async function readEpoch(s) {
      const {
          sdk,
          db
        } = s,
        r = sdk.ref(db, s.path + '/epoch'),
        snapshot = await sdk.get(r);
      if (Number.isFinite(snapshot.val()) && snapshot.val() > 0) return snapshot.val();
      if (net !== s) throw new Error('CANCELLED');
      const result = await sdk.runTransaction(r, v => Number.isFinite(v) && v > 0 ? v : sdk.serverTimestamp(), {
        applyLocally: false
      });
      const epoch = result.snapshot.val();
      if (!Number.isFinite(epoch) || epoch <= 0) throw new Error('CLOCK');
      return epoch;
    }
    async function enterConnected(s) {
      if (s.starting || s.active || net !== s) return;
      s.starting = true;
      try {
        const {
            sdk,
            db
          } = s,
          players = sdk.ref(db, s.path + '/players');
        s.me = sdk.push(players);
        s.id = s.me.key;
        s.tiles = sdk.ref(db, s.path + '/tiles');
        const [epoch] = await Promise.all([readEpoch(s), subscribe(s, s.tiles, v => readEdits(s, v)), subscribe(s, players, v => readPeers(s, v)), subscribe(s, sdk.ref(db, '.info/serverTimeOffset'), v => {
          s.offset = Number.isFinite(v) ? v : 0;
        })]);
        if (net !== s) return;
        s.world.epoch = epoch;
        s.world.time = Math.max(0, (Date.now() + s.offset - epoch) / 1000);
        const p = s.world.hero;
        if (blocksBox(s.world, p.x, p.y, p.w, p.h)) Object.assign(p, safeSpawn(s.world));
        await sdk.onDisconnect(s.me).remove();
        if (net !== s) return;
        s.published = true;
        await sdk.set(s.me, playerData(s));
        if (net !== s) {
          sdk.remove(s.me).catch(() => {});
          return;
        }
        clearTimeout(s.timer);
        s.soloWorld = game;
        saveWorld(game);
        s.active = true;
        switchWorld(s.world);
        setStatus();
        hidePanel();
        toast('Dołączono do pokoju „' + s.room + '”.');
        if (!s.world.hero.hp) openPanel('death');
      } catch (e) {
        roomFailed(s, e);
      }
    }
    async function joinRoom(room, nick) {
      if (net) return;
      const saved = loadWorld(room, nick);
      const s = {
        room,
        world: pendingProfiles.get(saved.key) ?? saved,
        path: 'rudobor/v1/rooms/' + room,
        off: [],
        peers: new Map(),
        offset: 0,
        active: false,
        starting: false,
        published: false,
        lastSent: 0,
        signature: '',
        writing: false
      };
      net = s;
      setStatus();
      drawNetwork();
      try {
        localStorage.setItem('rudobor.v1.identity', JSON.stringify({
          room,
          nick
        }));
      } catch {}
      s.timer = setTimeout(() => roomFailed(s, new Error('TIMEOUT')), 12000);
      try {
        Object.assign(s, await firebase());
        if (net !== s) return;
        const {
          sdk,
          db
        } = s;
        const off = sdk.onValue(sdk.ref(db, '.info/connected'), snap => {
          if (net !== s) return;
          if (snap.val() === true) {
            void enterConnected(s);
          } else if (s.starting || s.active) roomFailed(s, new Error('DISCONNECTED'));
        }, e => roomFailed(s, e));
        s.off.push(off);
      } catch (e) {
        roomFailed(s, e);
      }
    }
    async function commitOnlineTile(world, a, next) {
      const s = net;
      if (!s?.active || s.world !== world) return false;
      const {
          sdk,
          db
        } = s,
        r = sdk.ref(db, s.path + '/tiles/' + a.x + '_' + a.y),
        original = base[idx(a.x, a.y)];
      const result = await sdk.runTransaction(r, current => {
        if ((current ?? original) !== a.type) return;
        return next === original ? null : next;
      }, {
        applyLocally: false
      });
      return result.committed;
    }
    const dialog = root.querySelector('#rb-dialog'),
      body = dialog.querySelector('#rb-dialog-body');
    const title = dialog.querySelector('#rb-dialog-title'),
      slotBar = root.querySelector('#rb-slots');
    function iconTag(name) {
      return '<canvas data-icon="' + name + '" aria-hidden="true"></canvas>';
    }
    for (const [i, item] of SLOT_KEYS.entries()) {
      const button = document.createElement('button');
      button.className = 'rb-slot';
      button.dataset.slot = String(i);
      button.innerHTML = '<i aria-hidden="true">' + (i + 1) + '</i>' + iconTag(item) + '<b></b>';
      slotBar.append(button);
    }
    function updateBelt() {
      const item = SLOT_KEYS[game.slot];
      const name = k => k === 'pick' && game.bag.upgrade ? 'Kryształowy kilof' : LABEL[k];
      root.querySelector('#rb-gear').textContent = name(item);
      Array.from(slotBar.children).forEach((btn, i) => {
        const key = SLOT_KEYS[i],
          count = key === 'pick' ? 1 : game.bag[key],
          usable = count > 0;
        btn.setAttribute('aria-pressed', String(i === game.slot));
        btn.dataset.empty = String(!usable);
        btn.title = i + 1 + ' · ' + name(key) + (key === 'blade' && !usable ? ' (wytwórz w plecaku)' : '');
        btn.setAttribute('aria-label', btn.title + (i >= 2 ? ', sztuk ' + count : ''));
        btn.querySelector('canvas').dataset.icon = key === 'pick' && game.bag.upgrade ? 'upgrade' : key;
        btn.querySelector('b').textContent = i >= 2 ? String(count) : '';
      });
      paintIcons(slotBar);
    }
    function drawPack() {
      title.textContent = 'Plecak';
      const mats = ['dirt', 'wood', 'stone', 'gem', 'torch'].map(k => '<span>' + iconTag(k) + LABEL[k] + ' ×' + game.bag[k] + '</span>').join('');
      const recipes = RECIPES.map(r => {
        const done = (r.id === 'upgrade' || r.id === 'blade') && game.bag[r.id];
        const cost = Object.entries(r.cost).map(([k, n]) => LABEL[k] + ' ×' + n).join(' · ');
        const desc = r.id === 'tonic' ? ' · +40 zdrowia' : r.id === 'upgrade' ? ' · szybsze kopanie' : '';
        return '<div class="rb-recipe">' + iconTag(r.icon) + '<div><strong>' + r.title + '</strong><small>' + cost + desc + '</small></div><button data-craft="' + r.id + '" ' + (canCraft(r) ? '' : 'disabled') + '>' + (done ? 'Gotowe' : r.id === 'tonic' ? 'Wypij' : 'Wytwórz') + '</button></div>';
      }).join('');
      body.innerHTML = '<div class="rb-mats">' + mats + '</div><h3>Wytwarzanie</h3>' + recipes + '<p class="rb-msg" aria-live="polite"></p>';
      paintIcons(body);
    }
    function drawNetwork(msg = '') {
      title.textContent = net?.active ? 'Pokój online' : 'Graj online';
      if (net?.active) {
        body.innerHTML = '<p>Przekaż znajomemu kod pokoju. Po wpisaniu go w grze dołączy do tego samego świata.</p><label>Kod pokoju<input readonly id="rb-roomcode"></label><button data-action="close" class="rb-primary rb-wide">Wróć do gry</button><button data-action="leave" class="rb-wide">Opuść pokój i wróć do solo</button>';
        body.querySelector('input').value = net.room;
        return;
      }
      if (net) {
        body.innerHTML = '<p role="status">Łączenie z pokojem…</p><button class="rb-wide" data-action="close">Anuluj</button>';
        return;
      }
      body.innerHTML = '<p>Wpiszcie ten sam kod na obu urządzeniach. Teren, pora dnia i pozycje graczy są wspólne. Każdy gracz ma własny ekwipunek i przeciwników.</p><form id="rb-join"><label>Nazwa gracza<input name="nick" required minlength="1" maxlength="16" autocomplete="off" placeholder="Wędrowiec"></label><label>Kod pokoju<input name="room" required minlength="1" maxlength="24" pattern="[a-z0-9\\-]{1,24}" autocapitalize="none" autocomplete="off" spellcheck="false" title="Małe litery bez polskich znaków, cyfry i myślniki"></label><p class="rb-msg" aria-live="polite"></p><button class="rb-primary rb-wide">Dołącz do pokoju</button></form>';
      const saved = parseSave('rudobor.v1.identity'),
        form = body.querySelector('form');
      form.elements.nick.value = typeof saved.nick === 'string' ? saved.nick : 'Wędrowiec';
      form.elements.room.value = typeof saved.room === 'string' ? saved.room : 'dolina';
      body.querySelector('.rb-msg').textContent = msg;
    }
    function openPanel(kind) {
      if (game.hero.hp <= 0) kind = 'death';
      cancelInput();
      panel = kind;
      dialog.querySelector('[data-action="close"]').hidden = kind === 'death';
      if (kind === 'pack') drawPack();
      if (kind === 'network') drawNetwork();
      if (kind === 'pause') {
        title.textContent = game.room ? 'Menu pokoju' : 'Pauza';
        body.innerHTML = '<p>' + (game.room ? 'Czas we wspólnym świecie nadal płynie.' : 'Postęp tej wyprawy zapisuje się na tym urządzeniu.') + '</p><button class="rb-primary rb-wide" data-action="close">Wróć do gry</button><button class="rb-wide" data-action="help">Sterowanie</button>';
      }
      if (kind === 'death') {
        title.textContent = 'Koniec wyprawy';
        body.innerHTML = '<p>Śluzaki cię pokonały. Możesz wrócić na polanę ze swoim ekwipunkiem i kontynuować budowę.</p><button class="rb-primary rb-wide" data-action="respawn">Odrodź się na polanie</button>';
      }
      if (kind === 'help') {
        title.textContent = 'Sterowanie';
        body.innerHTML = '<p>Zetnij sosnę, wykop kamień i zbuduj schronienie przed zmrokiem. Nocą i w głębi jaskiń pojawiają się śluzaki.</p><dl><dt>A / D lub ← →</dt><dd>Ruch w lewo i w prawo</dd><dt>Spacja, W lub ↑</dt><dd>Skok</dd><dt>LPM</dt><dd>Przytrzymaj kilof na bloku lub pniu. Z materiałem w ręku kliknij puste pole, aby budować.</dd><dt>PPM</dt><dd>Postaw ostatnio wybrany materiał w zasięgu ręki.</dd><dt>F</dt><dd>Atak w kierunku patrzenia. Wytworzone ostrze zwiększa obrażenia.</dd><dt>1–6 / kółko</dt><dd>Wybór przedmiotu na pasku</dd><dt>E / Esc</dt><dd>Plecak i wytwarzanie / menu gry</dd></dl><p>Na ekranie dotykowym używaj strzałek do ruchu. Przytrzymaj blok z wybranym kilofem lub dotknij pustego pola z materiałem w ręku.</p><button class="rb-primary rb-wide" data-action="close">Wróć do gry</button>';
      }
      if (!dialog.open) dialog.showModal();
    }
    function hidePanel() {
      if (net && !net.active && panel === 'network') discardRoom(net);
      panel = '';
      if (dialog.open) dialog.close();
      cancelInput();
      view.focus({
        preventScroll: true
      });
    }
    function soundButton() {
      const button = root.querySelector('[data-action="sound"]'),
        label = soundOn ? 'Wycisz dźwięk' : 'Włącz dźwięk';
      button.setAttribute('aria-pressed', String(soundOn));
      button.setAttribute('aria-label', label);
      button.title = label;
      button.querySelector('canvas').dataset.icon = soundOn ? 'sound' : 'mute';
      paintIcons(button);
    }
    root.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn || !root.contains(btn)) return;
      if (btn.dataset.slot !== undefined) {
        selectSlot(Number(btn.dataset.slot));
        view.focus({
          preventScroll: true
        });
        return;
      }
      if (btn.dataset.craft) {
        craft(btn.dataset.craft);
        return;
      }
      const action = btn.dataset.action;
      if (['pack', 'help', 'network', 'pause'].includes(action)) {
        openPanel(action);
        return;
      }
      if (action === 'close' && panel !== 'death') hidePanel();
      if (action === 'sound') {
        soundOn = !soundOn;
        try {
          localStorage.setItem('rudobor.v1.audio', soundOn ? 'on' : 'off');
        } catch {}
        soundButton();
        sound(320, .09, 'sine', 465);
        view.focus({
          preventScroll: true
        });
      }
      if (action === 'leave' && net) {
        discardRoom(net);
        hidePanel();
        toast('Powrót do przygody solo.');
        if (game.hero.hp <= 0) openPanel('death');
      }
      if (action === 'respawn') respawn();
    });
    body.addEventListener('submit', e => {
      if (e.target.id !== 'rb-join') return;
      e.preventDefault();
      const form = e.target,
        nick = form.elements.nick.value.trim().slice(0, 16),
        room = form.elements.room.value.trim().toLowerCase();
      if (!nick || !/^[a-z0-9-]{1,24}$/.test(room)) {
        body.querySelector('.rb-msg').textContent = 'Podaj nazwę gracza i kod złożony z małych liter, cyfr lub myślników.';
        return;
      }
      void joinRoom(room, nick);
    });
    dialog.addEventListener('cancel', e => {
      e.preventDefault();
      if (panel !== 'death') hidePanel();
    });
    const keyActions = {
      KeyA: 'left',
      ArrowLeft: 'left',
      KeyD: 'right',
      ArrowRight: 'right',
      KeyW: 'jump',
      ArrowUp: 'jump',
      Space: 'jump',
      KeyF: 'attack'
    };
    function press(action) {
      if (action === 'jump' && !keys.has('jump')) game.jumpBuffer = .14;
      keys.add(action);
    }
    window.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.target !== document.body && e.target !== document.documentElement && !root.contains(e.target)) return;
      if (e.target.matches?.('input,textarea,[contenteditable="true"]')) return;
      if (e.code === 'Escape') {
        e.preventDefault();
        if (e.repeat || panel === 'death') return;
        if (panel) hidePanel();else openPanel('pause');
        return;
      }
      if (e.code === 'KeyE' && (!panel || panel === 'pack')) {
        e.preventDefault();
        if (!e.repeat) {
          if (panel) hidePanel();else openPanel('pack');
        }
        return;
      }
      if (panel) return;
      if (e.target.closest?.('button') && (e.code === 'Space' || e.code === 'Enter')) return;
      if (/^Digit[1-6]$/.test(e.code)) {
        e.preventDefault();
        selectSlot(Number(e.code.slice(-1)) - 1);
        return;
      }
      const action = keyActions[e.code];
      if (action) {
        e.preventDefault();
        press(action);
      }
    });
    window.addEventListener('keyup', e => {
      if (keyActions[e.code]) keys.delete(keyActions[e.code]);
    });
    let aimPointer = null;
    function point(e) {
      const b = view.getBoundingClientRect();
      mouse.sx = (e.clientX - b.left) * vw / b.width;
      mouse.sy = (e.clientY - b.top) * vh / b.height;
      mouse.known = true;
      mouse.touch = e.pointerType === 'touch';
    }
    view.addEventListener('pointerdown', e => {
      if (panel || aimPointer !== null && aimPointer !== e.pointerId || e.button !== 0 && e.button !== 2) return;
      e.preventDefault();
      view.focus({
        preventScroll: true
      });
      point(e);
      aimPointer = e.pointerId;
      view.setPointerCapture(e.pointerId);
      usePointer(e.button);
    });
    view.addEventListener('pointermove', e => {
      if (aimPointer === null || e.pointerId === aimPointer) point(e);
    });
    function releasePointer(e) {
      if (e.pointerId !== aimPointer) return;
      aimPointer = null;
      mouse.down = false;
      mine = null;
      if (mouse.touch) mouse.known = false;
    }
    view.addEventListener('pointerup', releasePointer);
    view.addEventListener('pointercancel', releasePointer);
    view.addEventListener('lostpointercapture', releasePointer);
    view.addEventListener('pointerleave', () => {
      if (aimPointer === null) mouse.known = false;
    });
    view.addEventListener('contextmenu', e => e.preventDefault());
    view.addEventListener('wheel', e => {
      if (!panel && e.deltaY) {
        e.preventDefault();
        selectSlot(game.slot + Math.sign(e.deltaY));
      }
    }, {
      passive: false
    });
    root.querySelectorAll('[data-hold]').forEach(button => {
      const action = button.dataset.hold;
      button.addEventListener('pointerdown', e => {
        if (panel) return;
        e.preventDefault();
        button.setPointerCapture(e.pointerId);
        press(action);
      });
      const release = () => keys.delete(action);
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);
    });
    window.addEventListener('blur', cancelInput);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelInput();
        saveWorld(game);
      }
    });
    window.addEventListener('pagehide', () => {
      saveWorld(game);
      if (net) discardRoom(net);
    });
    new ResizeObserver(resizeView).observe(view);
    paintIcons(root);
    updateBelt();
    soundButton();
    setStatus();
    resizeView();
    hud();
    if (game.hero.hp <= 0) openPanel('death');
    let previous = performance.now(),
      accum = 0,
      saveAt = previous + 5000;
    function frame(now) {
      accum += Math.min(.15, Math.max(0, (now - previous) / 1000));
      previous = now;
      while (accum >= 1 / 60) {
        step(1 / 60);
        accum -= 1 / 60;
      }
      if (!document.hidden && vw && vh) {
        publishPosition();
        render(now / 1000);
      }
      if (now >= saveAt) {
        saveAt = now + 5000;
        saveWorld(game);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startRudobor, {
    once: true
  });else startRudobor();
})();
