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

const firebaseConfig = {
  apiKey: "AIzaSyCanH2BBs2Up7BtN1AXQ1uyQd6YsmthT0w",
  authDomain: "pandixif-multiplayer.firebaseapp.com",
  databaseURL: "https://pandixif-multiplayer-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pandixif-multiplayer",
  storageBucket: "pandixif-multiplayer.firebasestorage.app",
  messagingSenderId: "226124925060",
  appId: "1:226124925060:web:c414a82236e554deb7dad1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const myId = "player_" + Math.random().toString(36).substring(2, 9);
let currentRoom = "arena-glowna";
let myRef = null;
let playersRef = null;
let bulletsRef = null;
let unsubPlayers = null;
let unsubBullets = null;

const connectedRef = ref(db, ".info/connected");

// ======================================================
//                   ARENA FPS
// ======================================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x10141f);
scene.fog = new THREE.Fog(0x10141f, 25, 110);

const camera = new THREE.PerspectiveCamera(
  85,
  innerWidth / innerHeight,
  0.1,
  200
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

renderer.domElement.style.position = "fixed";
renderer.domElement.style.inset = "0";
renderer.domElement.style.display = "block";

// ======================================================
//                     LIGHTING
// ======================================================

const hemi = new THREE.HemisphereLight(0xb8d7ff, 0x25202c, 2);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffd6a0, 3);
sun.position.set(25, 40, 20);
sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;
sun.shadow.camera.left = -45;
sun.shadow.camera.right = 45;
sun.shadow.camera.top = 45;
sun.shadow.camera.bottom = -45;

scene.add(sun);

const ambient = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambient);

// ======================================================
//                       MATERIALS
// ======================================================

const mat = (color, roughness = 0.8, metalness = 0) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness
  });

const floorMat = mat(0x252c38);
const wallMat = mat(0x424b5b);
const stoneMat = mat(0x606b7b);
const darkMat = mat(0x171d26);
const metalMat = mat(0x303a48, 0.4, 0.7);
const redMat = mat(0x8b3535);
const blueMat = mat(0x244d85);

const solids = [];
const decorations = [];

// ======================================================
//                     WORLD BLOCKS
// ======================================================

function block(x, y, z, w, h, d, material, collide = true) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  if (collide) {
    solids.push({
      x,
      z,
      w,
      d,
      top: y + h / 2
    });
  }

  return mesh;
}

function cylinder(x, y, z, radius, height, material) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 16),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);
  return mesh;
}

function glowingBox(x, y, z, w, h, d, color) {
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.3
  });

  return block(x, y, z, w, h, d, material, false);
}

// ======================================================
//                       FLOOR
// ======================================================

block(0, -0.5, 0, 50, 1, 50, floorMat, false);

// Decorative floor tiles

const tileMat = mat(0x303948);

for (let x = -24; x <= 24; x += 4) {
  for (let z = -24; z <= 24; z += 4) {
    if (Math.abs(x) < 22 && Math.abs(z) < 22) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(3.9, 0.04, 3.9),
        tileMat
      );

      tile.position.set(x, 0.02, z);
      tile.receiveShadow = true;
      scene.add(tile);
    }
  }
}

// ======================================================
//                  OUTER ARENA WALLS
// ======================================================

block(0, 4, -25, 50, 8, 1, wallMat);
block(0, 4, 25, 50, 8, 1, wallMat);
block(-25, 4, 0, 1, 8, 50, wallMat);
block(25, 4, 0, 1, 8, 50, wallMat);

// Outer wall decoration

for (let i = -20; i <= 20; i += 5) {
  glowingBox(i, 7.7, -24.45, 1.3, 0.15, 0.1, 0x3d9cff);
  glowingBox(i, 7.7, 24.45, 1.3, 0.15, 0.1, 0x3d9cff);
}

for (let i = -20; i <= 20; i += 5) {
  glowingBox(-24.45, 7.7, i, 0.1, 0.15, 1.3, 0x3d9cff);
  glowingBox(24.45, 7.7, i, 0.1, 0.15, 1.3, 0x3d9cff);
}

