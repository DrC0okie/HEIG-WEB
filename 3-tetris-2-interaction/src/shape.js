import { shapeTypes } from "./constants.js";

export class Shape {
  /**
   * @returns {Number} A random shape type
   */
  static getRandomShapeType() {
    return parseInt(Math.random() * shapeTypes.length);
  }

  constructor(type, playerId, col, row, rotation) {
    this.shapeType = type;
    this.rotation = rotation;
    this.playerId = playerId;
    this.col = col;
    this.row = row;
  }

  /**
   * Returns the array of coordinates of this shape (each coordinate being an array containing the x and y offsets
   * from the shape's origin), given its rotation.
   * @param {Number} rotation The rotation for which the coordinates are requested. If omitted, the shape's rotation is used.
   * @returns {Array} The coordinates of this shape, given its rotation.
   */
  getCoordinates(rotation = this.rotation) {
    return shapeTypes[this.shapeType][
      rotation % shapeTypes[this.shapeType].length
    ];
  }
}
