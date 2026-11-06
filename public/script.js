
const socket = io();

let currentCode = null;
let isHost = false;

function getNick() {
    return document.getElementById("nick").value.trim() || "Gracz";
}

function createRoom() {
    socket.emit("createRoom", getNick());
}

function joinRoom() {
    const code = document.getElementById("roomCode").value.trim();

    if (!code) {
        showMessage("Wpisz kod pokoju!");
        return;
    }

    socket.emit("joinRoom", {
        code,
        nick: getNick()
    });
}

socket.on("roomCreated", code => {
    currentCode = code;
    showLobby();
});

socket.on("joinedRoom", code => {
    currentCode = code;
    showLobby();
});

socket.on("roomUpdate", data => {
    currentCode = data.code;
    isHost = data.host === socket.id;

    document.getElementById("code").textContent = data.code;

    const list = document.getElementById("players");
    list.innerHTML = "";

    data.players.forEach(player => {
        const li = document.createElement("li");

        li.textContent = player.nick +
            (player.id === data.host ? " 👑 HOST" : "");

        list.appendChild(li);
    });

    document.getElementById("startButton").style.display =
        isHost && !data.started ? "block" : "none";

    document.getElementById("status").textContent =
        `${data.players.length}/8 graczy w pokoju`;
});

function showLobby() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("lobby").style.display = "block";
    document.getElementById("message").textContent = "";
}

function startGame() {
    if (isHost) {
        socket.emit("startGame");
    }
}

socket.on("gameStarted", () => {
    document.getElementById("lobby").style.display = "none";
    document.getElementById("game").style.display = "block";
});

function copyCode() {
    if (currentCode) {
        navigator.clipboard.writeText(currentCode);
        showMessage("Skopiowano kod pokoju!");
    }
}

function showMessage(message) {
    document.getElementById("message").textContent = message;
}

socket.on("errorMessage", message => {
    showMessage(message);
});
