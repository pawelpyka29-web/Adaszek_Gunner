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

// --- SCENA THREE.JS (ZAMEK ARENA) ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1c23);
scene.fog = new THREE.Fog(0x1a1c23, 15, 65);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5));
const sun = new THREE.DirectionalLight(0xfff5e6, 1.8);
sun.position.set(10, 25, 10);
sun.castShadow = true;
scene.add(sun);

const mat = (color, roughness = 0.7) => new THREE.MeshStandardMaterial({ color, roughness });
const floorMat = mat(0x2c323d), wallMat = mat(0x404859), stoneMat = mat(0x525c6e);
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

// Podłoga zamku (arena 40x40)
block(0, -0.5, 0, 40, 1, 40, floorMat, false);

// Mury zamkowe zewnętrzne
block(0, 3, -20, 40, 6, 1, wallMat);
block(0, 3, 20, 40, 6, 1, wallMat);
block(-20, 3, 0, 1, 6, 40, wallMat);
block(20, 3, 0, 1, 6, 40, wallMat);

// Filarowe przeszkody wewnątrz zamku
[
  [-10, -10, 4, 4], [10, -10, 4, 4], [-10, 10, 4, 4], [10, 10, 4, 4],
  [0, -10, 8, 2], [0, 10, 8, 2], [-10, 0, 2, 8], [10, 0, 2, 8]
].forEach(([x, z, w, d]) => block(x, 2, z, w, 4, d, stoneMat));

const spawnPoints = [
  { x: -15, z: -15 }, { x: 15, z: -15 },
  { x: -15, z: 15 }, { x: 15, z: 15 },
  { x: 0, z: -12 }, { x: 0, z: 12 }
];

function getRandomSpawn() {
  const sp = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
  return { x: sp.x, z: sp.z };
}

// --- TWORZENIE BARDZIEJ SZCZEGÓŁOWEGO MODELU GRACZA ---
function createPlayerModel() {
  const group = new THREE.Group();
  
  // Tułów
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.4), mat(0x2196f3));
  torso.position.y = 0.5;
  torso.castShadow = true;
  group.add(torso);

  // Głowa
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), mat(0xffccbc));
  head.position.y = 1.2;
  head.castShadow = true;
  group.add(head);

  // Broń trzymana przez postać
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.8), mat(0x222222));
  gun.position.set(0.3, 0.4, -0.4);
  group.add(gun);

  return group;
}

// --- WIDOCZNA BROŃ FPS DLA CIEBIE ---
const weaponGroup = new THREE.Group();
const weaponMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.6), mat(0x333333));
weaponMesh.position.set(0.3, -0.3, -0.5);
weaponGroup.add(weaponMesh);
camera.add(weaponGroup);
scene.add(camera);

// --- ZARZĄDZANIE POKOJAMI I FIREBASE ---
const otherPlayers = {};
let score = 0;
let playerLives = 3;

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
  if (myRef) remove(myRef);
  if (unsubPlayers) unsubPlayers();
  if (unsubBullets) unsubBullets();

  for (const id in otherPlayers) {
    scene.remove(otherPlayers[id]);
    delete otherPlayers[id];
  }

  currentRoom = roomName.trim() || "arena-glowna";
  document.getElementById('room-name-display').textContent = currentRoom;

  myRef = ref(db, `rooms/${currentRoom}/players/${myId}`);
  playersRef = ref(db, `rooms/${currentRoom}/players`);
  bulletsRef = ref(db, `rooms/${currentRoom}/bullets`);

  const spawn = getRandomSpawn();
  player.x = spawn.x;
  player.z = spawn.z;
  playerLives = 3;
  score = 0;

  onDisconnect(myRef).remove();
  set(myRef, { x: player.x, y: 0.8, z: player.z, yaw: 0, lives: 3, score: 0 });

  unsubPlayers = onValue(playersRef, (snapshot) => {
    const data = snapshot.val() || {};
    const activeIds = Object.keys(data);
    document.getElementById('players-count').textContent = activeIds.length;

    for (const id of activeIds) {
      if (id === myId) continue;
      const pData = data[id];
      if (!otherPlayers[id]) {
        const playerModel = createPlayerModel();
        scene.add(playerModel);
        otherPlayers[id] = playerModel;
      }
      otherPlayers[id].position.set(pData.x, pData.y - 0.4, pData.z);
      otherPlayers[id].rotation.y = pData.yaw || 0;
    }

    for (const id in otherPlayers) {
      if (!data[id]) {
        scene.remove(otherPlayers[id]);
        delete otherPlayers[id];
      }
    }
  });

  // Obsługa pocisków i trafień
  unsubBullets = onValue(bulletsRef, (snapshot) => {
    const data = snapshot.val() || {};
    for (const bId in data) {
      const b = data[bId];
      // Jeśli to pocisk innego gracza i leci blisko Ciebie
      if (b.shooter !== myId) {
        const dist = Math.hypot(player.x - b.x, player.z - b.z);
        if (dist < 1.2 && playerLives > 0) {
          playerLives--;
          document.getElementById('lives').textContent = playerLives;
          
          const sp = getRandomSpawn();
          player.x = sp.x;
          player.z = sp.z;
          
          update(myRef, { lives: playerLives, x: player.x, z: player.z });

          if (playerLives <= 0) {
            endGame('💀 Zostałeś pokonany na zamku!');
          }
        }
      }
    }
  });
}

// --- STEROWANIE I GRA ---
let isPlaying = false;
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
  if (!roomName) { alert('Wpisz nazwę pokoju!'); return; }
  
  joinRoom(roomName);
  document.getElementById('score').textContent = score;
  document.getElementById('lives').textContent = playerLives;
  msgEl.textContent = '';
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

// STRZELANIE PO KLIKNIĘCIU
document.addEventListener('mousedown', () => {
  if (!isPlaying || !bulletsRef) return;
  
  // Stwórz pocisk w bazie z uwzględnieniem kierunku patrzenia
  const bulletData = {
    shooter: myId,
    x: player.x - Math.sin(player.yaw) * 1.5,
    y: player.y,
    z: player.z - Math.cos(player.yaw) * 1.5
  };
  push(bulletsRef, bulletData);

  // Efekt odrzutu broni
  weaponMesh.position.z += 0.1;
  setTimeout(() => weaponMesh.position.z = -0.5, 100);
});

function checkWallCollision(nx, nz) {
  const r = 0.45;
  for (const s of solids) {
    if (Math.abs(nx - s.x) < s.w / 2 + r && Math.abs(nz - s.z) < s.d / 2 + r) return true;
  }
  return false;
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

  if (isPlaying) {
    const speed = (keys['ShiftLeft'] ? 8 : 5) * dt;
    const forward = (keys['KeyW'] ? 1 : 0) - (keys['KeyS'] ? 1 : 0);
    const strafe = (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0);

    const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
    const dx = (-sin * forward + cos * strafe) * speed;
    const dz = (-cos * forward - sin * strafe) * speed;

    if (!checkWallCollision(player.x + dx, player.z)) player.x += dx;
    if (!checkWallCollision(player.x, player.z + dz)) player.z += dz;

    if (keys['Space'] && player.onGround) {
      player.vy = 7;
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
        yaw: Number(player.yaw.toFixed(2)),
        lives: playerLives,
        score: score
      });
    }
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
