/**
 * Describes all information relative to a player.
 */
export class PlayerInfo {
  constructor(id, shape) {
    this.id = id;
    this.shape = shape;
  }

  getId() {
    return this.id;
  }

  getShape() {
    return this.shape;
  }
}
