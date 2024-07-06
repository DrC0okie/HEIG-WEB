import { Shape } from "./shape.js";
import { GameMap } from "./gameMap.js";
import { PlayerInfo } from "./playerInfo.js";

/**
 * Parent class for all messages used to communicate between server and client.
 */
export class Message {
  constructor(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }
}

/**
 * Message describing a request by the client to rotate their shape
 */
export class RotateMessage extends Message {
  getDirection() {
    return this.getData();
  }
}

/**
 * Message describing a request by the client to move their shape.
 */
export class MoveMessage extends Message {
  getCol() {
    return this.getData();
  }
}

/**
 * Message describing a request by the client to drop their shape.
 */
export class DropMessage extends Message { }

/**
 * Message describing a notification by the server of a player's new state.
 */
export class SetPlayerMessage extends Message {
  /**
   * @returns {Shape} An instance of Shape describing the player's shape.
   */
  getShape() {
    const s = this.getData().shape;
    return new Shape(s.shapeType, s.playerId, s.col, s.row, s.rotation);
  }

  getPlayerId() {
    return this.getData().id;
  }

  getClearedLines() {
    return this.getData().clearedLines;
  }

  /**
   * @returns {PlayerInfo} An instance of PlayerInfo describing the player's new state, including all fields of the class in the correct type.
   */
  getPlayer() {
    return new PlayerInfo(
      this.getPlayerId(),
      this.getShape(),
      this.getClearedLines()
    );
  }
}

/**
 * Message describing a notification by the server of a player's removal.
 */
export class RemovePlayerMessage extends Message {
  getPlayerId() {
    return this.getData();
  }
}

/**
 * Message describing a notification by the server of a new game map state.
 */
export class UpdateMapMessage extends Message {
  getMap() {
    const data = this.getData();
    const gm = new GameMap(data.width, data.height);
    gm.map = data.map;
    return gm;
  }
}

/**
 * Message describing a notification by the server that the game is over.
 */
export class GameOverMessage extends Message { }

/**
 * Message describing a notification by the server that a new player has joined.
 */
export class JoinMessage extends Message {
  getPlayerId() {
    return this.getData();
  }
}

/**
 * Codec for encoding and decoding messages.
 */
export class MessageCodec {
  static types = {
    MoveMessage,
    RotateMessage,
    DropMessage,
    SetPlayerMessage,
    RemovePlayerMessage,
    UpdateMapMessage,
    JoinMessage,
    GameOverMessage,
  };

  /**
   * Encodes a message into a string in JSON format.
   */
  static encode(message) {
    // encode the message into a string in JSON format
    return JSON.stringify({
      type: message.constructor.name,
      data: message.getData(),
    });
  }

  /**
   * Decodes a message from a string in JSON format into an instance of the corresponding message class.
   * @param {String} string The string to be decoded.
   * @returns {Message} An instance of the corresponding message class.
   */
  static decode(string) {
    // decode the string into an object, ensuring that this object is an instance of the correct message class
    const msg = JSON.parse(string);
    const MessageType = MessageCodec.types[msg.type];

    if ("data" in msg) {
      return new MessageType(msg.data);
    }

    return new MessageType();
  }
}
