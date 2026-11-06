
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};

function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code;

    do {
        code = "";
        for (let i = 0; i < 5; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
    } while (rooms[code]);

    return code;
}

function updateRoom(code) {
    const room = rooms[code];
    if (!room) return;

    io.to(code).emit("roomUpdate", {
        code,
        host: room.host,
        started: room.started,
        players: room.players.map(p => ({
            id: p.id,
            nick: p.nick
        }))
    });
}

io.on("connection", socket => {

    socket.on("createRoom", nick => {
        nick = String(nick || "Gracz").trim().slice(0, 20);

        if (!nick) nick = "Gracz";

        const code = generateCode();

        rooms[code] = {
            host: socket.id,
            started: false,
            players: [{
                id: socket.id,
                nick
            }]
        };

        socket.join(code);
        socket.data.room = code;

        socket.emit("roomCreated", code);
        updateRoom(code);
    });

    socket.on("joinRoom", ({ code, nick }) => {
        code = String(code || "").trim().toUpperCase();
        nick = String(nick || "Gracz").trim().slice(0, 20);

        const room = rooms[code];

        if (!room) {
            socket.emit("errorMessage", "Pokój nie istnieje!");
            return;
        }

        if (room.started) {
            socket.emit("errorMessage", "Gra już się rozpoczęła!");
            return;
        }

        if (room.players.length >= 8) {
            socket.emit("errorMessage", "Pokój jest pełny!");
            return;
        }

        if (!nick) nick = "Gracz";

        room.players.push({
            id: socket.id,
            nick
        });

        socket.join(code);
        socket.data.room = code;

        socket.emit("joinedRoom", code);
        updateRoom(code);
    });

    socket.on("startGame", () => {
        const code = socket.data.room;
        const room = rooms[code];

        if (!room || room.host !== socket.id) return;

        room.started = true;

        io.to(code).emit("gameStarted");
        updateRoom(code);
    });

    socket.on("disconnect", () => {
        const code = socket.data.room;
        const room = rooms[code];

        if (!room) return;

        room.players = room.players.filter(p => p.id !== socket.id);

        if (room.players.length === 0) {
            delete rooms[code];
            return;
        }

        if (room.host === socket.id) {
            room.host = room.players[0].id;
        }

        updateRoom(code);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
