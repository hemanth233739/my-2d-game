const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  players[socket.id] = { x: 0, y: 0, z: 0, rotation: 0 };
  io.emit("updatePlayers", players);

  socket.on("move", (data) => {
    if (players[socket.id]) {
      players[socket.id] = data;
      io.emit("updatePlayers", players);
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
