
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    update,
    onValue,
    onDisconnect,
    remove,
    get
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

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ======================================================
// USTAWIENIA GRY
// ======================================================

let scene, camera, renderer;
let playerMesh;
let gunMesh;
let raycaster;

let myId = crypto.randomUUID();
let myName = "Player";
let roomName = "arena1";
let myRef;

let playing = false;
let dead = false;
let health = 100;
let kills = 0;
let deaths = 0;

let velocityY = 0;
let onGround = true;
let lastShot = 0;
let lastSync = 0;
let lastHitmarker = 0;

const players = {};
const remoteMeshes = {};
const keys = {};
const obstacles = [];

const SPEED = 8;
const SPRINT_SPEED = 13;
const JUMP = 8;
const GRAVITY = 22;
const MAX_HEALTH = 100;
const FIRE_RATE = 170;
const DAMAGE = 35;
const HEAD_DAMAGE = 100;

const PLAYER_HEIGHT = 1.8;
const PLAYER_RADIUS = 0.4;

const spawnPoints = [
    [0, 1, 0],
    [10, 1, 10],
    [-10, 1, 10],
    [10, 1, -10],
    [-10, 1, -10],
    [0, 1, 15],
    [15, 1, 0],
    [-15, 1, 0]
];

const menu = document.getElementById("menu");
const hud = document.getElementById("hud");
const playButton = document.getElementById("play");
const nicknameInput = document.getElementById("nickname");
const roomInput = document.getElementById("room");

const killsUI = document.getElementById("kills");
const deathsUI = document.getElementById("deaths");
const healthUI = document.getElementById("health");
const leaderboardUI = document.getElementById("leaderboardList");

const respawnUI = document.getElementById("respawn");
const hitmarkerUI = document.getElementById("hitmarker");
const lockMessage = document.getElementById("lockMessage");

// ======================================================
// START
// ======================================================

playButton.addEventListener("click", async () => {
    myName = nicknameInput.value.trim() || "Player";
    roomName = roomInput.value.trim() || "arena1";

    roomName = roomName.replace(/[^a-zA-Z0-9_-]/g, "");

    if (!roomName) roomName = "arena1";

    playButton.disabled = true;
    playButton.textContent = "ŁĄCZENIE...";

    try {
        await startGame();
    } catch (err) {
        console.error(err);
        alert("Błąd Firebase: " + err.message);

        playButton.disabled = false;
        playButton.textContent = "GRAJ";
    }
});

async function startGame() {
    myRef = ref(db, `rooms/${roomName}/players/${myId}`);

    const existing = await get(ref(db, `rooms/${roomName}/players`));

    if (existing.exists() && existing.numChildren() >= 30) {
        throw new Error("Arena jest pełna (30 graczy).");
    }

    initScene();
    createArena();
    createPlayer();

    await set(myRef, {
        name: myName,
        x: playerMesh.position.x,
        y: playerMesh.position.y,
        z: playerMesh.position.z,
        rot: 0,
        hp: 100,
        kills: 0,
        deaths: 0,
        alive: true,
        color: Math.floor(Math.random() * 0xffffff),
        updated: Date.now()
    });

    onDisconnect(myRef).remove();

    onValue(ref(db, `rooms/${roomName}/players`), snapshot => {
        if (!playing) return;

        const data = snapshot.val() || {};

        for (const id of Object.keys(remoteMeshes)) {
            if (!data[id] || id === myId) {
                scene.remove(remoteMeshes[id]);
                delete remoteMeshes[id];
            }
        }

        for (const id in data) {
            if (id === myId) continue;

            const p = data[id];

            if (!remoteMeshes[id]) {
                createRemote(id, p);
            }

            const mesh = remoteMeshes[id];

            if (!mesh) continue;

            mesh.visible = p.alive !== false;

            mesh.position.set(
                Number(p.x) || 0,
                Number(p.y) || 1,
                Number(p.z) || 0
            );

            mesh.rotation.y = Number(p.rot) || 0;

            if (mesh.userData.hpBar) {
                mesh.userData.hpBar.scale.x = Math.max(
                    0,
                    Math.min(1, (p.hp || 0) / MAX_HEALTH)
                );
            }

            mesh.userData.playerData = p;
        }

        updateLeaderboard(data);
    });

    onValue(ref(db, `rooms/${roomName}/players/${myId}`), snapshot => {
        const data = snapshot.val();

        if (!data || !playing) return;

        if (data.hp <= 0 && !dead) {
            die();
        }
    });

    document.getElementById("roomInfo").textContent =
        "ROOM: " + roomName.toUpperCase();

    menu.classList.add("hidden");
    hud.classList.remove("hidden");
    document.getElementById("loading").classList.add("hidden");

    playing = true;

    renderer.domElement.addEventListener("click", () => {
        if (!dead && playing) {
            renderer.domElement.requestPointerLock();
        }
    });

    renderer.domElement.addEventListener("mousedown", e => {
        if (e.button === 0 && document.pointerLockElement === renderer.domElement) {
            shoot();
        }
    });

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    document.addEventListener("pointerlockchange", () => {
        lockMessage.style.opacity =
            document.pointerLockElement === renderer.domElement ? "0" : "1";
    });

    animate();
}

