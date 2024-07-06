export class GameMap {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    /** 2D array storing for each position the id of the player whose block is there, or -1 otherwise. */
    this.map = [];
    for (let i = 0; i < height; i++) {
      this.map.push([]);
      for (let j = 0; j < width; j++) {
        this.map[i].push(-1);
      }
    }
  }

  /**
   * Drops the given shape, i.e. moves it down until it touches something, and then grounds it.
   * @param {Shape} shape The shape to be dropped.
   */
  dropShape(shape) {
    if (!this.testShape(shape)) {
      console.log(
        "Shape is conflicting with something while trying to drop; aborting!"
      );
      return;
    }

    let y = shape.row;
    while (this.testShape(shape, y + 1)) {
      y++;
    }
    shape.row = y;
    this.groundShape(shape);
  }

  /**
   * Grounds the given shape, i.e. transfers it to the map table.
   * @param {Shape} shape The shape to be grounded.
   */
  groundShape(shape) {
    let coords = shape.getCoordinates();
    for (let i = 0; i < coords.length; i++) {
      let coord = coords[i];
      let newX = shape.col + coord[0];
      let newY = shape.row + coord[1];
      if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
        this.map[newY][newX] = shape.playerId;
      } else {
        throw new Error("Shape out of bounds, cannot ground!");
      }
    }
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
    let coords = shape.getCoordinates(rotation);
    for (let i = 0; i < coords.length; i++) {
      let coord = coords[i];
      let newCol = col + coord[0];
      let newRow = row + coord[1];
      if (newCol >= 0 && newCol < this.width && newRow < this.height) {
        if (newRow >= 0 && this.map[newRow][newCol] !== -1) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  /**
   * Clears any row that is fully complete.
   */
  clearFullRows() {
    let count = 0;

    for (let row = 0; row < this.height; row++) {
      if (this.isRowFull(row)) {
        this.clearRow(row);
        count += 1;
      }
    }

    return count;
  }

  /**
   * Clears the given row, and moves any row above it down by one.
   * @param {Number} row The row to be cleared.
   */
  clearRow(row) {
    for (let i = row; i > 0; i--) {
      for (let j = 0; j < this.width; j++) {
        this.map[i][j] = this.map[i - 1][j];
      }
    }
    for (let j = 0; j < this.width; j++) {
      this.map[0][j] = -1;
    }
  }

  isRowFull(row) {
    for (let col = 0; col < this.width; col++) {
      if (this.getPlayerAt(row, col) === -1) {
        return false;
      }
    }
    return true;
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
