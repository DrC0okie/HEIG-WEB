export class GameMap {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    /** 2D array storing for each position the id of the player whose block is there, or -1 otherwise. */
    this.map = Array.from({ length: height }, () => Array(width).fill(-1));
  }

  /**
   * Drops the given shape, i.e. moves it down until it touches something, and then grounds it.
   * @param {Shape} shape The shape to be dropped.
   */
  dropShape(shape) {
    for (let row = shape.row; row < this.height; row++) {
      if (this.testShape(shape, shape.row + 1)) {
        shape.row = row;
      }
    }
    this.groundShape(shape);
  }

  /**
   * Grounds the given shape, i.e. transfers it to the map table.
   * @param {Shape} shape The shape to be grounded.
   */
  groundShape(shape) {
    const coords = shape.getCoordinates(shape.rotation);
    for (let coord of coords) {
      let x = shape.col + coord[0];
      let y = shape.row + coord[1];
      this.map[y][x] = shape.playerId;
    }
    console.log(this.map);
  }

  /**
   * Tests whether the given shape is overlapping a block or is out of bounds on the left, right, or bottom of the map.
   * This method allows the test to be done with row, col and/or rotation that are different from those of the shape itself.
   *
   * Note that we do not consider a shape to be out of bounds if it is (even partly) above the top of the map.
   *
   * @param {Shape} shape The shape to be tested
   * @param {Number} row Optional row at which the shape should be tested. If omitted, uses that of the shape.
   * @param {Number} col Optional col at which the shape should be tested. If omitted, uses that of the shape.
   * @param {Number} rotation Optional rotation with which the shape should be tested. If omitted, uses that of the shape.
   * @returns true if and only if the shape does not overlap anything and is not out of bounds.
   */
  testShape(
    shape,
    row = shape.row,
    col = shape.col,
    rotation = shape.rotation
  ) {
    const coords = shape.getCoordinates(rotation);

    for (const coord of coords) {
      if (col + coord[0] < 0 || col + coord[0] > this.width - 1) {
        return false;
      }
      if (row + coord[1] >= this.height) {
        return false;
      }
      if (this.getPlayerAt(row + coord[1], col + coord[0]) != -1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Clears any row that is fully complete.
   */
  clearFullRows() {
    for (let row = 0; row < this.map.length; row++) {
      const row_is_full = this.map[row].every((el) => {
        if (el != -1) {
          return true;
        }
      });
      if (row_is_full) {
        this.clearRow(row);
      }
    }
  }

  /**
   * Clears the given row, and moves any row above it down by one.
   * @param {Number} row The row to be cleared.
   */
  clearRow(row) {
    this.map.splice(row, 1);
    this.map.unshift(Array(this.width).fill(-1));
  }

  /**
   * Returns the id of the player whose block is grounded at the given position, or -1 otherwise.
   * @param {Number} row the requested row
   * @param {Number} col the requested column
   * @returns the id of the player whose block is grounded at the given position, or -1 otherwise
   */
  getPlayerAt(row, col) {
    return this.map[row][col];
  }
}
