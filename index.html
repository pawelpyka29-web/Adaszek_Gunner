
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onDisconnect,
  remove,
  update,
  push
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// ======================================================
// FIREBASE - ZACHOWANA KONFIGURACJA
// ======================================================

const firebaseConfig = {
  apiKey: "AIzaSyCanH2BBs2Up7BtN1AXQ1uyQd6YsmthT0w",
  authDomain: "pandixif-multiplayer.firebaseapp.com",
  databaseURL: "https://pandixif-multiplayer-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pandixif-multiplayer",
  storageBucket: "pandixif-multiplayer.firebasestorage.app",
  messagingSenderId: "226124925060",
  appId: "1:124924925060:web:c414a82236e554deb7dad1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const myId = "player_" + Math.random().toString(36).substring(2, 9);
let currentRoom = "arena-glowna";
let myRef = null;
let playersRef = null;
let bulletsRef = null;
let buildsRef = null;
let unsubPlayers = null;
let unsubBullets = null;
let unsubBuilds = null;

const connectedRef = ref(db, ".info/connected");

// ======================================================
// 2D GAME
// ======================================================

const canvas = document.createElement("canvas");
canvas.id = "build-shoot-canvas";

canvas.style.cssText = `
position:fixed;
inset:0;
width:100%;
height:100%;
display:block;
z-index:0;
cursor:crosshair;
`;

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.style.background = "#111";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

let W = innerWidth;
let H = innerHeight;

function resize() {
  W = innerWidth;
  H = innerHeight;

  canvas.width = Math.round(W * Math.min(devicePixelRatio, 2));
  canvas.height = Math.round(H * Math.min(devicePixelRatio, 2));

  ctx.setTransform(
    Math.min(devicePixelRatio, 2),
    0,
    0,
    Math.min(devicePixelRatio, 2),
    0,
    0
  );
}

resize();
addEventListener("resize", resize);

// ======================================================
// STYLE / HUD
// ======================================================

const style = document.createElement("style");

style.textContent = `
#build-shoot-canvas {
  image-rendering: auto;
}

#build-hud {
  position:fixed;
  right:20px;
  bottom:20px;
  color:white;
  font-family:Arial,sans-serif;
  background:rgba(15,20,30,.8);
  padding:14px;
  border:1px solid rgba(255,255,255,.15);
  border-radius:12px;
  z-index:5;
  pointer-events:none;
}

#build-hud div {
  margin:5px 0;
}

#build-message {
  position:fixed;
  top:20%;
  left:50%;
  transform:translateX(-50%);
  font-family:Arial,sans-serif;
  color:white;
  font-weight:bold;
  font-size:26px;
  text-shadow:0 2px 10px black;
  z-index:10;
  pointer-events:none;
}

#build-select {
  position:fixed;
  bottom:20px;
  left:50%;
  transform:translateX(-50%);
  display:flex;
  gap:8px;
  z-index:10;
  font-family:Arial;
}

.build-slot {
  color:white;
  background:rgba(20,25,35,.9);
  border:2px solid #555;
  border-radius:10px;
  padding:12px;
  min-width:55px;
  text-align:center;
}

.build-slot.active {
  border-color:#66ccff;
  background:rgba(40,100,150,.9);
}

#build-team {
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  font-family:Arial;
  background:#202938;
  color:white;
  padding:20px;
  border-radius:15px;
  z-index:100;
  text-align:center;
  display:none;
}

#build-team button {
  margin:6px;
  padding:12px 20px;
  cursor:pointer;
  border:0;
  border-radius:8px;
  font-weight:bold;
}

#build-toast {
  position:fixed;
  top:80px;
  left:50%;
  transform:translateX(-50%);
  color:white;
  font-family:Arial;
  background:rgba(0,0,0,.7);
  padding:10px 20px;
  border-radius:8px;
  z-index:10;
  pointer-events:none;
}
`;

document.head.appendChild(style);

const hud = document.createElement("div");
hud.id = "build-hud";

hud.innerHTML = `
<div style="color:#55ccff;font-weight:bold;font-size:22px">BUILD & SHOOT</div>
<div id="hud-mode">Tryb: FFA</div>
<div id="hud-team">Drużyna: brak</div>
<div id="hud-ammo">Amunicja: ∞</div>
<div id="hud-kills">Eliminacje: 0</div>
<div id="hud-build">Budowanie: ściana</div>
`;

document.body.appendChild(hud);

const message = document.createElement("div");
message.id = "build-message";
document.body.appendChild(message);

const buildSelect = document.createElement("div");
buildSelect.id = "build-select";

buildSelect.innerHTML = `
<div class="build-slot active" data-slot="1">1<br>Ściana</div>
<div class="build-slot" data-slot="2">2<br>Platforma</div>
<div class="build-slot" data-slot="3">3<br>Rampa</div>
<div class="build-slot" data-slot="4">4<br>Usuń</div>
`;

document.body.appendChild(buildSelect);

const toast = document.createElement("div");
toast.id = "build-toast";
toast.style.display = "none";
document.body.appendChild(toast);

const teamMenu = document.createElement("div");
teamMenu.id = "build-team";

teamMenu.innerHTML = `
<h2>Wybierz tryb</h2>
<button id="team-ffa" style="background:#777;color:white">FREE FOR ALL</button>
<br>
<button id="team-red" style="background:#e74c3c;color:white">RED TEAM</button>
<button id="team-blue" style="background:#3498db;color:white">BLUE TEAM</button>
`;

document.body.appendChild(teamMenu);

// ======================================================
// GAME SETTINGS
// ======================================================

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 900;
const FLOOR_Y = 820;

const GRAVITY = 1800;
const PLAYER_WIDTH = 38;
const PLAYER_HEIGHT = 75;

const BUILD_SIZE = 100;

let gameMode = "ffa";
let team = "none";
let kills = 0;
let score = 0;
let playerLives = 5;

let isPlaying = false;
let gameStarted = false;

let selectedBuild = "wall";

let lastTime = performance.now();
let lastSync = 0;
let lastShot = 0;

let cameraX = 0;
let cameraY = 0;

const players = {};
const bullets = {};
const builds = {};

const keys = {};
const mouse = {
  x: W / 2,
  y: H / 2,
  down: false
};

// ======================================================
// PLAYER
// ======================================================

const player = {
  x: 200,
  y: FLOOR_Y - PLAYER_HEIGHT,
  vx: 0,
  vy: 0,
  facing: 1,
  onGround: false,
  health: 100
};

function getPlayerData() {
  return {
    x: player.x,
    y: player.y,
    z: 0,
    yaw: player.facing,
    lives: playerLives,
    score: score,
    team: team,
    mode: gameMode,
    health: player.health
  };
}

// ======================================================
// MAP
// ======================================================

const mapPlatforms = [
  // Ground
  { x: 0, y: FLOOR_Y, w: WORLD_WIDTH, h: 80 },

  // Platforms
  { x: 300, y: 650, w: 300, h: 25 },
  { x: 700, y: 520, w: 250, h: 25 },
  { x: 1050, y: 650, w: 350, h: 25 },
  { x: 1600, y: 550, w: 250, h: 25 },
  { x: 2000, y: 650, w: 350, h: 25 },
  { x: 2600, y: 500, w: 250, h: 25 },

  // Lower obstacles
  { x: 450, y: 750, w: 100, h: 70 },
  { x: 900, y: 750, w: 100, h: 70 },
  { x: 1500, y: 750, w: 100, h: 70 },
  { x: 1900, y: 750, w: 100, h: 70 },
  { x: 2400, y: 750, w: 100, h: 70 }
];

// ======================================================
// COLLISION
// ======================================================

function rectCollision(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function getAllPlatforms() {
  return [...mapPlatforms, ...Object.values(builds)];
}

function movePlayer(dt) {
  const speed = keys.ShiftLeft || keys.ShiftRight ? 520 : 360;

  let move = 0;

  if (keys.KeyA) move--;
  if (keys.KeyD) move++;

  player.vx = move * speed;

  player.x += player.vx * dt;

  // World boundaries

  player.x = Math.max(
    0,
    Math.min(WORLD_WIDTH - PLAYER_WIDTH, player.x)
  );

  // Horizontal collision

  for (const p of getAllPlatforms()) {
    const playerRect = {
      x: player.x,
      y: player.y,
      w: PLAYER_WIDTH,
      h: PLAYER_HEIGHT
    };

    if (rectCollision(playerRect, p)) {
      if (player.vx > 0) {
        player.x = p.x - PLAYER_WIDTH;
      }

      if (player.vx < 0) {
        player.x = p.x + p.w;
      }
    }
  }

  // Gravity

  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;

  player.onGround = false;

  for (const p of getAllPlatforms()) {
    const playerRect = {
      x: player.x,
      y: player.y,
      w: PLAYER_WIDTH,
      h: PLAYER_HEIGHT
    };

    if (rectCollision(playerRect, p)) {
      if (player.vy > 0) {
        player.y = p.y - PLAYER_HEIGHT;
        player.vy = 0;
        player.onGround = true;
      } else if (player.vy < 0) {
        player.y = p.y + p.h;
        player.vy = 0;
      }
    }
  }

  if (player.x < WORLD_WIDTH / 2) {
    player.facing = 1;
  }

  if (move !== 0) {
    player.facing = move > 0 ? 1 : -1;
  }

  // Falling out

  if (player.y > WORLD_HEIGHT + 200) {
    respawn();
  }
}

// ======================================================
// JUMP
// ======================================================

function jump() {
  if (player.onGround) {
    player.vy = -780;
    player.onGround = false;
  }
}

// ======================================================
// RESPAWN
// ======================================================

function respawn() {
  const spawn = getSpawn();

  player.x = spawn.x;
  player.y = spawn.y;
  player.vx = 0;
  player.vy = 0;
  player.health = 100;

  playerLives--;

  if (playerLives <= 0) {
    playerLives = 5;
    kills = 0;
    score = 0;
    showMessage("Nowa runda!");
  }

  if (myRef) {
    update(myRef, getPlayerData());
  }

  updateHud();
}

function getSpawn() {
  if (gameMode === "teams") {
    return team === "red"
      ? { x: 100, y: 500 }
      : { x: WORLD_WIDTH - 150, y: 500 };
  }

  return {
    x: Math.random() * (WORLD_WIDTH - 300) + 150,
    y: 500
  };
}

// ======================================================
// BUILDING
// ======================================================

function getBuildPosition() {
  const worldX = mouse.x + cameraX;
  const worldY = mouse.y + cameraY;

  return {
    x: Math.floor(worldX / BUILD_SIZE) * BUILD_SIZE,
    y: Math.floor(worldY / BUILD_SIZE) * BUILD_SIZE
  };
}

function buildStructure() {
  if (!buildsRef || !isPlaying) return;

  const pos = getBuildPosition();

  if (selectedBuild === "remove") {
    removeStructure(pos);
    return;
  }

  let structure;

  if (selectedBuild === "wall") {
    structure = {
      x: pos.x,
      y: pos.y,
      w: BUILD_SIZE,
      h: BUILD_SIZE,
      type: "wall",
      owner: myId,
      team
    };
  }

  if (selectedBuild === "platform") {
    structure = {
      x: pos.x,
      y: pos.y,
      w: BUILD_SIZE * 1.5,
      h: 25,
      type: "platform",
      owner: myId,
      team
    };
  }

  if (selectedBuild === "ramp") {
    structure = {
      x: pos.x,
      y: pos.y,
      w: BUILD_SIZE,
      h: BUILD_SIZE,
      type: "ramp",
      owner: myId,
      team
    };
  }

  // Limits

  if (Object.keys(builds).length > 250) {
    showMessage("Limit konstrukcji!");
    return;
  }

  // Prevent building inside player

  const playerRect = {
    x: player.x,
    y: player.y,
    w: PLAYER_WIDTH,
    h: PLAYER_HEIGHT
  };

  if (rectCollision(playerRect, structure)) {
    showMessage("Nie możesz budować na sobie!");
    return;
  }

  push(buildsRef, structure);
}

function removeStructure(pos) {
  let closest = null;
  let closestDistance = Infinity;

  for (const id in builds) {
    const b = builds[id];

    const centerX = b.x + b.w / 2;
    const centerY = b.y + b.h / 2;

    const d = Math.hypot(
      centerX - pos.x,
      centerY - pos.y
    );

    if (d < closestDistance && d < 180) {
      closestDistance = d;
      closest = id;
    }
  }

  if (closest) {
    remove(ref(db, `rooms/${currentRoom}/builds/${closest}`));
  }
}

// ======================================================
// TEAM LOGIC
// ======================================================

function isEnemy(p) {
  if (!p) return false;
  if (p.id === myId) return false;

  if (gameMode === "ffa") return true;

  if (gameMode === "teams") {
    return p.team !== team;
  }

  return true;
}

// ======================================================
// SHOOTING
// ======================================================

function shoot() {
  if (!isPlaying || !bulletsRef) return;

  const now = performance.now();

  if (now - lastShot < 180) return;

  lastShot = now;

  const worldMouseX = mouse.x + cameraX;
  const worldMouseY = mouse.y + cameraY;

  const startX = player.x + PLAYER_WIDTH / 2;
  const startY = player.y + PLAYER_HEIGHT / 2;

  const dx = worldMouseX - startX;
  const dy = worldMouseY - startY;

  const len = Math.hypot(dx, dy) || 1;

  const dirX = dx / len;
  const dirY = dy / len;

  push(bulletsRef, {
    shooter: myId,
    x: startX,
    y: startY,
    z: 0,
    vx: dirX * 1100,
    vy: dirY * 1100,
    team,
    time: Date.now()
  });
}

// ======================================================
// BULLET SYNC
// ======================================================

function processBullet(b) {
  if (!b || b.shooter === myId) return;

  // Basic hit detection

  const target = players[b.shooter];

  // The shooter is not the target.
  // Damage is processed by the shooting client.
}

// ======================================================
// CLIENT HIT DETECTION
// ======================================================

function checkShots() {
  if (!isPlaying) return;

  for (const id in players) {
    const p = players[id];

    if (!isEnemy(p)) continue;

    if (p.lives <= 0) continue;

    const px = p.x;
    const py = p.y;

    // Aim-based hit detection

    const dx = mouse.x + cameraX - (px + PLAYER_WIDTH / 2);
    const dy = mouse.y + cameraY - (py + PLAYER_HEIGHT / 2);

    const dist = Math.hypot(dx, dy);

    if (dist < 40 && mouse.down) {
      // Only a visual aim check.
      // Actual damage is handled through bullet intersection.
    }
  }
}

// ======================================================
// BULLET DAMAGE
// ======================================================

function applyDamage(targetId, damage = 25) {
  if (!players[targetId]) return;

  if (!isEnemy(players[targetId])) return;

  const targetRef = ref(
    db,
    `rooms/${currentRoom}/players/${targetId}`
  );

  const target = players[targetId];

  const newHealth = (target.health ?? 100) - damage;

  if (newHealth <= 0) {
    update(targetRef, {
      health: 0,
      lives: 0
    });

    score += 100;
    kills++;

    update(myRef, {
      score,
      kills
    });

    updateHud();
  } else {
    update(targetRef, {
      health: newHealth
    });
  }
}

// ======================================================
// BULLET RENDER / LOCAL DAMAGE
// ======================================================

const localBullets = {};

function createLocalBullet(data, id) {
  localBullets[id] = {
    x: data.x,
    y: data.y,
    vx: data.vx || 0,
    vy: data.vy || 0,
    shooter: data.shooter,
    team: data.team,
    born: Date.now()
  };
}

// ======================================================
// INPUT
// ======================================================

addEventListener("keydown", e => {
  keys[e.code] = true;

  if (e.code === "Space") {
    e.preventDefault();
    jump();
  }

  if (e.code === "Digit1") selectBuild("wall");
  if (e.code === "Digit2") selectBuild("platform");
  if (e.code === "Digit3") selectBuild("ramp");
  if (e.code === "Digit4") selectBuild("remove");
});

addEventListener("keyup", e => {
  keys[e.code] = false;
});

canvas.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener("mousedown", e => {
  if (e.button === 0) {
    mouse.down = true;
    shoot();
  }

  if (e.button === 2) {
    e.preventDefault();
    buildStructure();
  }
});

canvas.addEventListener("mouseup", e => {
  if (e.button === 0) mouse.down = false;
});

canvas.addEventListener("contextmenu", e => {
  e.preventDefault();
});

// ======================================================
// BUILD SELECTION
// ======================================================

function selectBuild(type) {
  selectedBuild = type;

  document.querySelectorAll(".build-slot").forEach(slot => {
    slot.classList.toggle(
      "active",
      slot.dataset.slot ===
        (type === "wall" ? "1" :
         type === "platform" ? "2" :
         type === "ramp" ? "3" : "4")
    );
  });

  const hudBuild = document.getElementById("hud-build");

  hudBuild.textContent =
    "Budowanie: " +
    (type === "wall" ? "ściana" :
     type === "platform" ? "platforma" :
     type === "ramp" ? "rampa" : "usuwanie");
}

buildSelect.addEventListener("click", e => {
  const slot = e.target.closest(".build-slot");

  if (!slot) return;

  const num = slot.dataset.slot;

  if (num === "1") selectBuild("wall");
  if (num === "2") selectBuild("platform");
  if (num === "3") selectBuild("ramp");
  if (num === "4") selectBuild("remove");
});

// ======================================================
// TEAM MENU
// ======================================================

function startMode(mode, chosenTeam = "none") {
  gameMode = mode;
  team = chosenTeam;

  teamMenu.style.display = "none";

  gameStarted = true;

  const spawn = getSpawn();

  player.x = spawn.x;
  player.y = spawn.y;

  player.vx = 0;
  player.vy = 0;

  playerLives = 5;
  player.health = 100;
  score = 0;
  kills = 0;

  updateHud();

  if (myRef) {
    update(myRef, getPlayerData());
  }

  isPlaying = true;
}

document.getElementById("team-ffa").onclick = () => {
  startMode("ffa", "none");
};

document.getElementById("team-red").onclick = () => {
  startMode("teams", "red");
};

document.getElementById("team-blue").onclick = () => {
  startMode("teams", "blue");
};

// ======================================================
// FIREBASE CONNECTION
// ======================================================

onValue(connectedRef, snap => {
  const statusEl = document.getElementById("net-status");

  if (!statusEl) return;

  if (snap.val() === true) {
    statusEl.textContent = "Online";
    statusEl.style.color = "#36c5a1";
  } else {
    statusEl.textContent = "Rozłączono";
    statusEl.style.color = "#ff7474";
  }
});

// ======================================================
// ROOM
// ======================================================

function joinRoom(roomName) {
  if (myRef) remove(myRef);

  if (unsubPlayers) unsubPlayers();
  if (unsubBullets) unsubBullets();
  if (unsubBuilds) unsubBuilds();

  currentRoom = roomName.trim() || "arena-glowna";

  const roomDisplay = document.getElementById("room-name-display");

  if (roomDisplay) {
    roomDisplay.textContent = currentRoom;
  }

  myRef = ref(db, `rooms/${currentRoom}/players/${myId}`);
  playersRef = ref(db, `rooms/${currentRoom}/players`);
  bulletsRef = ref(db, `rooms/${currentRoom}/bullets`);
  buildsRef = ref(db, `rooms/${currentRoom}/builds`);

  onDisconnect(myRef).remove();

  set(myRef, getPlayerData());

  // PLAYER SYNC

  unsubPlayers = onValue(playersRef, snapshot => {
    const data = snapshot.val() || {};

    for (const id in data) {
      if (id === myId) continue;

      players[id] = {
        ...data[id],
        id
      };
    }

    for (const id in players) {
      if (!data[id]) {
        delete players[id];
      }
    }

    const countEl = document.getElementById("players-count");

    if (countEl) {
      countEl.textContent = Object.keys(data).length;
    }
  });

  // BULLET SYNC

  unsubBullets = onValue(bulletsRef, snapshot => {
    const data = snapshot.val() || {};

    for (const id in data) {
      if (localBullets[id]) continue;

      const b = data[id];

      if (Date.now() - (b.time || Date.now()) > 3000) {
        continue;
      }

      createLocalBullet(b, id);
    }
  });

  // BUILD SYNC

  unsubBuilds = onValue(buildsRef, snapshot => {
    const data = snapshot.val() || {};

    for (const id in builds) {
      if (!data[id]) {
        delete builds[id];
      }
    }

    for (const id in data) {
      builds[id] = data[id];
    }
  });
}

// ======================================================
// MAIN MENU
// ======================================================

const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("start");
const roomInput = document.getElementById("room-input");
const msgEl = document.getElementById("message");

startBtn.onclick = () => {
  const roomName = roomInput.value.trim();

  if (!roomName) {
    alert("Wpisz nazwę pokoju!");
    return;
  }

  joinRoom(roomName);

  overlay.style.display = "none";
  teamMenu.style.display = "block";

  isPlaying = false;
};

// ======================================================
// CAMERA
// ======================================================

function updateCamera() {
  cameraX = player.x - W / 2 + PLAYER_WIDTH / 2;
  cameraY = player.y - H / 2 + PLAYER_HEIGHT / 2;

  cameraX = Math.max(
    0,
    Math.min(WORLD_WIDTH - W, cameraX)
  );

  cameraY = Math.max(
    0,
    Math.min(WORLD_HEIGHT - H, cameraY)
  );
}

// ======================================================
// DRAW BACKGROUND
// ======================================================

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);

  gradient.addColorStop(0, "#101b30");
  gradient.addColorStop(1, "#27394b");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Stars

  for (let i = 0; i < 100; i++) {
    const x = (i * 137.5 - cameraX * 0.15) % W;
    const y = (i * 91.3 - cameraY * 0.15) % H;

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(
      (x + W) % W,
      (y + H) % H,
      2,
      2
    );
  }
}

