import { Shape } from "./shape.js";
import {
  MessageCodec,
  SetPlayerMessage,
  UpdateMapMessage,
  RemovePlayerMessage,
  GameOverMessage,
} from "./messages.js";
import { scorePerLine } from "./constants.js";

/**
 * A game of Tetris that can be drawn by a renderer.
 */
export class DrawableGame extends Map {
  constructor(gameMap) {
    super();
    this.map = gameMap;
  }

  /**
   * Returns shape of given player, or undefined if no such player or shape.
   * @param {Number} id Id of the player whose shape is to be returned.
   */
  getShape(id) {
    return this.get(id)?.getShape();
  }

  /**
   * Executes the provided function on each shape in the game.
   * @param {Function} f The function to be executed. It takes a shape as unique parameters, and its return value is ignored.
   */
  forEachShape(f) {
    this.forEach((p) => f(p.getShape()));
  }

  /**
   * Computes and returns the total scores of every player in the game.
   *
   * The total score of a player is {@link scorePerLine} times the number of lines they have cleared, minus the number of blocks belonging to them that are still on the map.
   */
  getTotalScores() {
    const scores = new Map();
    const bpp = this.map.getBlocksPerPlayer();
    bpp.forEach((blocks, key) => {
      scores.set(key, -blocks);
    });

    this.forEach((pInfo, key) => {
      const currentScore = scores.get(key) || 0;
      scores.set(key, currentScore + pInfo.getClearedLines() * scorePerLine);
    });

    return scores;
  }
}

/**
 * A game of Tetris that lives on the server and handles the game logic.
 */
export class Game extends DrawableGame {
  /**
   *
   * @param {GameMap} gameMap The map on which the game is played.
   * @param {Function} messageSender A function that will broadcast any message passed to it to all connected players.
   * @param {Function} onGameOver A function that will be called when the game is over.
   */
  constructor(gameMap, messageSender, onGameOver) {
    super(gameMap);
    this.onGameOver = onGameOver;
    this.sendMessage = messageSender;
  }

  /**
   * Helper method to get the player and shape of a given id.
   */
  getPlayerShape(id) {
    const player = this.get(id);
    const shape = player?.getShape();
    if (shape === undefined) {
      throw new Error(`Shape ${id} does not exist`);
    }
    return { player, shape };
  }

  /**
   * Moves the given shape to the given column, if possible.
   * @param {Number} id The id of the player whose shape should be moved.
   * @param {Number} col The column to which the shape should be moved.
   */
  moveShape(id, col) {
    const { player, shape } = this.getPlayerShape(id);
    if (this.map.testShape(shape, shape.row, col)) {
      shape.col = col;
      this.sendMessage(new SetPlayerMessage(player));
    }
  }

  /**
   * Rotates the given shape in the given direction, if possible.
   * @param {Number} id The id of the player whose shape should be rotated.
   * @param {String} rotation The direction of the rotation, either "left" or "right"
   */
  rotateShape(id, rotation) {
    const { player, shape } = this.getPlayerShape(id);
    rotation = (shape.rotation + (rotation === "left" ? 3 : 1)) % 4;
    if (this.map.testShape(shape, shape.row, shape.col, rotation)) {
      shape.rotation = rotation;
      this.sendMessage(new SetPlayerMessage(player));
    }
  }

