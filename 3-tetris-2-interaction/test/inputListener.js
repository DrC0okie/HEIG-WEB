import { expect } from "chai";
import { cellPixelSize, } from '../src/constants.js';
import { onMove } from '../src/inputListener.js';

describe("Input listener", function () {
  it("Moving mouse to the same position should not send a message twice", function () {

    // Center of the first column
    const initialX = cellPixelSize / 2;

    // First column
    const expectedColumn = 0;

    // Simulate the initial mouse event
    let event = { offsetX: initialX };

    let messageCount = 0;
    const messageListener = (_, message) => {
      expect(message.getCol(), "The message should contain the correct column based on the mouse position").to.equal(expectedColumn);
      messageCount++;
    };

    // Call onMove directly with the mouse event
    onMove(event, messageListener);

    // Simulate a slight mouse movement within the same column
    event.offsetX += cellPixelSize / 4; // Move slightly within the same column
    onMove(event, messageListener);

    // Since the mouse did not move to a different column, messageListener should have been called once
    expect(messageCount, "The messageListener should be triggered exactly once when the mouse stays within the same column").to.equal(1);
  });
});
