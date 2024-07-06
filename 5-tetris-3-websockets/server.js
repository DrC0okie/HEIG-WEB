import express from "express";
import expressWs from "express-ws";
import { gameCols, gameRows, port, stepIntervalMs } from "./src/constants.js";
import { Game } from "./src/game.js";
import { GameMap } from "./src/gameMap.js";
import { PlayerInfo } from "./src/playerInfo.js";
import {
  JoinMessage,
  MessageCodec,
  SetPlayerMessage,
  UpdateMapMessage,
} from "./src/messages.js";

const app = express();
expressWs(app);

let lastId = 0;
const connectedPlayers = new Map();

const sendMessage = (socket, msg) => {
  socket.send(MessageCodec.encode(msg));
};

const sender = (msg) => {
  connectedPlayers.forEach((socket) => sendMessage(socket, msg));
};

const onGameOver = () => {
  connectedPlayers.clear();
  lastId = 0;
};

// Create a new Game instance and start a game loop
const gameMap = new GameMap(gameCols, gameRows);
const game = new Game(gameMap, sender, onGameOver);

setInterval(() => {
  game.step();
  for (const [id] of connectedPlayers) {
    game.sendMessage(new SetPlayerMessage(game.get(id)));
  }
}, stepIntervalMs);

// Serve the public directory
app.use(express.static("public"));

// Serve the src directory
app.use("/src", express.static("src"));

// Websocket game events
app.ws("/", (socket) => {
  const currentID = lastId++;
  connectedPlayers.set(currentID, socket);
  sendMessage(socket, new JoinMessage(currentID));

  game.introduceNewPlayer(new PlayerInfo(currentID));
  game.sendMessage(new UpdateMapMessage(game.map));

  socket.on("message", (msg) => {
    let decodedMsg = MessageCodec.decode(msg);
    game.onMessage(currentID, decodedMsg);
  });

  socket.on("close", () => {
    connectedPlayers.delete(currentID);
    game.quit(currentID);
    console.log("Player " + currentID + "left.");
  });
});

app.listen(port);

console.log("App started.");