  /**
   * Tries to drop the given player's shape, i.e. move it down until it touches something if necessary, and then fixing it onto the map.
   * @param {Number} playerId The id of the player whose shape should be dropped
   */
  dropShape(playerId) {
    const player = this.get(playerId);
    if (player === undefined) {
      console.log(`Cannot find player ${playerId}; ignoring`);
      return;
    }

    const { shape } = player;
    if (shape === undefined) {
      console.log(`Shape ${playerId} does not exist; cannot drop it; ignoring`);
      return;
    }

    this.map.dropShape(shape);
    player.clearedLines += this.map.clearFullRows();
    this.sendMessage(new UpdateMapMessage(this.map));

    // Replace this shape and any overlapping falling
    this.addNewShape(player.id);

    this.forEach((p, id) => {
      const { shape } = p;
      if (shape !== undefined && id !== player.id) {
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
    const toDrop = [];

    // Move all shapes
    for (const player of this.values()) {
      const { shape } = player;
      if (shape === undefined) {
        continue;
      }
      const { row } = shape;
      if (row === undefined) {
        console.log("Invalid coordinates for shape. Ignoring it.");
        return;
      }
      // If they can move down, move them down
      if (this.map.testShape(shape, row + 1)) {
        shape.row++;
        this.sendMessage(new SetPlayerMessage(this.get(shape.playerId)));
      } else {
        // If they cannot move down, ground them
        toDrop.push(shape);
        continue;
      }
    }

    toDrop.forEach((shape) => {
      const id = shape.playerId;
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
   * Informs the game that a new player has joined, and gives them a new shape.
   *
   * @param {PlayerInfo} player The player that has joined. If it has a shape, it will be overwritten by a new random one.
   */
  introduceNewPlayer(player) {
    // ensure that that player does not already exist, then add it to the game and give it a new shape.
    if (!this.get(player.getId())) {
      this.set(player.getId(), player);
      this.addNewShape(player.getId());
    }
  }

  /**
   * Replace current shape of given player id (if any) with a new random shape.
   * @param {Number} id Id of the player whose shape should be replaced.
   */
  addNewShape(id) {
    const col = Math.floor(this.map.width / 2);
    const shapeType = Shape.getRandomShapeType();
    const shape = new Shape(shapeType, id, col, 0, 0);
    const player = this.get(id);
    if (!player) {
      throw new Error(`Cannot find player with id ${id}`);
    }
    player.shape = shape;
    this.sendMessage(new SetPlayerMessage(this.get(id)));
    if (!this.map.testShape(shape)) {
      this.gameOver();
    }
  }

  /**
   * Resets the game upon game over.
   */
  gameOver() {
    this.sendMessage(new GameOverMessage());
    this.clear();
    this.map.clear();
    this.onGameOver();
  }

  /**
   * Handles an incoming message.
   * @param {Number} playerId The id of the player that sent this message.
   * @param {Message} message The message to be handled.
   */
  onMessage(playerId, message) {
    switch (message.constructor.name) {
      case "RotateMessage":
        this.rotateShape(playerId, message.getDirection());
        break;
      case "MoveMessage":
        this.moveShape(playerId, message.getCol());
        break;
      case "DropMessage":
        this.dropShape(playerId);
        break;
      default:
        throw new Error(`Unknown message type: ${message.constructor.name}`);
    }
  }

  /**
   * Informs the game that a player has left. The game will then remove the player from the game.
   *
   * @param {number} playerId The id of the player that has left.
   */
  quit(playerId) {
    this.delete(playerId);
    this.sendMessage(new RemovePlayerMessage(playerId));
  }
}

/**
 * A Tetris game that lives on the client and is only responsible for remaining in sync with the server's instance of the game.
 */
export class Replica extends DrawableGame {
  /**
   * Handles incoming messages from the server.
   * @param {Message} message The message to be handled.
   */
  onMessage(message) {
    if (message instanceof MessageCodec.types.SetPlayerMessage) {
      this.set(message.getPlayerId(), message.getPlayer());
    }
    if (message instanceof MessageCodec.types.UpdateMapMessage) {
      this.map = message.getMap();
    }
    if (message instanceof MessageCodec.types.RemovePlayerMessage) {
      this.delete(message.getPlayerId());
    }
    if (message instanceof MessageCodec.types.GameOverMessage) {
      this.gameOver();
    }
  }

  /**
   * Displays a popup informing the player that the game is over, and the id of the winning player, along with their score.
   */
  gameOver() {
    const scores = new Map(
      [...this.getTotalScores()].sort((a, b) => b[1] - a[1])
    );
    const [[id, score]] = [...scores.entries()];
    alert(`Player ${id} wins! Score: ${score}`);
  }
}
