import { cellPixelSize, shapeColors } from "./constants.js";
import { Shape } from "./shape.js";

function cellToPixel(x) {
  return x * cellPixelSize;
}

export class Renderer {
  constructor(game, context) {
    this.game = game;
    this.context = context;
  }

  /**
   * Renders a block at the given position and with the given color.
   * @param {Number} col The column where the block should be drawn.
   * @param {Number} row The row where the block should be drawn.
   * @param {String} color The color of the block.
   */
  renderBlock(col, row, color) {
    this.context.fillStyle = color;
    this.context.fillRect(
      cellToPixel(col),
      cellToPixel(row),
      cellPixelSize,
      cellPixelSize
    );
    this.context.strokeRect(
      cellToPixel(col),
      cellToPixel(row),
      cellPixelSize,
      cellPixelSize
    );
  }

  /**
   * Renders the given shape.
   * @param {Shape} shape The shape to be drawn
   */
  renderFallingShape(shape) {
    if (shape === undefined) {
      return;
    }

    let coords = shape.getCoordinates();
    for (let i = 0; i < coords.length; i++) {
      let coord = coords[i];
      let x = shape.col + coord[0];
      let y = shape.row + coord[1];
      let color = shapeColors[shape.playerId % shapeColors.length];
      this.renderBlock(x, y, color);
    }
  }

  /**
   * Clears the context and draws all falling and dropped shapes.
   */
  render() {
    // Reset context
    this.context.strokeStyle = "black";
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );

    // Draw shapes
    this.game.forEachShape((s) => {
      this.renderFallingShape(s);
    });

    // Draw map
    for (let row = 0; row < this.game.map.height; row++) {
      for (let col = 0; col < this.game.map.width; col++) {
        let cell = this.game.map.getPlayerAt(row, col);
        if (cell != -1) {
          let color = shapeColors[cell % shapeColors.length];
          this.renderBlock(col, row, color);
        }
      }
    }
  }
}
