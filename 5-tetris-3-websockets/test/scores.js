/* eslint-disable no-undef */
import { GameMap } from '../src/gameMap.js'
import { expect } from 'chai'
import { DrawableGame } from '../src/game.js'
import { PlayerInfo } from '../src/playerInfo.js'

function getGameMap() {
    const gameMap = new GameMap(5, 5)
    gameMap.map = [
        [4, 4, 4, 4, 4],
        [1, 1, -1, -1, -1],
        [3, -1, -1, -1, -1],
        [-1, 1, -1, -1, -1],
        [1, -1, -1, -1, -1]]
    return gameMap
}

describe('Scores computation', () => {
    it('Map score should be computed correctly', () => {
        const gameMap = getGameMap()
        const scores = new Map([[1, 4], [3, 1], [4, 5]])
        expect(gameMap.getBlocksPerPlayer()).to.deep.equal(scores)
    })

    it('Total scores should be computed correctly', () => {
        const game = new DrawableGame(getGameMap())

        game.set(1, new PlayerInfo(1, undefined, 2))
        game.set(2, new PlayerInfo(2, undefined, 9))
        game.set(4, new PlayerInfo(4, undefined, 1))

        const scores = new Map([[1, -4 + 20], [2, 90], [3, -1], [4, -5 + 10]])
        expect(game.getTotalScores()).to.deep.equal(scores)
    })
})
