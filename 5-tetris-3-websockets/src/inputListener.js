import { cellPixelSize } from "./constants.js";
import { DropMessage, MoveMessage, RotateMessage } from "./messages.js";

let currentCol = NaN;

export function mouseMove(canvas, event, messageListener) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const newCol = parseInt(x / cellPixelSize, 10);
  if (currentCol !== newCol) {
    currentCol = newCol;
    messageListener(new MoveMessage(newCol));
  }
}

export function keyDown(event, messageListener) {
  if (event.key === "ArrowLeft") {
    messageListener(new RotateMessage("left"));
  }
  if (event.key === "ArrowRight") {
    messageListener(new RotateMessage("right"));
  }
  if (event.key === "ArrowDown") {
    messageListener(new DropMessage());
  }
}

export function mouseClick(_event, messageListener) {
  messageListener(new DropMessage());
}

/**
 * Sets up all event listeners for user interactions:
 * - A click on the canvas or a key press on the down arrow will send a `DropMessage`.
 * - A movement of the mouse on the canvas will send a `MoveMessage` with the corresponding column.
 * - A key press on the left or right arrow will send a left or right `RotateMessage`.
 * @param canvas The canvas on which the game is drawn
 * @param messageListener The callback function handling the messages to be sent. It expects a `Message` as unique argument.
 */
export function setListeners(canvas, messageListener) {
  window.addEventListener("keydown", (event) =>
    keyDown(event, messageListener)
  );
  canvas.addEventListener("mousemove", (event) =>
    mouseMove(canvas, event, messageListener)
  );
  canvas.addEventListener("click", (event) =>
    mouseClick(event, messageListener)
  );
}
