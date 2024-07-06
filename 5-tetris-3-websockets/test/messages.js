/* eslint-disable no-undef */
import { expect } from 'chai'
import { MessageCodec, SetPlayerMessage, UpdateMapMessage } from "../src/messages.js"
import { PlayerInfo } from '../src/playerInfo.js'
import { Shape } from '../src/shape.js'
import { GameMap } from '../src/gameMap.js'

describe('Messages after encode-decode', () => {
    it('SetPlayerMessage should always return player and shape instances', () => {
        const msg = new SetPlayerMessage(new PlayerInfo(42, new Shape(0, 42, 3, 3, 1)))
        const encoded = MessageCodec.encode(msg)
        const decoded = MessageCodec.decode(encoded)
        expect(decoded, "Decoded message").to.deep.equal(msg)
        expect(decoded.constructor.name, "Decoded message constructor name").to.equal("SetPlayerMessage")

        const player = decoded.getPlayer()
        expect(player.constructor.name, "Constructor name of player obtained through SetPlayerMessage.getPlayer").to.equal("PlayerInfo")
        expect(Object.keys(player), "Properties of player obtained through SetPlayerMessage.getPlayer").to.deep.include.members(["clearedLines", "shape", "id"])

        const shape = player.getShape()
        expect(shape.constructor.name, "Constructor name of shape obtained from player obtained through SetPlayerMessage.getPlayer").to.equal("Shape")
        expect(Object.keys(shape), "Properties of shape obtained from player obtained through SetPlayerMessage.getPlayer").to.deep.include.members(["shapeType", "rotation", "playerId", "col", "row"])

        const shape2 = decoded.getShape()
        expect(shape, "Constructor name of shape obtained through SetPlayerMessage.getShape").to.deep.equal(shape2)
    })
    it('UpdateMapMessage should always return a GameMap instance', () => {
        const gameMap = new GameMap(3, 3)
        gameMap.map = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]]
        const msg = new UpdateMapMessage(gameMap)

        const encoded = MessageCodec.encode(msg)
        const decoded = MessageCodec.decode(encoded)

        expect(decoded, "Decoded message").to.deep.equal(msg)
        expect(decoded.constructor.name, "Decoded message constructor name").to.deep.equal("UpdateMapMessage")

        const decodedMap = decoded.getMap()
        expect(decodedMap, "Decoded map obtained through UpdateMapMessage.getMap()").to.deep.equal(gameMap)
        expect(decodedMap.constructor.name, "Constructor name of map obtained through UpdateMapMessage.getMap()").to.equal("GameMap")
    })
})
