import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onDisconnect,
  remove
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
let currentRoom = "ogolny";
let myRef = null;
let playersRef = null;
let unsubPlayers = null;

const connectedRef = ref(db, ".info/connected");

// --- SCENA THREE.JS ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x91b8d5);
scene.fog = new THREE.Fog(0x91b8d5, 22, 75);
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 120);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xd9efff, 0x46506a, 2));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(-12, 24, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

const mat = (color, roughness = 0.85) => new THREE.MeshStandardMaterial({ color, roughness });
const floorMat = mat(0x4d8062), wallMat = mat(0x68778a), trimMat = mat(0x34465b);
const solids = [];

function block(x, y, z, w, h, d, material, collide = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  if (collide) solids.push({ x, z, w, d, top: y + h / 2 });
  return m;
}

block(0, -0.55, 0, 48, 1, 48, floorMat, false);
block(0, 1, -24, 48, 3, 1, wallMat);
block(0, 1, 24, 48, 3, 1, wallMat);
block(-24, 1, 0, 1, 3, 48, wallMat);
block(24, 1, 0, 1, 3, 48, wallMat);

[
  [-12, 0, 1, 28], [-3, -10, 18, 1], [7, -2, 1, 25], [15, 10, 18, 1],
  [-14, 15, 15, 1], [-18, -12, 1, 14], [-8, 7, 1, 13], [0, 18, 1, 10],
  [13, -16, 16, 1], [19, -5, 1, 13], [-2, 1, 10, 1], [8, 8, 1, 10]
].forEach(([x, z, w, d]) => block(x, 1.15, z, w, 2.3, d, wallMat));

for (let i = 0; i < 18; i++) {
  const x = ((i * 17) % 39) - 19, z = ((i * 23) % 39) - 19;
  if (Math.abs(x) < 5 && Math.abs(z) < 5) continue;
  const p = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.38, 1.8, 8), trimMat);
  p.position.set(x, 0.9, z);
  p.castShadow = true;
  scene.add(p);
}

// --- ZARZĄDZANIE POKOJAMI I FIREBASE ---
const otherPlayers = {};
const otherMat = mat(0xff9800);

onValue(connectedRef, (snap) => {
  const statusEl = document.getElementById('net-status');
  if (snap.val() === true) {
    statusEl.textContent = 'Online';
    statusEl.style.color = '#36c5a1';
  } else {
    statusEl.textContent = 'Rozłączono';
    statusEl.style.color = '#ff7474';
  }
});

function joinRoom(roomName) {
  // Jeśli gracz był już w jakimś pokoju, usuń starego mesha i listenera
  if (myRef) {
    remove(myRef);
  }
  if (unsubPlayers) {
    unsubPlayers();
  }

  // Wyczyść starych graczy z widoku
  for (const id in otherPlayers) {
    scene.remove(otherPlayers[id]);
    delete otherPlayers[id];
  }

  currentRoom = roomName.trim() || "ogolny";
  document.getElementById('room-name-display').textContent = currentRoom;

  myRef = ref(db, `rooms/${currentRoom}/players/${myId}`);
  playersRef = ref(db, `rooms/${currentRoom}/players`);

  onDisconnect(myRef).remove();
  set(myRef, { x: 0, y: 0.8, z: 0, yaw: 0 });

  // Nasłuchuj graczy TYLKO w wybranym pokoju
  unsubPlayers = onValue(playersRef, (snapshot) => {
    const data = snapshot.val() || {};
    const activeIds = Object.keys(data);
    const countEl = document.getElementById('players-count');
    if (countEl) countEl.textContent = activeIds.length;

    for (const id of activeIds) {
      if (id === myId) continue;
      const pData = data[id];
      if (!otherPlayers[id]) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.6, 0.8), otherMat);
        mesh.castShadow = true;
        scene.add(mesh);
        otherPlayers[id] = mesh;
      }
      otherPlayers[id].position.set(pData.x, pData.y, pData.z);
      otherPlayers[id].rotation.y = pData.yaw || 0;
    }

    for (const id in otherPlayers) {
      if (!data[id]) {
        scene.remove(otherPlayers[id]);
        delete otherPlayers[id];
      }
    }
  });
}

// --- KRYSZTAŁY I STRAŻNICY ---
const crystals = [];
const crystalMat = new THREE.MeshStandardMaterial({
  color: 0x45f4ee, emissive: 0x087d89, emissiveIntensity: 0.7, roughness: 0.2
});
[
  [-20, -20], [20, -20], [-20, 20], [20, 20],
  [-5, -18], [12, 3], [-15, 5], [3, 14]
].forEach(([x, z]) => {
  const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.45), crystalMat);
  c.position.set(x, 1.0, z);
  c.castShadow = true;
  scene.add(c);
  crystals.push(c);
});