// ======================================================
// SCENA
// ======================================================

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080c18);
    scene.fog = new THREE.Fog(0x080c18, 45, 110);

    camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        150
    );

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0x8ecaff, 0x111522, 2));

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(10, 20, 10);
    scene.add(light);

    raycaster = new THREE.Raycaster();

    raycaster.far = 100;

    window.addEventListener("resize", resize);
}

function resize() {
    if (!camera || !renderer) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ======================================================
// ARENA
// ======================================================

function createArena() {
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({
            color: 0x121c2d,
            roughness: 0.8
        })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Linie na podłodze

    const grid = new THREE.GridHelper(100, 50, 0x00eaff, 0x25334b);
    grid.position.y = 0.01;
    scene.add(grid);

    // Ściany

    createBox(100, 8, 1, 0, 4, -50, 0x18243a);
    createBox(100, 8, 1, 0, 4, 50, 0x18243a);
    createBox(1, 8, 100, -50, 4, 0, 0x18243a);
    createBox(1, 8, 100, 50, 4, 0, 0x18243a);

    // Przeszkody

    createBox(8, 4, 8, 0, 2, 0, 0x1b3655);
    createBox(4, 3, 12, -15, 1.5, -10, 0x213d5d);
    createBox(4, 3, 12, 15, 1.5, 10, 0x213d5d);
    createBox(12, 4, 4, 15, 2, -15, 0x1b3655);
    createBox(12, 4, 4, -15, 2, 15, 0x1b3655);

    createBox(6, 5, 6, 25, 2.5, 0, 0x213d5d);
    createBox(6, 5, 6, -25, 2.5, 0, 0x213d5d);
    createBox(6, 5, 6, 0, 2.5, 25, 0x213d5d);
    createBox(6, 5, 6, 0, 2.5, -25, 0x213d5d);

    // Neonowe lampy

    createBox(100, 0.2, 0.2, 0, 7.5, -49, 0x00eaff);
    createBox(100, 0.2, 0.2, 0, 7.5, 49, 0x00eaff);
}

function createBox(w, h, d, x, y, z, color) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({
            color,
            roughness: 0.65
        })
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);

    if (w < 90 && h > 1 && d > 1) {
        obstacles.push(mesh);
    }

    return mesh;
}

// ======================================================
// GRACZ
// ======================================================

function createPlayer() {
    playerMesh = new THREE.Object3D();

    const spawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];

    playerMesh.position.set(spawn[0], spawn[1], spawn[2]);

    scene.add(playerMesh);

    camera.position.set(
        playerMesh.position.x,
        playerMesh.position.y + 0.65,
        playerMesh.position.z
    );

    camera.rotation.order = "YXZ";

    const gun = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.15, 0.6),
        new THREE.MeshStandardMaterial({
            color: 0x1d2a3c,
            metalness: 0.6,
            roughness: 0.3
        })
    );

    body.position.set(0.28, -0.25, -0.55);

    const barrel = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.05, 0.4),
        new THREE.MeshStandardMaterial({
            color: 0x00eaff,
            emissive: 0x00eaff,
            emissiveIntensity: 1.5
        })
    );

    barrel.position.set(0.28, -0.22, -0.9);

    gun.add(body);
    gun.add(barrel);

    camera.add(gun);

    gunMesh = gun;

    scene.add(camera);
}

// ======================================================
// GRACZE ZDALNI
// ======================================================

function createRemote(id, p) {
    const group = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.4, 0.5),
        new THREE.MeshStandardMaterial({
            color: p.color || 0xff3355
        })
    );

    body.position.y = 0.8;

    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.45, 0.45),
        new THREE.MeshStandardMaterial({
            color: 0xffd6b0
        })
    );

    head.position.y = 1.65;

    group.add(body);
    group.add(head);

    // Pasek zdrowia

    const barBackground = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.12, 0.05),
        new THREE.MeshBasicMaterial({
            color: 0x222222
        })
    );

    barBackground.position.y = 2.2;

    const bar = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.12, 0.05),
        new THREE.MeshBasicMaterial({
            color: 0x00ff99
        })
    );

    bar.position.y = 2.2;
    bar.position.z = 0.01;

    group.add(barBackground);
    group.add(bar);

    group.userData.hpBar = bar;
    group.userData.playerData = p;

    scene.add(group);

    remoteMeshes[id] = group;
}

