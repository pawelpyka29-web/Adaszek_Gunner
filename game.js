import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    update,
    onValue,
    onDisconnect,
    remove,
    get
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// ======================================================
// FIREBASE - KONFIGURACJA (BEZ ZMIAN)
// ======================================================

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ======================================================
// USTAWIENIA GRY 2D (NEON PARKOUR)
// ======================================================

let canvas, ctx;
let myId = crypto.randomUUID();
let myName = "Player";
let roomName = "arena1";
let myRef;

let playing = false;
let dead = false;
let health = 100;
let score = 0; // Wyświetlane w polu KILLS jako punkty
let deaths = 0;

let lastSync = 0;
let invulnerableTimer = 0;

const remotePlayers = {};
const keys = {};
const particles = [];

// Fizyka i wymiary świata 2D
const WORLD_W = 2400;
const WORLD_H = 1000;
const GRAVITY = 1650;
const MOVE_SPEED = 420;
const SPRINT_SPEED = 700;
const JUMP_FORCE = -680;

const player = {
    x: 200,
    y: 700,
    w: 36,
    h: 48,
    vx: 0,
    vy: 0,
    onGround: false,
    jumpsLeft: 2,
    color: "#00eaff"
};

let camera = { x: 0, y: 0 };

// Platformy na arenie
const platforms = [
    // Podłoga i ściany
    { x: 0, y: 920, w: WORLD_W, h: 80 },
    { x: 0, y: 0, w: 40, h: WORLD_H },
    { x: WORLD_W - 40, y: 0, w: 40, h: WORLD_H },

    // Poziom 1
    { x: 250, y: 780, w: 260, h: 24 },
    { x: 650, y: 740, w: 220, h: 24 },
    { x: 1050, y: 790, w: 300, h: 24 },
    { x: 1500, y: 730, w: 250, h: 24 },
    { x: 1900, y: 780, w: 280, h: 24 },

    // Poziom 2
    { x: 420, y: 600, w: 240, h: 24 },
    { x: 850, y: 560, w: 280, h: 24 },
    { x: 1300, y: 580, w: 240, h: 24 },
    { x: 1720, y: 540, w: 260, h: 24 },

    // Poziom 3 (Górny)
    { x: 200, y: 420, w: 220, h: 24 },
    { x: 640, y: 390, w: 260, h: 24 },
    { x: 1100, y: 410, w: 300, h: 24 },
    { x: 1550, y: 370, w: 250, h: 24 },
    { x: 1980, y: 420, w: 220, h: 24 }
];

// Ruchome przeszkody laserowe
const hazards = [
    { x: 520, y: 880, w: 80, h: 16, minX: 450, maxX: 850, vx: 220 },
    { x: 1350, y: 880, w: 100, h: 16, minX: 1200, maxX: 1750, vx: -280 },
    { x: 900, y: 520, w: 16, h: 80, minY: 440, maxY: 660, vy: 160 },
    { x: 1600, y: 500, w: 16, h: 80, minY: 400, maxY: 640, vy: -190 },
    { x: 1150, y: 360, w: 90, h: 16, minX: 1050, maxX: 1400, vx: 250 }
];

// Kryształ energii do zbierania (lokalny cel)
let gem = { x: 800, y: 680, r: 14 };

// Elementy interfejsu z index.html
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
const crosshair = document.getElementById("crosshair");

// ======================================================
// START GRY
// ======================================================

playButton.addEventListener("click", async () => {
    myName = nicknameInput.value.trim() || "Player";
    roomName = roomInput.value.trim() || "arena1";
    roomName = roomName.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "");
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
    if (existing.exists() && existing.size >= 30) {
        throw new Error("Arena jest pełna (30 graczy).");
    }

    initCanvas();
    spawnGem();

    const colors = ["#00eaff", "#00ff9d", "#ff477e", "#ffd166", "#bd93f9"];
    player.color = colors[Math.floor(Math.random() * colors.length)];

    await set(myRef, {
        name: myName,
        x: player.x,
        y: player.y,
        hp: 100,
        kills: 0,
        deaths: 0,
        alive: true,
        color: player.color,
        updated: Date.now()
    });

    onDisconnect(myRef).remove();

    // Synchronizacja innych graczy
    onValue(ref(db, `rooms/${roomName}/players`), snapshot => {
        if (!playing) return;
        const data = snapshot.val() || {};

        for (const id of Object.keys(remotePlayers)) {
            if (!data[id] || id === myId) {
                delete remotePlayers[id];
            }
        }

        for (const id in data) {
            if (id === myId) continue;
            remotePlayers[id] = data[id];
        }

        updateLeaderboard(data);
    });

    document.getElementById("roomInfo").textContent = "ROOM: " + roomName.toUpperCase() + " | PARKOUR 2D";
    if (crosshair) crosshair.style.display = "none";
    if (lockMessage) lockMessage.style.display = "none";

    menu.classList.add("hidden");
    hud.classList.remove("hidden");
    document.getElementById("loading").classList.add("hidden");

    playing = true;

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    animate();
}

