import { Renderer } from "./renderer.js";
import { Game } from "./game.js";
import { PlayerInfo } from "./playerInfo.js";
import { GameMap } from "./gameMap.js";
import { gameCols, gameRows, stepIntervalMs } from "./constants.js";

const canvas = document.getElementById("canvas");
const game = new Game(new GameMap(gameCols, gameRows));
const player = new PlayerInfo(0, undefined);
const renderer = new Renderer(game, canvas.getContext("2d"));

//Set a new player
game.set(1, player);
game.addNewShape(1);

//Render loop
const loop = () => {
  renderer.render();
  window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
setInterval(() => {
  game.step();
}, stepIntervalMs);