// ======================================================
// DRAW MAP
// ======================================================

function drawPlatforms() {
  for (const p of mapPlatforms) {
    const x = p.x - cameraX;
    const y = p.y - cameraY;

    ctx.fillStyle = "#475467";
    ctx.fillRect(x, y, p.w, p.h);

    ctx.fillStyle = "#71839b";
    ctx.fillRect(x, y, p.w, 6);

    ctx.strokeStyle = "#1c2531";
    ctx.strokeRect(x, y, p.w, p.h);
  }
}

// ======================================================
// DRAW BUILDINGS
// ======================================================

function drawBuilds() {
  for (const id in builds) {
    const b = builds[id];

    const x = b.x - cameraX;
    const y = b.y - cameraY;

    if (b.type === "ramp") {
      ctx.fillStyle = b.team === "red" ? "#c55c5c" : "#5797d1";

      ctx.beginPath();
      ctx.moveTo(x, y + b.h);
      ctx.lineTo(x + b.w, y);
      ctx.lineTo(x + b.w, y + b.h);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#222";
      ctx.stroke();
    } else {
      ctx.fillStyle =
        b.team === "red" ? "#c55c5c" :
        b.team === "blue" ? "#5797d1" : "#8997a9";

      ctx.fillRect(x, y, b.w, b.h);

      ctx.fillStyle = "rgba(255,255,255,.15)";
      ctx.fillRect(x, y, b.w, 8);

      ctx.strokeStyle = "#202938";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, b.w, b.h);

      // Grid pattern

      ctx.strokeStyle = "rgba(0,0,0,.25)";

      for (let gx = 20; gx < b.w; gx += 20) {
        ctx.beginPath();
        ctx.moveTo(x + gx, y);
        ctx.lineTo(x + gx, y + b.h);
        ctx.stroke();
      }
    }
  }
}

