import { cellPixelSize } from "./constants.js";

/**
 * Handles rendering of game elements to the canvas.
 */
export class Renderer {
  constructor(game, context) {
    this.game = game;
    this.context = context;
  }

  /**
  * Main render loop: clears the canvas, then draws all game shapes and the ground.
  */
  render() {
    this.clearCanvas();
    this.drawShapes();
    this.drawGround();
  }

  /**
  * Clears the entire canvas to prepare for a new frame.
  */
  clearCanvas() {
    this.context.clearRect(0, 0, this.toPixels(gameCols), this.toPixels(gameRows));
  }

  /**
  * Iterates through each shape in the game and draws it on the canvas.
  * This includes shapes that are currently falling.
  */
  drawShapes() {
    this.game.forEachShape((shape) => {
      const coordinates = shape.getCoordinates();
      coordinates.forEach(([dx, dy]) => {
        this.drawCell(shape.playerId, shape.col + dx, shape.row + dy);
      });
    });
  }

  /**
  * Draws the grounded shapes on the canvas. These are the shapes that have already been placed on the game field.
  */
  drawGround() {
    const map = this.game.map;
    for (let row = 0; row < map.height; row++) {
      for (let col = 0; col < map.width; col++) {
        const playerId = map.getPlayerAt(row, col);
        if (playerId !== -1) {
          this.drawCell(playerId, col, row);
        }
      }
    }
  }

  /**
  * Draws a single cell (square) on the canvas, used for both falling and grounded shapes.
  * @param {Number} playerId The ID of the player, which determines the color of the cell.
  * @param {Number} col The column number (x-coordinate) of the cell.
  * @param {Number} row The row number (y-coordinate) of the cell.
  */
  drawCell(playerId, col, row) {
    this.context.fillStyle = shapeColors[playerId];
    this.context.fillRect(this.toPixels(col), this.toPixels(row), cellPixelSize, cellPixelSize);
  }

  /**
  * Converts game units (rows and columns) to pixels on the canvas.
  * @param {Number} gameUnits The number of game units to convert.
  * @returns {Number} The corresponding number of pixels on the canvas.
  */
  toPixels(gameUnits) {
    return gameUnits * cellPixelSize;
  }
}