// ======================================================
// MYSZ
// ======================================================

function mouseMove(e) {
    if (!playing || dead) return;

    if (document.pointerLockElement !== renderer.domElement) return;

    camera.rotation.y -= e.movementX * 0.002;
    camera.rotation.x -= e.movementY * 0.002;

    camera.rotation.x = Math.max(
        -Math.PI / 2 + 0.05,
        Math.min(Math.PI / 2 - 0.05, camera.rotation.x)
    );
}

// ======================================================
// RUCH
// ======================================================

function keyDown(e) {
    keys[e.code] = true;

    if (e.code === "Space") {
        e.preventDefault();

        if (onGround && !dead) {
            velocityY = JUMP;
            onGround = false;
        }
    }
}

function keyUp(e) {
    keys[e.code] = false;
}

function updateMovement(delta) {
    if (dead || !playing) return;

    let forward = 0;
    let sideways = 0;

    if (keys["KeyW"]) forward += 1;
    if (keys["KeyS"]) forward -= 1;
    if (keys["KeyA"]) sideways -= 1;
    if (keys["KeyD"]) sideways += 1;

    const speed = keys["ShiftLeft"] || keys["ShiftRight"]
        ? SPRINT_SPEED
        : SPEED;

    const movement = new THREE.Vector3(
        sideways,
        0,
        -forward
    );

    if (movement.length() > 0) {
        movement.normalize();
        movement.multiplyScalar(speed * delta);

        movement.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            camera.rotation.y
        );

        const nextX = playerMesh.position.x + movement.x;
        const nextZ = playerMesh.position.z + movement.z;

        if (!collides(nextX, playerMesh.position.z)) {
            playerMesh.position.x = nextX;
        }

        if (!collides(playerMesh.position.x, nextZ)) {
            playerMesh.position.z = nextZ;
        }
    }

    velocityY -= GRAVITY * delta;
    playerMesh.position.y += velocityY * delta;

    if (playerMesh.position.y <= 1) {
        playerMesh.position.y = 1;
        velocityY = 0;
        onGround = true;
    }

    camera.position.set(
        playerMesh.position.x,
        playerMesh.position.y + 0.65,
        playerMesh.position.z
    );
}

function collides(x, z) {
    if (x < -48 || x > 48 || z < -48 || z > 48) {
        return true;
    }

    for (const obstacle of obstacles) {
        const box = new THREE.Box3().setFromObject(obstacle);

        if (
            x > box.min.x - PLAYER_RADIUS &&
            x < box.max.x + PLAYER_RADIUS &&
            z > box.min.z - PLAYER_RADIUS &&
            z < box.max.z + PLAYER_RADIUS &&
            playerMesh.position.y < box.max.y + 0.2
        ) {
            return true;
        }
    }

    return false;
}

// ======================================================
// STRZELANIE
// ======================================================

async function shoot() {
    if (!playing || dead) return;

    const now = Date.now();

    if (now - lastShot < FIRE_RATE) return;

    lastShot = now;

    raycaster.setFromCamera(
        new THREE.Vector2(0, 0),
        camera
    );

    const targets = [];

    for (const id in remoteMeshes) {
        if (remoteMeshes[id].visible) {
            targets.push(remoteMeshes[id]);
        }
    }

    const hits = raycaster.intersectObjects(targets, true);

    if (!hits.length) return;

    const hit = hits[0];

    let target = hit.object;

    while (target && !target.userData.playerData) {
        target = target.parent;
    }

    if (!target) {
        for (const id in remoteMeshes) {
            let object = hit.object;

            while (object) {
                if (object === remoteMeshes[id]) {
                    target = remoteMeshes[id];
                    break;
                }

                object = object.parent;
            }

            if (target) break;
        }
    }

    if (!target) return;

    let victimId = null;

    for (const id in remoteMeshes) {
        if (remoteMeshes[id] === target) {
            victimId = id;
            break;
        }
    }

    if (!victimId) return;

    const victim = target.userData.playerData;

    if (!victim || victim.alive === false || victim.hp <= 0) return;

    // Headshot

    const isHeadshot = hit.object.geometry.type === "BoxGeometry" &&
        hit.object.position.y > 1.4;

    const damage = isHeadshot ? HEAD_DAMAGE : DAMAGE;

    showHitmarker();

    const victimRef = ref(db, `rooms/${roomName}/players/${victimId}`);

    try {
        const snapshot = await get(victimRef);

        if (!snapshot.exists()) return;

        const data = snapshot.val();

        if (!data || data.hp <= 0 || data.alive === false) return;

        const newHP = Math.max(0, data.hp - damage);

        await update(victimRef, {
            hp: newHP,
            alive: newHP > 0
        });

        if (newHP <= 0) {
            kills++;

            await update(myRef, {
                kills,
                updated: Date.now()
            });

            addKillfeed(myName, data.name);
        }
    } catch (err) {
        console.error("Strzał:", err);
    }
}