function initCanvas() {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    resize();
    window.addEventListener("resize", resize);
}

function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// ======================================================
// STEROWANIE I LOGIKA ZRĘCZNOŚCIOWA
// ======================================================

function keyDown(e) {
    keys[e.code] = true;

    if ((e.code === "Space" || e.code === "KeyW" || e.code === "ArrowUp") && !dead && playing) {
        e.preventDefault();
        if (player.jumpsLeft > 0) {
            player.vy = JUMP_FORCE;
            player.onGround = false;
            player.jumpsLeft--;
            createParticles(player.x + player.w / 2, player.y + player.h, player.color, 10);
        }
    }
}

function keyUp(e) {
    keys[e.code] = false;
}

function spawnGem() {
    const plat = platforms[Math.floor(Math.random() * (platforms.length - 3)) + 3];
    gem.x = plat.x + 30 + Math.random() * (plat.w - 60);
    gem.y = plat.y - 32;
}

function createParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 300,
            vy: (Math.random() - 0.5) * 300,
            life: 0.4,
            color
        });
    }
}

function rectIntersect(r1, r2) {
    return (
        r1.x < r2.x + r2.w &&
        r1.x + r1.w > r2.x &&
        r1.y < r2.y + r2.h &&
        r1.y + r1.h > r2.y
    );
}

function update(dt) {
    if (invulnerableTimer > 0) invulnerableTimer -= dt;

    // Ruch ruchomych laserów
    for (const h of hazards) {
        if (h.vx) {
            h.x += h.vx * dt;
            if (h.x <= h.minX || h.x + h.w >= h.maxX) h.vx *= -1;
        }
        if (h.vy) {
            h.y += h.vy * dt;
            if (h.y <= h.minY || h.y + h.h >= h.maxY) h.vy *= -1;
        }
    }

    // Cząsteczki
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) particles.splice(i, 1);
    }

    if (dead) return;

    // Sterowanie poziome
    let move = 0;
    if (keys["KeyA"] || keys["ArrowLeft"]) move -= 1;
    if (keys["KeyD"] || keys["ArrowRight"]) move += 1;

    const isSprinting = keys["ShiftLeft"] || keys["ShiftRight"];
    const speed = isSprinting ? SPRINT_SPEED : MOVE_SPEED;

    player.vx = move * speed;
    player.x += player.vx * dt;

    if (isSprinting && move !== 0 && Math.random() < 0.4) {
        createParticles(player.x + player.w / 2, player.y + player.h / 2, player.color, 1);
    }

    // Kolizje poziome
    for (const p of platforms) {
        if (rectIntersect(player, p)) {
            if (player.vx > 0) player.x = p.x - player.w;
            else if (player.vx < 0) player.x = p.x + p.w;
        }
    }

    // Grawitacja i ruch pionowy
    player.vy += GRAVITY * dt;
    player.y += player.vy * dt;
    player.onGround = false;

    for (const p of platforms) {
        if (rectIntersect(player, p)) {
            if (player.vy > 0) {
                player.y = p.y - player.h;
                player.vy = 0;
                player.onGround = true;
                player.jumpsLeft = 2; // Reset podwójnego skoku
            } else if (player.vy < 0) {
                player.y = p.y + p.h;
                player.vy = 0;
            }
        }
    }

    // Zbieranie kryształu energii
    const distToGem = Math.hypot(
        player.x + player.w / 2 - gem.x,
        player.y + player.h / 2 - gem.y
    );

    if (distToGem < player.w / 2 + gem.r + 6) {
        score++;
        killsUI.textContent = score;
        createParticles(gem.x, gem.y, "#ffd166", 18);
        showHitmarker();
        spawnGem();

        if (myRef) {
            update(myRef, { kills: score, updated: Date.now() });
        }
    }

    // Kolizja z laserami
    if (invulnerableTimer <= 0) {
        for (const h of hazards) {
            if (rectIntersect(player, h)) {
                takeDamage(35);
                break;
            }
        }
    }

    // Płynna kamera śledząca gracza
    camera.x = Math.max(0, Math.min(WORLD_W - canvas.width, player.x + player.w / 2 - canvas.width / 2));
    camera.y = Math.max(0, Math.min(WORLD_H - canvas.height, player.y + player.h / 2 - canvas.height / 2));
}