// ======================================================
//                    ARENA STRUCTURE
// ======================================================

// Central structure

block(0, 2, 0, 8, 4, 8, stoneMat);
block(0, 4.2, 0, 10, 0.4, 10, metalMat);

// Main cover

[
  [-12, -12, 6, 4],
  [12, -12, 6, 4],
  [-12, 12, 6, 4],
  [12, 12, 6, 4],

  [-8, 0, 3, 8],
  [8, 0, 3, 8],
  [0, -8, 8, 3],
  [0, 8, 8, 3],

  [-18, 0, 3, 8],
  [18, 0, 3, 8],
  [0, -18, 8, 3],
  [0, 18, 8, 3]
].forEach(([x, z, w, d]) => {
  block(x, 2.1, z, w, 4.2, d, stoneMat);
});

// Smaller cover

[
  [-4, -14, 3, 3],
  [4, -14, 3, 3],
  [-4, 14, 3, 3],
  [4, 14, 3, 3],

  [-14, -4, 3, 3],
  [-14, 4, 3, 3],
  [14, -4, 3, 3],
  [14, 4, 3, 3]
].forEach(([x, z, w, d]) => {
  block(x, 1.2, z, w, 2.4, d, metalMat);
});

// Towers

const towerPositions = [
  [-20, -20],
  [20, -20],
  [-20, 20],
  [20, 20]
];

towerPositions.forEach(([x, z]) => {
  block(x, 3, z, 5, 6, 5, wallMat);
  block(x, 6.3, z, 6, 0.6, 6, metalMat);

  block(x, 7, z, 1, 1.4, 1, stoneMat, false);

  glowingBox(x, 5, z - 2.55, 1.4, 0.15, 0.1, 0xff4545);
});

// ======================================================
//                     DECORATIONS
// ======================================================

// Crates

function createCrate(x, z, size = 2) {
  block(x, size / 2, z, size, size, size, redMat);

  for (let i = 0; i < 2; i++) {
    block(
      x,
      size / 2,
      z,
      size + 0.05,
      0.12,
      0.12,
      metalMat,
      false
    );
  }
}

createCrate(-5, -5);
createCrate(5, -5);
createCrate(-5, 5);
createCrate(5, 5);

createCrate(-16, -8, 1.5);
createCrate(16, 8, 1.5);
createCrate(8, -16, 1.5);
createCrate(-8, 16, 1.5);

// Pillars

for (const [x, z] of [
  [-16, -16],
  [16, -16],
  [-16, 16],
  [16, 16]
]) {
  cylinder(x, 3, z, 1.2, 6, stoneMat);
  cylinder(x, 6.2, z, 1.5, 0.4, metalMat);
}

// Lights

const arenaLights = [
  [-15, 8, -15],
  [15, 8, -15],
  [-15, 8, 15],
  [15, 8, 15]
];

arenaLights.forEach(([x, y, z]) => {
  const light = new THREE.PointLight(0x4a9fff, 50, 18);
  light.position.set(x, y, z);
  scene.add(light);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 12, 12),
    new THREE.MeshBasicMaterial({
      color: 0x5ebaff
    })
  );

  bulb.position.set(x, y, z);
  scene.add(bulb);
});

// ======================================================
//                     SPAWN POINTS
// ======================================================

const spawnPoints = [
  { x: -20, z: -20 },
  { x: 20, z: -20 },
  { x: -20, z: 20 },
  { x: 20, z: 20 },
  { x: 0, z: -20 },
  { x: 0, z: 20 },
  { x: -20, z: 0 },
  { x: 20, z: 0 }
];

function getRandomSpawn() {
  const sp = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
  return { x: sp.x, z: sp.z };
}

// ======================================================
//                   PLAYER MODELS
// ======================================================