// ======================================================
// DRAW PLAYER
// ======================================================

function drawPlayer(p, isMe = false) {
  const x = p.x - cameraX;
  const y = p.y - cameraY;

  const color =
    p.team === "red" ? "#ff5252" :
    p.team === "blue" ? "#42a5ff" :
    isMe ? "#4de1bc" : "#f5c542";

  // Shadow

  ctx.fillStyle = "rgba(0,0,0,.2)";
  ctx.fillRect(x - 4, y + PLAYER_HEIGHT, PLAYER_WIDTH + 8, 5);

  // Body

  ctx.fillStyle = color;
  ctx.fillRect(x + 5, y + 25, 28, 32);

  // Head

  ctx.fillStyle = "#ffd2a1";
  ctx.fillRect(x + 9, y + 4, 22, 22);

  // Helmet

  ctx.fillStyle = "#263448";
  ctx.fillRect(x + 7, y, 26, 8);

  // Legs

  ctx.fillStyle = "#202938";
  ctx.fillRect(x + 7, y + 55, 10, 20);
  ctx.fillRect(x + 21, y + 55, 10, 20);

  // Weapon

  ctx.fillStyle = "#111";

  ctx.fillRect(
    p.facing === -1 ? x - 12 : x + 30,
    y + 34,
    20,
    7
  );

  // Name

  ctx.fillStyle = "white";
  ctx.font = "bold 13px Arial";
  ctx.textAlign = "center";

  ctx.fillText(
    isMe ? "TY" : p.id.substring(0, 8),
    x + PLAYER_WIDTH / 2,
    y - 10
  );

  // Health bar

  ctx.fillStyle = "#222";
  ctx.fillRect(x, y - 5, PLAYER_WIDTH, 5);

  ctx.fillStyle = "#35db7d";
  ctx.fillRect(
    x,
    y - 5,
    PLAYER_WIDTH * Math.max(0, (p.health || 0) / 100),
    5
  );
}

