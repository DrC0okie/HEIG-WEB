import {
  cellPixelSize,
  shapeColors,
  alphaSelf,
  alphaOthers,
} from "./constants.js";

function cellToPixel(x) {
  return x * cellPixelSize;
}

export class Renderer {
  constructor(game, context) {
    this.game = game;
    this.context = context;
    this.playerId = undefined;
  }

  /**
   * Sets the player id of the current player.
   * @param {number} playerId The id of the current player.
   */
  setPlayerId(playerId) {
    this.playerId = playerId;
  }

  /**
   * Sets the alpha value of the color depending on the player id.
   * @param {color} color The color to be set.
   * @param {id} id The id of the player.
   * @returns The color with the alpha value set.
   */
  setAlpha(color, id) {
    const alpha = id === this.playerId ? alphaSelf : alphaOthers;
    return color.replace("x", alpha);
  }

  /**
   * Renders a block at the given position and with the given color.
   * @param {Number} col The column where the block should be drawn.
   * @param {Number} row The row where the block should be drawn.
   * @param {String} color The color of the block.
   */
  renderBlock(col, row, color) {
    this.context.fillStyle = color;
    const pixelX = cellToPixel(col);
    const pixelY = cellToPixel(row);
    this.context.fillRect(pixelX, pixelY, cellPixelSize, cellPixelSize);
    this.context.strokeRect(pixelX, pixelY, cellPixelSize, cellPixelSize);
  }

  /**
   * Renders the given shape.
   * @param {Shape} shape The shape to be drawn
   */
  renderFallingShape(shape) {
    if (shape === undefined) {
      return;
    }

    const coords = shape.getCoordinates();
    for (const coord of coords) {
      const x = shape.col + coord[0];
      const y = shape.row + coord[1];
      const id = shape.playerId;
      const color = this.setAlpha(shapeColors[id % shapeColors.length], id);
      this.renderBlock(x, y, color);
    }
  }

  /**
   * Clears the context and draws all falling and dropped shapes.
   */
  render() {
    this.showCurrentPlayerId();
    this.updateScores();

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
        const cell = this.game.map.getPlayerAt(row, col);
        if (cell !== -1) {
          const color = this.setAlpha(
            shapeColors[cell % shapeColors.length],
            cell
          );
          this.renderBlock(col, row, color);
        }
      }
    }
  }

  /**
   * Updates the scores displayed on the page.
   */
  updateScores() {
    const scoresElem = document.getElementById("scores");
    const scores = new Map(
      [...this.game.getTotalScores()].sort((a, b) => b[1] - a[1])
    );
    const table = document.createElement("table");
    table.setAttribute("id", "score_table");

    scores.forEach((score, playerId) => {
      const row = table.insertRow();
      row.insertCell(0).textContent = `Player ${playerId}`;
      row.insertCell(1).textContent = " : ";
      row.insertCell(2).textContent = score;
    });

    scoresElem.innerHTML = "";
    scoresElem.appendChild(table);
  }

  /**
   * Updates the current player id displayed on the page.
   */
  showCurrentPlayerId() {
    const curr_player = document.getElementById("currentPlayer");
    curr_player.textContent = `You are player  ${this.playerId}`;
  }
}