const guards = [];
const guardMat = new THREE.MeshStandardMaterial({ color: 0xff3b5c, emissive: 0x660011 });
[
  { x: -10, z: -15, axis: 'x', range: 6, speed: 3 },
  { x: 12, z: -8, axis: 'z', range: 7, speed: 3.5 },
  { x: -5, z: 12, axis: 'x', range: 8, speed: 4 },
  { x: 15, z: 16, axis: 'z', range: 5, speed: 3 }
].forEach(cfg => {
  const g = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.8, 12), guardMat);
  g.position.set(cfg.x, 0.9, cfg.z);
  g.castShadow = true;
  scene.add(g);
  guards.push({ mesh: g, startX: cfg.x, startZ: cfg.z, ...cfg });
});

// --- STEROWANIE ---
let score = 0, lives = 3, isPlaying = false;
const player = { x: 0, y: 1.6, z: 0, vy: 0, yaw: 0, pitch: 0, onGround: true };
const keys = {};

addEventListener('keydown', e => keys[e.code] = true);
addEventListener('keyup', e => keys[e.code] = false);

const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('start');
const roomInput = document.getElementById('room-input');
const msgEl = document.getElementById('message');

startBtn.onclick = () => {
  const roomName = roomInput.value.trim();
  if (!roomName) {
    alert('Wpisz nazwę pokoju!');
    return;
  }
  
  joinRoom(roomName);
  if (lives <= 0 || score === crystals.length) resetGame();
  renderer.domElement.requestPointerLock();
};

document.addEventListener('pointerlockchange', () => {
  isPlaying = document.pointerLockElement === renderer.domElement;
  overlay.style.display = isPlaying ? 'none' : 'flex';
});

document.addEventListener('mousemove', e => {
  if (!isPlaying) return;
  player.yaw -= e.movementX * 0.0022;
  player.pitch = Math.max(-1.4, Math.min(1.4, player.pitch - e.movementY * 0.0022));
});

function checkWallCollision(nx, nz) {
  const r = 0.45;
  for (const s of solids) {
    if (Math.abs(nx - s.x) < s.w / 2 + r && Math.abs(nz - s.z) < s.d / 2 + r) return true;
  }
  return false;
}

function resetGame() {
  score = 0; lives = 3;
  document.getElementById('score').textContent = score;
  document.getElementById('lives').textContent = lives;
  msgEl.textContent = '';
  player.x = 0; player.y = 1.6; player.z = 0; player.vy = 0;
  crystals.forEach(c => c.visible = true);
}

function endGame(text) {
  isPlaying = false;
  document.exitPointerLock();
  msgEl.textContent = text;
  startBtn.textContent = 'ZAGRAJ PONOWNIE';
}

let lastTime = performance.now();
let lastSync = 0;

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  crystals.forEach(c => { if (c.visible) c.rotation.y += dt * 2; });

  if (isPlaying) {
    const speed = (keys['ShiftLeft'] ? 9 : 5.5) * dt;
    const forward = (keys['KeyW'] ? 1 : 0) - (keys['KeyS'] ? 1 : 0);
    const strafe = (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0);

    const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
    const dx = (-sin * forward + cos * strafe) * speed;
    const dz = (-cos * forward - sin * strafe) * speed;

    if (!checkWallCollision(player.x + dx, player.z)) player.x += dx;
    if (!checkWallCollision(player.x, player.z + dz)) player.z += dz;

    if (keys['Space'] && player.onGround) {
      player.vy = 7.5;
      player.onGround = false;
    }
    player.vy -= 20 * dt;
    player.y += player.vy * dt;
    if (player.y <= 1.6) {
      player.y = 1.6;
      player.vy = 0;
      player.onGround = true;
    }

    if (now - lastSync > 50 && myRef) {
      lastSync = now;
      set(myRef, {
        x: Number(player.x.toFixed(2)),
        y: Number((player.y - 0.8).toFixed(2)),
        z: Number(player.z.toFixed(2)),
        yaw: Number(player.yaw.toFixed(2))
      });
    }

    crystals.forEach(c => {
      if (c.visible && Math.hypot(player.x - c.position.x, player.z - c.position.z) < 1.1) {
        c.visible = false;
        score++;
        document.getElementById('score').textContent = score;
        if (score === crystals.length) endGame('🎉 Wygrałeś! Zebrałeś wszystkie kryształy!');
      }
    });

    guards.forEach(g => {
      const offset = Math.sin(now * 0.001 * g.speed) * g.range;
      if (g.axis === 'x') g.mesh.position.x = g.startX + offset;
      else g.mesh.position.z = g.startZ + offset;

      if (Math.hypot(player.x - g.mesh.position.x, player.z - g.mesh.position.z) < 0.95) {
        lives--;
        document.getElementById('lives').textContent = lives;
        player.x = 0; player.z = 0;
        if (lives <= 0) endGame('💀 Koniec gry! Złapali Cię strażnicy.');
      }
    });
  }

  camera.position.set(player.x, player.y, player.z);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = player.yaw;
  camera.rotation.x = player.pitch;

  renderer.render(scene, camera);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

animate(performance.now());