async function takeDamage(amount) {
    health = Math.max(0, health - amount);
    healthUI.textContent = health;
    invulnerableTimer = 0.8;
    player.vy = -420; // Odrzut po dotknięciu lasera
    createParticles(player.x + player.w / 2, player.y + player.h / 2, "#ff3355", 15);

    if (health <= 0 && !dead) {
        dead = true;
        deaths++;
        deathsUI.textContent = deaths;
        respawnUI.classList.remove("hidden");

        if (myRef) {
            await update(myRef, { hp: 0, deaths, alive: false });
        }

        setTimeout(respawnPlayer, 2000);
    }
}

async function respawnPlayer() {
    player.x = 150 + Math.random() * 400;
    player.y = 700;
    player.vx = 0;
    player.vy = 0;
    player.jumpsLeft = 2;

    health = 100;
    healthUI.textContent = health;
    dead = false;
    respawnUI.classList.add("hidden");

    if (myRef) {
        await update(myRef, {
            x: player.x,
            y: player.y,
            hp: 100,
            alive: true
        });
    }
}

function showHitmarker() {
    if (!hitmarkerUI) return;
    hitmarkerUI.style.color = "#ffd166";
    hitmarkerUI.style.opacity = "1";
    setTimeout(() => {
        hitmarkerUI.style.opacity = "0";
    }, 150);
}

// ======================================================
// RYSOWANIE 2D (NEON STYLE)
// ======================================================

function draw() {
    ctx.fillStyle = "#080c18";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Siatka w tle
    ctx.strokeStyle = "#131e33";
    ctx.lineWidth = 1;
    for (let x = 0; x < WORLD_W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, WORLD_H);
        ctx.stroke();
    }
    for (let y = 0; y < WORLD_H; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORLD_W, y);
        ctx.stroke();
    }

    // Platformy
    for (const p of platforms) {
        ctx.fillStyle = "#16243d";
        ctx.fillRect(p.x, p.y, p.w, p.h);

        ctx.fillStyle = "#00eaff";
        ctx.fillRect(p.x, p.y, p.w, 4);
    }

    // Lasery (przeszkody)
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff2a55";
    ctx.fillStyle = "#ff2a55";
    for (const h of hazards) {
        ctx.fillRect(h.x, h.y, h.w, h.h);
    }
    ctx.shadowBlur = 0;

    // Kryształ energii
    const pulse = Math.sin(performance.now() * 0.008) * 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffd166";
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.moveTo(gem.x, gem.y - gem.r - pulse);
    ctx.lineTo(gem.x + gem.r + pulse, gem.y);
    ctx.lineTo(gem.x, gem.y + gem.r + pulse);
    ctx.lineTo(gem.x - gem.r - pulse, gem.y);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cząsteczki
    for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.life * 2.5);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
    }
    ctx.globalAlpha = 1;

    // Inni gracze z Firebase
    for (const id in remotePlayers) {
        const rp = remotePlayers[id];
        if (rp.alive === false) continue;

        drawRunner(rp.x || 0, rp.y || 0, player.w, player.h, rp.color || "#ff477e", rp.name || "Player");
    }

    // Lokalny gracz
    if (!dead) {
        if (invulnerableTimer <= 0 || Math.floor(performance.now() / 80) % 2 === 0) {
            drawRunner(player.x, player.y, player.w, player.h, player.color, myName);
        }
    }

    ctx.restore();
}

function drawRunner(x, y, w, h, color, name) {
    ctx.shadowBlur = 14;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;

    // Wizjer postaci
    ctx.fillStyle = "#080c18";
    ctx.fillRect(x + 6, y + 10, w - 12, 10);

    // Nick nad postacią
    ctx.fillStyle = "white";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(name, x + w / 2, y - 8);
}

// ======================================================
// TABLICA WYNIKÓW I SYNCHRONIZACJA
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
        row.innerHTML = `<span>${i + 1}. ${p.name}</span><span>${p.kills} pkt</span>`;
        leaderboardUI.appendChild(row);
    });
}

async function syncPlayer() {
    if (!playing || dead || !myRef) return;
    try {
        await update(myRef, {
            x: Math.round(player.x),
            y: Math.round(player.y),
            hp: health,
            kills: score,
            deaths,
            alive: true,
            updated: Date.now()
        });
    } catch (err) {
        console.error("Sync:", err);
    }
}

// ======================================================
// PĘTLA GRY
// ======================================================

let lastTime = performance.now();

function animate() {
    if (!playing) return;
    requestAnimationFrame(animate);

    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    update(dt);
    draw();

    if (Date.now() - lastSync > 80) {
        lastSync = Date.now();
        syncPlayer();
    }
}

window.addEventListener("beforeunload", () => {
    if (myRef) remove(myRef);
});