function createPlayerModel() {
  const group = new THREE.Group();

  const bodyMat = mat(0x22aaff);
  const headMat = mat(0xffd0ad);
  const black = mat(0x151515);

  // Body

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1, 0.45),
    bodyMat
  );

  torso.position.y = 0.8;
  torso.castShadow = true;
  group.add(torso);

  // Head

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.42, 0.42),
    headMat
  );

  head.position.y = 1.55;
  head.castShadow = true;
  group.add(head);

  // Helmet

  const helmet = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.18, 0.48),
    metalMat
  );

  helmet.position.y = 1.77;
  group.add(helmet);

  // Legs

  const leg1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.7, 0.25),
    black
  );

  leg1.position.set(-0.18, 0.25, 0);
  leg1.castShadow = true;
  group.add(leg1);

  const leg2 = leg1.clone();
  leg2.position.x = 0.18;
  group.add(leg2);

  // Arms

  const arm1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.65, 0.2),
    bodyMat
  );

  arm1.position.set(-0.48, 0.75, -0.05);
  group.add(arm1);

  const arm2 = arm1.clone();
  arm2.position.x = 0.48;
  group.add(arm2);

  // Gun

  const gun = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.15, 0.7),
    metalMat
  );

  gun.position.set(0.3, 0.8, -0.45);
  group.add(gun);

  // Feet

  const foot1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.15, 0.4),
    black
  );

  foot1.position.set(-0.18, 0.05, -0.08);
  group.add(foot1);

  const foot2 = foot1.clone();
  foot2.position.x = 0.18;
  group.add(foot2);

  return group;
}

// ======================================================
//                    FPS WEAPON
// ======================================================

const weaponGroup = new THREE.Group();

const weaponBody = new THREE.Mesh(
  new THREE.BoxGeometry(0.18, 0.22, 0.65),
  mat(0x202832, 0.3, 0.7)
);

weaponBody.position.set(0.28, -0.28, -0.5);
weaponGroup.add(weaponBody);

const barrel = new THREE.Mesh(
  new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12),
  metalMat
);

barrel.rotation.x = Math.PI / 2;
barrel.position.set(0.28, -0.24, -0.85);
weaponGroup.add(barrel);

const grip = new THREE.Mesh(
  new THREE.BoxGeometry(0.12, 0.25, 0.18),
  darkMat
);

grip.position.set(0.28, -0.42, -0.48);
weaponGroup.add(grip);

const weaponFlash = new THREE.PointLight(0xffa43a, 0, 5);
weaponFlash.position.set(0.28, -0.24, -1.1);
weaponGroup.add(weaponFlash);

const flashMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 8, 8),
  new THREE.MeshBasicMaterial({
    color: 0xffaa44
  })
);

flashMesh.position.copy(weaponFlash.position);
flashMesh.visible = false;
weaponGroup.add(flashMesh);

camera.add(weaponGroup);
scene.add(camera);

// ======================================================
//                      CROSSHAIR
// ======================================================

const crosshair = document.createElement("div");

crosshair.innerHTML = `
<div style="
position:fixed;
left:50%;
top:50%;
transform:translate(-50%,-50%);
width:18px;
height:18px;
pointer-events:none;
z-index:9999;
">
<div style="
position:absolute;
width:2px;
height:18px;
background:white;
left:8px;
box-shadow:0 0 4px black;
"></div>
<div style="
position:absolute;
width:18px;
height:2px;
background:white;
top:8px;
box-shadow:0 0 4px black;
"></div>
</div>
`;

document.body.appendChild(crosshair);

// ======================================================
//                     HUD EXTRAS
// ======================================================

const hud = document.createElement("div");

hud.style.cssText = `
position:fixed;
bottom:20px;
right:20px;
color:white;
font-family:Arial;
font-size:14px;
background:rgba(10,15,25,0.75);
padding:12px 18px;
border-radius:10px;
border:1px solid rgba(100,150,255,0.4);
pointer-events:none;
z-index:999;
`;

