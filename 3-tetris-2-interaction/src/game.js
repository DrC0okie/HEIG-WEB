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
  forEachShape(f) {
    this.forEach((p) => f(p.shape));
  }

  /**
   * Moves the given shape to the given column, if possible.
   * @param {Number} id The id of the player whose shape should be moved.
   * @param {Number} col The column to which the shape should be moved.
   */
  moveShape(id, col) {
    let shape = this.getShape(id);
    if (this.map.testShape(shape, shape.row, col)) {
      shape.col = col;
    }
  }

  /**
   * Rotates the given shape in the given direction, if possible.
   * @param {Number} id The id of the player whose shape should be rotated.
   * @param {String} rotation The direction of the rotation, either "left" or "right"
   */
  rotateShape(id, rotation) {
    let shape = this.getShape(id);
    const direction = (rotation === "left") ? 3 : 1
    rotation = (shape.rotation + direction) % 4

    let new_rotation = shape.rotation + direction;
    if (new_rotation < 0) {
      new_rotation += shapeTypes[shape.shapeType].length;
    }
    if (this.map.testShape(shape, shape.row, shape.col, rotation)) {
      shape.rotation = rotation
    }
  }

  /**
   * Tries to drop the given player's shape, i.e. move it down until it touches something if necessary, and then fixing it onto the map.
   * @param {Number} playerId The id of the player whose shape should be dropped
   */
  dropShape(playerId) {
    let player = this.get(playerId);
    if (player === undefined) {
      console.log("Cannot find player " + playerId + "; ignoring");
      return;
    }

    let shape = player.shape;
    if (shape === undefined) {
      console.log(
        "Shape " + playerId + " does not exist; cannot drop it; ignoring"
      );
      return;
    }

    this.map.dropShape(shape);

    const count = this.map.clearFullRows();

    // Replace this shape and any overlapping falling
    this.addNewShape(player.id);

    this.forEach((p, id) => {
      let shape = p.shape;
      if (shape !== undefined && id != player.id) {
        if (!this.map.testShape(shape)) {
          this.addNewShape(id);
        }
      }
    });
  }

  /**
   * Advances the game by one step, i.e. moves all shapes down by one, drops any shape that was touching the ground, and replace it with a new one.
   */
  step() {
    if (this.isGameOver) {
      console.log("Game over, not stepping");
      return;
    }

    let toDrop = [];

    // Move all shapes
    for (let player of this.values()) {
      const shape = player.shape;
      if (shape === undefined) {
        continue;
      }
      let row = shape.row;
      if (row === undefined) {
        console.log("Invalid coordinates for shape. Ignoring it.");
        return;
      }
      // If they can move down, move them down
      if (this.map.testShape(shape, row + 1)) {
        shape.row++;
      } else {
        // If they cannot move down, ground them
        toDrop.push(shape);
        continue;
      }
    }

    toDrop.forEach((shape) => {
      let id = shape.playerId;
      if (this.map.testShape(shape)) {
        this.dropShape(id);
      } else {
        console.log(
          "Shape was not droppable, doing nothing because assuming that a previous `dropShape` has reset it."
        );
      }
    });
  }

  /**
   * Replace current shape of given player id (if any) with a new random shape.
   * @param {Number} id Id of the player whose shape should be replaced.
   */
  addNewShape(id) {
    let col = parseInt(this.map.width / 2);
    let shapeType = Shape.getRandomShapeType();
    let shape = new Shape(shapeType, id, col, 0, 0);
    let player = this.get(id);
    if (player !== undefined) {
      player.shape = shape;
    } else {
      throw "Cannot find player with id " + id;
    }

    if (!this.map.testShape(shape)) {
      this.gameOver();
    }
  }

  /**
   * Resets the game upon game over.
   */
  gameOver() {
    this.isGameOver = true;
    this.clear();
    this.map = new GameMap(gameCols, gameRows);
  }

  /**
   * Handles an incoming message.
   * @param {Number} playerId The id of the player that sent this message.
   * @param {Message} message The message to be handled.
   */
  onMessage(playerId, message) {
    if (!message) {
      console.error("Received undefined message.");
      return;
    }
    const messageType = message.constructor.name;
    switch (messageType) {
      case "RotateMessage":
        this.rotateShape(playerId, message.getDirection());
        break;
      case "DropMessage":
        this.dropShape(playerId);
        break;
      case "MoveMessage":
        this.moveShape(playerId, message.getCol());
        break;
      default:
        console.warn("Unhandled message type:", messageType);
    }
  }
}