// ======================================================
// DRAW BULLETS
// ======================================================

function drawBullets(dt) {
  for (const id in localBullets) {
    const b = localBullets[id];

    b.x += b.vx * dt;
    b.y += b.vy * dt;

    // Hit detection

    for (const playerId in players) {
      const p = players[playerId];

      if (!isEnemy(p)) continue;

      const hit =
        b.x > p.x &&
        b.x < p.x + PLAYER_WIDTH &&
        b.y > p.y &&
        b.y < p.y + PLAYER_HEIGHT;

      if (hit) {
        if (b.shooter === myId) {
          applyDamage(playerId, 25);
        }

        delete localBullets[id];
        break;
      }
    }

    // Bullet lifespan

    if (Date.now() - b.born > 1800) {
      delete localBullets[id];
    }
  }

  for (const id in localBullets) {
    const b = localBullets[id];

    const x = b.x - cameraX;
    const y = b.y - cameraY;

    ctx.fillStyle = b.team === "red" ? "#ff5757" : "#ffff70";

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 10;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// ======================================================
// BUILD PREVIEW
// ======================================================

function drawBuildPreview() {
  if (!isPlaying) return;

  const pos = getBuildPosition();

  const x = pos.x - cameraX;
  const y = pos.y - cameraY;

  ctx.strokeStyle = "rgba(255,255,255,.7)";
  ctx.lineWidth = 2;

  if (selectedBuild === "wall") {
    ctx.strokeRect(x, y, BUILD_SIZE, BUILD_SIZE);
  }

  if (selectedBuild === "platform") {
    ctx.strokeRect(x, y, BUILD_SIZE * 1.5, 25);
  }

  if (selectedBuild === "ramp") {
    ctx.beginPath();
    ctx.moveTo(x, y + BUILD_SIZE);
    ctx.lineTo(x + BUILD_SIZE, y);
    ctx.lineTo(x + BUILD_SIZE, y + BUILD_SIZE);
    ctx.closePath();
    ctx.stroke();
  }

  if (selectedBuild === "remove") {
    ctx.strokeStyle = "#ff4444";
    ctx.strokeRect(x, y, BUILD_SIZE, BUILD_SIZE);
  }
}

// ======================================================
// DRAW HUD
// ======================================================

function updateHud() {
  document.getElementById("hud-mode").textContent =
    "Tryb: " + (gameMode === "ffa" ? "FFA" : "TEAM");

  document.getElementById("hud-team").textContent =
    "Drużyna: " +
    (team === "red" ? "RED" :
     team === "blue" ? "BLUE" : "brak");

  document.getElementById("hud-kills").textContent =
    "Eliminacje: " + kills;

  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = score;

  const livesEl = document.getElementById("lives");
  if (livesEl) livesEl.textContent = playerLives;
}

// ======================================================
// MESSAGE
// ======================================================

let messageTimer = null;

function showMessage(text) {
  message.textContent = text;

  clearTimeout(messageTimer);

  messageTimer = setTimeout(() => {
    message.textContent = "";
  }, 2000);
}

// ======================================================
// DRAW
// ======================================================

function draw() {
  ctx.clearRect(0, 0, W, H);

  drawBackground();
  drawPlatforms();
  drawBuilds();

  // Other players

  for (const id in players) {
    const p = players[id];

    if (p.lives <= 0) continue;

    drawPlayer(p, false);
  }

  // Local player

  drawPlayer({
    x: player.x,
    y: player.y,
    facing: player.facing,
    team,
    health: player.health
  }, true);

  drawBullets(0);
  drawBuildPreview();
}

// ======================================================
// GAME LOOP
// ======================================================

let bulletDrawTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = Math.min((now - lastTime) / 1000, 0.04);

  lastTime = now;

  if (isPlaying) {
    movePlayer(dt);
    updateCamera();

    if (mouse.down) {
      shoot();
    }

    // Sync player

    if (now - lastSync > 80 && myRef) {
      lastSync = now;

      update(myRef, getPlayerData());
    }

    // Keep HUD fresh

    updateHud();
  }

  // Bullet movement

  const bulletDt = Math.min(
    (now - bulletDrawTime) / 1000,
    0.04
  );

  bulletDrawTime = now;

  drawBackground();
  drawPlatforms();
  drawBuilds();

  for (const id in players) {
    const p = players[id];

    if (p.lives <= 0) continue;

    drawPlayer(p, false);
  }

  drawPlayer({
    x: player.x,
    y: player.y,
    facing: player.facing,
    team,
    health: player.health
  }, true);

  drawBullets(bulletDt);
  drawBuildPreview();
}

// ======================================================
// INIT
// ======================================================

animate(performance.now());