hud.innerHTML = `
<div style="font-size:20px;font-weight:bold;color:#4db8ff">
FPS ARENA
</div>
<div style="margin-top:5px">
WASD - ruch
</div>
<div>
SHIFT - sprint
</div>
<div>
SPACE - skok
</div>
<div>
LPM - strzał
</div>
<div>
ESC - menu
</div>
`;

document.body.appendChild(hud);

// ======================================================
//                   GAME STATE
// ======================================================

const otherPlayers = {};
let score = 0;
let playerLives = 3;

let isPlaying = false;
let isShooting = false;
let lastShot = 0;
let hitCooldown = {};
let processedBullets = {};

const player = {
  x: 0,
  y: 1.6,
  z: 0,
  vy: 0,
  yaw: 0,
  pitch: 0,
  onGround: true
};

const keys = {};

addEventListener("keydown", e => {
  keys[e.code] = true;

  if (e.code === "Space" && isPlaying) {
    e.preventDefault();
  }
});

addEventListener("keyup", e => {
  keys[e.code] = false;
});

// ======================================================
//                     FIREBASE
// ======================================================

onValue(connectedRef, (snap) => {
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
//                       ROOM
// ======================================================

function joinRoom(roomName) {
  if (myRef) remove(myRef);
  if (unsubPlayers) unsubPlayers();
  if (unsubBullets) unsubBullets();

  for (const id in otherPlayers) {
    scene.remove(otherPlayers[id]);
    delete otherPlayers[id];
  }

  currentRoom = roomName.trim() || "arena-glowna";

  const roomDisplay = document.getElementById("room-name-display");
  if (roomDisplay) roomDisplay.textContent = currentRoom;

  myRef = ref(db, `rooms/${currentRoom}/players/${myId}`);
  playersRef = ref(db, `rooms/${currentRoom}/players`);
  bulletsRef = ref(db, `rooms/${currentRoom}/bullets`);

  const spawn = getRandomSpawn();

  player.x = spawn.x;
  player.z = spawn.z;
  player.y = 1.6;
  player.vy = 0;
  playerLives = 3;
  score = 0;

  hitCooldown = {};
  processedBullets = {};

  onDisconnect(myRef).remove();

  set(myRef, {
    x: player.x,
    y: 0.8,
    z: player.z,
    yaw: 0,
    lives: 3,
    score: 0
  });

  // PLAYER SYNC

  unsubPlayers = onValue(playersRef, (snapshot) => {
    const data = snapshot.val() || {};
    const activeIds = Object.keys(data);

    const countEl = document.getElementById("players-count");
    if (countEl) countEl.textContent = activeIds.length;

    for (const id of activeIds) {
      if (id === myId) continue;

      const pData = data[id];

      if (!otherPlayers[id]) {
        const playerModel = createPlayerModel();
        scene.add(playerModel);
        otherPlayers[id] = playerModel;
      }

      otherPlayers[id].position.set(
        pData.x,
        pData.y - 0.4,
        pData.z
      );

      otherPlayers[id].rotation.y = pData.yaw || 0;

      // Hide dead players

      otherPlayers[id].visible = (pData.lives || 0) > 0;
    }

    for (const id in otherPlayers) {
      if (!data[id]) {
        scene.remove(otherPlayers[id]);
        delete otherPlayers[id];
      }
    }
  });

  // BULLET / DAMAGE SYNC

  unsubBullets = onValue(bulletsRef, (snapshot) => {
    const data = snapshot.val() || {};

    for (const bId in data) {
      if (processedBullets[bId]) continue;

      processedBullets[bId] = true;

      const b = data[bId];

      if (b.shooter === myId) continue;

      const dist = Math.hypot(
        player.x - b.x,
        player.z - b.z
      );

      if (dist < 1.3 && playerLives > 0) {
        damagePlayer();
      }
    }
  });
}

// ======================================================
//                       DAMAGE
// ======================================================

function damagePlayer() {
  if (!isPlaying || playerLives <= 0) return;

  playerLives--;

  const livesEl = document.getElementById("lives");
  if (livesEl) livesEl.textContent = playerLives;

  screenFlash("red");

  if (playerLives <= 0) {
    endGame("💀 Zostałeś pokonany!");
    return;
  }

  const sp = getRandomSpawn();

  player.x = sp.x;
  player.z = sp.z;
  player.y = 1.6;
  player.vy = 0;

  if (myRef) {
    update(myRef, {
      lives: playerLives,
      x: player.x,
      y: 0.8,
      z: player.z
    });
  }
}

// ======================================================
//                     SCREEN FX
// ======================================================

function screenFlash(color) {
  const flash = document.createElement("div");

  flash.style.cssText = `
position:fixed;
inset:0;
background:${color === "red"
      ? "rgba(255,0,0,0.35)"
      : "rgba(255,255,255,0.5)"};
pointer-events:none;
z-index:99999;
`;

  document.body.appendChild(flash);

  setTimeout(() => flash.remove(), 120);
}

function hitMarker() {
  const marker = document.createElement("div");

  marker.innerHTML = "✕";

  marker.style.cssText = `
position:fixed;
top:50%;
left:50%;
transform:translate(-50%,-50%);
color:#ff5555;
font-size:28px;
font-weight:bold;
pointer-events:none;
z-index:99999;
`;

  document.body.appendChild(marker);

  setTimeout(() => marker.remove(), 180);
}

// ======================================================
//                      COLLISION
// ======================================================

function checkWallCollision(nx, nz) {
  const r = 0.45;

  for (const s of solids) {
    if (
      Math.abs(nx - s.x) < s.w / 2 + r &&
      Math.abs(nz - s.z) < s.d / 2 + r
    ) {
      return true;
    }
  }

  return false;
}

// ======================================================
//                    GAME START
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

  const scoreEl = document.getElementById("score");
  const livesEl = document.getElementById("lives");

  if (scoreEl) scoreEl.textContent = score;
  if (livesEl) livesEl.textContent = playerLives;

  msgEl.textContent = "";

  renderer.domElement.requestPointerLock();
};

// ======================================================
//                   POINTER LOCK
// ======================================================

document.addEventListener("pointerlockchange", () => {
  isPlaying = document.pointerLockElement === renderer.domElement;

  if (overlay) {
    overlay.style.display = isPlaying ? "none" : "flex";
  }
});

document.addEventListener("mousemove", e => {
  if (!isPlaying) return;

  player.yaw -= e.movementX * 0.0025;

  player.pitch = Math.max(
    -1.45,
    Math.min(
      1.45,
      player.pitch - e.movementY * 0.0025
    )
  );
});

// ======================================================
//                      SHOOTING
// ======================================================

const raycaster = new THREE.Raycaster();

raycaster.far = 60;

function shoot() {
  if (!isPlaying || !bulletsRef) return;

  const now = performance.now();

  if (now - lastShot < 160) return;

  lastShot = now;

  // Camera direction

  const direction = new THREE.Vector3();

  camera.getWorldDirection(direction);

  raycaster.set(camera.position, direction);

  // Remote player hit detection

  const models = Object.values(otherPlayers);

  const hits = raycaster.intersectObjects(models, true);

  let bulletX = player.x - Math.sin(player.yaw) * 35;
  let bulletZ = player.z - Math.cos(player.yaw) * 35;

  let targetHit = null;

  for (const hit of hits) {
    let obj = hit.object;

    while (obj && !models.includes(obj)) {
      obj = obj.parent;
    }

    if (!obj) continue;

    const id = Object.keys(otherPlayers).find(
      key => otherPlayers[key] === obj
    );

    if (!id) continue;

    if (hitCooldown[id] && now - hitCooldown[id] < 700) {
      continue;
    }

    targetHit = id;

    bulletX = hit.point.x;
    bulletZ = hit.point.z;

    hitCooldown[id] = now;

    score += 10;

    const scoreEl = document.getElementById("score");
    if (scoreEl) scoreEl.textContent = score;

    hitMarker();
    screenFlash("white");

    break;
  }

  // Bullet sync - keep Firebase structure

  push(bulletsRef, {
    shooter: myId,
    x: bulletX,
    y: player.y,
    z: bulletZ
  });

  // Weapon recoil

  weaponGroup.position.z = 0.12;
  weaponGroup.rotation.x = -0.08;

  weaponFlash.intensity = 5;
  flashMesh.visible = true;

  setTimeout(() => {
    weaponGroup.position.z = 0;
    weaponGroup.rotation.x = 0;
    weaponFlash.intensity = 0;
    flashMesh.visible = false;
  }, 80);
}

document.addEventListener("mousedown", e => {
  if (e.button === 0) shoot();
});

// ======================================================
//                       GAME END
// ======================================================

function endGame(text) {
  isPlaying = false;

  if (document.pointerLockElement) {
    document.exitPointerLock();
  }

  msgEl.textContent = text;
  startBtn.textContent = "ZAGRAJ PONOWNIE";
}

// ======================================================
//                     MOVEMENT
// ======================================================

let lastTime = performance.now();
let lastSync = 0;

let walkTime = 0;
let bobAmount = 0;

function animate(now) {
  requestAnimationFrame(animate);

  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  if (isPlaying) {
    const moving =
      keys["KeyW"] ||
      keys["KeyS"] ||
      keys["KeyA"] ||
      keys["KeyD"];

    const sprint = keys["ShiftLeft"] || keys["ShiftRight"];

    const speed = sprint ? 10 : 6;

    const forward =
      (keys["KeyW"] ? 1 : 0) -
      (keys["KeyS"] ? 1 : 0);

    const strafe =
      (keys["KeyD"] ? 1 : 0) -
      (keys["KeyA"] ? 1 : 0);

    const sin = Math.sin(player.yaw);
    const cos = Math.cos(player.yaw);

    let dx = (-sin * forward + cos * strafe) * speed * dt;
    let dz = (-cos * forward - sin * strafe) * speed * dt;

    // Normalize diagonal movement

    if (forward !== 0 && strafe !== 0) {
      dx *= 0.7071;
      dz *= 0.7071;
    }

    // Movement collision

    if (!checkWallCollision(player.x + dx, player.z)) {
      player.x += dx;
    }

    if (!checkWallCollision(player.x, player.z + dz)) {
      player.z += dz;
    }

    // Jump

    if (keys["Space"] && player.onGround) {
      player.vy = 8.5;
      player.onGround = false;
    }

    player.vy -= 22 * dt;
    player.y += player.vy * dt;

    if (player.y <= 1.6) {
      player.y = 1.6;
      player.vy = 0;
      player.onGround = true;
    }

    // Camera bobbing

    if (moving) {
      walkTime += dt * (sprint ? 14 : 10);
      bobAmount = Math.sin(walkTime) * 0.045;
    } else {
      bobAmount *= 0.85;
    }

    camera.position.set(
      player.x,
      player.y + bobAmount,
      player.z
    );

    camera.rotation.order = "YXZ";
    camera.rotation.y = player.yaw;
    camera.rotation.x = player.pitch;

    // Network sync

    if (now - lastSync > 50 && myRef) {
      lastSync = now;

      set(myRef, {
        x: Number(player.x.toFixed(2)),
        y: Number((player.y - 0.8).toFixed(2)),
        z: Number(player.z.toFixed(2)),
        yaw: Number(player.yaw.toFixed(2)),
        lives: playerLives,
        score: score
      });
    }
  } else {
    // Background camera position

    camera.position.set(player.x, player.y, player.z);
    camera.rotation.order = "YXZ";
    camera.rotation.y = player.yaw;
    camera.rotation.x = player.pitch;
  }

  // Weapon movement

  weaponGroup.position.y = bobAmount * 1.5;

  renderer.render(scene, camera);
}

// ======================================================
//                       RESIZE
// ======================================================

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
});

// ======================================================
//                       START
// ======================================================

animate(performance.now());
