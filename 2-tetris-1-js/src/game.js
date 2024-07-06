import { gameRows, gameCols } from "./constants.js";
import { Shape } from "./shape.js";
import { GameMap } from "./gameMap.js";

export class Game extends Map {
  constructor(gameMap) {
    super();
    this.map = gameMap;
    this.isGameOver = false;
  }

  /**
   * Returns shape of given player, or undefined if no such player or shape.
   * @param {Number} id Id of the player whose shape is to be returned.
   */
  getShape(id) {
    return this.get(id)?.shape;
  }

  /**
   * Executes the provided function on each shape in the game.
   * @param {Function} f The function to be executed. It takes a shape as unique parameters, and its return value is ignored.
   */
  forEachShape(callback) {
    this.forEach(player => callback(player.shape));
  }

  /**
   * Tries to drop the given player's shape, i.e. move it down until it touches something if necessary, and then fixing it onto the map.
   * @param {Number} playerId The id of the player whose shape should be dropped
   */
  dropShape(playerId) {
    const player = this.getPlayerOrThrow(playerId);
    this.map.dropShape(player.shape);
    this.map.clearFullRows();
    this.addNewShape(playerId);
    this.replaceOverlappingShapes(playerId);
  }

  /**
   * Advances the game by one step, i.e. moves all shapes down by one, drops any shape that was touching the ground, and replace it with a new one.
   */
  step() {
    if (this.isGameOver) {
      console.log("Game over");
      return;
    }

    let toBeDropped = [];

    // Move all shapes
    for (let player of this.values()) {
      const shape = player.shape;
      if (shape === undefined) {
        continue;
      }
      let row = shape.row;
      if (row === undefined) {
        console.log("Invalid coordinates for shape");
        return;
      }
      // If they can move down, move them down
      if (this.map.testShape(shape, row + 1)) {
        shape.row++;
      } else {
        // If they cannot move down, ground them
        toBeDropped.push(shape);
        continue;
      }
    }

    toBeDropped.forEach((shape) => {
      if (this.map.testShape(shape)) {
        this.dropShape(shape.playerId);
      } else {
        console.log("Shape is not droppable");
      }
    });
  }

  /**
   * Replace current shape of given player id (if any) with a new random shape.
   * @param {Number} id Id of the player whose shape should be replaced.
   */
  addNewShape(id) {
    const player = this.getPlayerOrThrow(id);
    player.shape = new Shape(Shape.getRandomShapeType(), id, Math.floor(this.map.width / 2), 0, 0);

    if (!this.map.testShape(player.shape)) this.gameOver();
  }

  /**
   * Resets the game upon game over.
   */
  gameOver() {
    this.isGameOver = true;
    this.clear();
    this.map = new GameMap(gameCols, gameRows);
  }


  getPlayerOrThrow(id) {
    const player = this.get(id);
    if (!player) throw new Error(`Player ${id} not found`);
    return player;
  }

  replaceOverlappingShapes(excludedPlayerId) {
    this.forEach((player, playerId) => {
      if (playerId !== excludedPlayerId && !this.map.testShape(player.shape)) {
        this.addNewShape(playerId);
      }
    });
  }
}
