/* eslint-disable no-undef */
import { expect } from 'chai'
import { cellPixelSize } from '../src/constants.js'
import { mouseMove } from '../src/inputListener.js'

describe('Input listener', () => {
    it('Moving mouse to same position should not send message twice', () => {
        const canvasLeft = 10
        const mouseX = 10 + cellPixelSize + 1
        const clickedCol = parseInt((mouseX - canvasLeft) / cellPixelSize)

        const canvas = { getBoundingClientRect: () => { return { left: canvasLeft } } }
        const event = { clientX: mouseX }

        let messageCount = 0
        const messageListener = (message) => {
            expect(message.constructor.name, "Expected message is MoveMessage").to.equal("MoveMessage")
            expect(message.getCol(), "Column should be computed correctly from mouse click position").to.equal(clickedCol)
            messageCount++
        }

        mouseMove(canvas, event, messageListener)
        event.clientX += 1
        mouseMove(canvas, event, messageListener)

        expect(messageCount, "Message should be sent exactly once.").to.equal(1)
    })
})