function showHitmarker() {
    hitmarkerUI.style.opacity = "1";

    clearTimeout(lastHitmarker);

    lastHitmarker = setTimeout(() => {
        hitmarkerUI.style.opacity = "0";
    }, 120);
}

// ======================================================
// ŚMIERĆ I RESPAWN
// ======================================================

async function die() {
    if (dead) return;

    dead = true;
    deaths++;

    deathsUI.textContent = deaths;
    health = 0;
    healthUI.textContent = 0;

    document.exitPointerLock();

    respawnUI.classList.remove("hidden");

    try {
        await update(myRef, {
            deaths,
            hp: 0,
            alive: false
        });
    } catch (err) {
        console.error(err);
    }

    setTimeout(respawn, 2500);
}

async function respawn() {
    if (!playing) return;

    const spawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];

    playerMesh.position.set(spawn[0], spawn[1], spawn[2]);

    camera.position.set(
        spawn[0],
        spawn[1] + 0.65,
        spawn[2]
    );

    velocityY = 0;
    onGround = true;
    health = MAX_HEALTH;
    dead = false;

    healthUI.textContent = health;

    respawnUI.classList.add("hidden");

    try {
        await update(myRef, {
            x: playerMesh.position.x,
            y: playerMesh.position.y,
            z: playerMesh.position.z,
            hp: MAX_HEALTH,
            alive: true,
            deaths
        });
    } catch (err) {
        console.error(err);
    }

    renderer.domElement.requestPointerLock();
}

// ======================================================
// HUD
// ======================================================

function updateLeaderboard(data) {
    const list = Object.entries(data)
        .map(([id, p]) => ({
            id,
            name: p.name || "Player",
            kills: p.kills || 0
        }))
        .sort((a, b) => b.kills - a.kills)
        .slice(0, 8);

    leaderboardUI.innerHTML = "";

    list.forEach((p, i) => {
        const row = document.createElement("div");
        row.className = "leader-row";

        const name = document.createElement("span");
        name.textContent = `${i + 1}. ${p.name}`;

        const score = document.createElement("span");
        score.textContent = p.kills;

        row.appendChild(name);
        row.appendChild(score);

        leaderboardUI.appendChild(row);
    });
}

function addKillfeed(killer, victim) {
    const entry = document.createElement("div");

    entry.className = "kill-entry";

    entry.textContent = `${killer}  ✕  ${victim}`;

    const feed = document.getElementById("killfeed");

    feed.prepend(entry);

    setTimeout(() => {
        entry.remove();
    }, 4000);
}

// ======================================================
// SYNCHRONIZACJA
// ======================================================

async function syncPlayer() {
    if (!playing || dead || !myRef) return;

    try {
        await update(myRef, {
            x: playerMesh.position.x,
            y: playerMesh.position.y,
            z: playerMesh.position.z,
            rot: camera.rotation.y,
            hp: health,
            kills,
            deaths,
            alive: true,
            updated: Date.now()
        });
    } catch (err) {
        console.error("Sync:", err);
    }
}

// ======================================================
// GŁÓWNA PĘTLA
// ======================================================

let lastTime = performance.now();

function animate() {
    if (!playing) return;

    requestAnimationFrame(animate);

    const now = performance.now();

    let delta = (now - lastTime) / 1000;

    lastTime = now;

    delta = Math.min(delta, 0.05);

    updateMovement(delta);

    if (playerMesh) {
        camera.position.set(
            playerMesh.position.x,
            playerMesh.position.y + 0.65,
            playerMesh.position.z
        );
    }

    // Synchronizacja co ok. 100 ms

    if (Date.now() - lastSync > 100) {
        lastSync = Date.now();
        syncPlayer();
    }

    renderer.render(scene, camera);
}

// ======================================================
// WYJŚCIE
// ======================================================

window.addEventListener("beforeunload", () => {
    if (myRef) {
        remove(myRef);
    }
});


