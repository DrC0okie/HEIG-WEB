import { cellPixelSize } from "./constants.js"
import { DropMessage, MoveMessage, RotateMessage } from "./messages.js"

let prevCol = undefined;
const ID = 0;

/**
 * Sets up all event listeners for user interactions:
 * - A click on the canvas or a key press on the down arrow will send a `DropMessage`.
 * - A movement of the mouse on the canvas will send a `MoveMessage` with the corresponding column.
 * - A key press on the left or right arrow will send a left or right `RotateMessage`.
 * @param canvas The canvas on which the game is drawn
 * @param messageListener The callback function handling the messages to be sent. It expects a `Message` as unique argument.
 */
export function setListeners(canvas, messageListener) {
  canvas.addEventListener('click', (event) => onClick(event, messageListener))
  canvas.addEventListener('mousemove', (event) => onMove(event, messageListener))
  window.addEventListener('keydown', (event) => onKeyPressed(event, messageListener))
}

export function onClick(event, messageListener) {
  messageListener(ID, new DropMessage())
}

export function onMove(event, messageListener) {
  const x = event.offsetX;
  const col = Math.floor(x / cellPixelSize);
  if (prevCol !== col) {
    messageListener(ID, new MoveMessage(col));
    prevCol = col;
  }
}

export function onKeyPressed(event, messageListener) {
  switch (event.key) {
    case 'ArrowRight':
      messageListener(ID, new RotateMessage("right"));
      break;
    case 'ArrowLeft':
      messageListener(ID, new RotateMessage("left"));
      break;
    // Not asked but this make sense
    case 'ArrowDown':
      messageListener(ID, new DropMessage());
      console.log("click");
      break;
  }

  // Prevent default for arrow keys to avoid scrolling
  if (['ArrowRight', 'ArrowLeft', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
  }
}
