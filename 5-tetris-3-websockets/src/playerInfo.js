/**
 * Describes all information relative to a player.
 */
export class PlayerInfo {
  constructor(id, shape, clearedLines = 0) {
    this.id = id;
    this.clearedLines = clearedLines;
    this.shape = shape;
  }

  getId() {
    return this.id;
  }

  getClearedLines() {
    return this.clearedLines;
  }

  getShape() {
    return this.shape;
  }
}
