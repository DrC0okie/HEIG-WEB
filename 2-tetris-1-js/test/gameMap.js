import { assert, expect } from 'chai';
import { PlayerInfo } from '../src/playerInfo.js';
import { Game } from '../src/game.js';
import { GameMap } from '../src/gameMap.js';
import { Shape } from '../src/shape.js';

function getTestDroppingOnGround(hovering) {
    return () => {
        const gameMap = new GameMap(5, 5);
        const shape = new Shape(0, 1, 2, 3 - (hovering ? 1 : 0), 0);
        gameMap.dropShape(shape);
        expect(gameMap.map, "Game map after dropping shape").to.deep.equal([
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, 1, 1, 1, -1],
            [-1, -1, 1, -1, -1]]);
    }
}

function getTestDroppingOnShape(hovering) {
    return () => {
        const gameMap = new GameMap(5, 5);
        gameMap.map = [
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, 2, -1, -1, -1],
            [-1, 2, -1, -1, -1]];
        const shape = new Shape(0, 1, 2, 2 - (hovering ? 2 : 0), 0);
        gameMap.dropShape(shape);
        expect(gameMap.map, "Game map after dropping shape").to.deep.equal([
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, 1, 1, 1, -1],
            [-1, 2, 1, -1, -1],
            [-1, 2, -1, -1, -1]]);
    }
}

function getTestTestShapeOverlap(origin, rotated) {
    return () => {
        const gameMap = new GameMap(5, 5);
        gameMap.map = [
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, 2, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1]];
        const shape = new Shape(0, 1, 2 - (origin ? 1 : 0), 2, rotated ? 3 : 0);

        if (rotated) {
            expect(gameMap.testShape(shape), "Whether shape after rotation overlaps").to.be.true;
        } else {
            expect(gameMap.testShape(shape), "Whether shape overlaps").to.be.false;
        }
    }
}

function getTestTestShapeOutOfBounds(origin, rotated) {
    return () => {
        const gameMap = new GameMap(5, 5);
        const shape = new Shape(0, 1, 0 - (origin ? 1 : 0), 2, rotated ? 3 : 0);

        if (rotated) {
            expect(gameMap.testShape(shape), "Whether shape after rotation is out of bounds").to.be.true;
        } else {
            expect(gameMap.testShape(shape), "Whether shape is out of bounds").to.be.false;
        }
    }
}

describe('Dropping a shape', () => {
    it('Shape is touching bottom of game map.', getTestDroppingOnGround(false));
    it('Shape is hovering over bottom of game map.', getTestDroppingOnGround(true));
    it('Shape is touching grounded blocks.', getTestDroppingOnShape(false));
    it('Shape is hovering grounded blocks.', getTestDroppingOnShape(true));
});

describe("Detecting shape collisions", () => {
    it('Shape overlaps map block at non-origin coordinates, if not rotated.', getTestTestShapeOverlap(false, false));
    it('Shape does not overlap map block if rotated.', getTestTestShapeOverlap(false, true));
    it('Shape overlaps map block at its origin.', getTestTestShapeOverlap(true, false));

    it('Shape out of bounds at non-origin coordinates, if not rotated.', getTestTestShapeOutOfBounds(false, false));
    it('Shape not out of bounds iff rotated.', getTestTestShapeOutOfBounds(false, true));
    it('Shape out of bounds at its origin.', getTestTestShapeOutOfBounds(true, false));
});

describe("Clearing full rows", () => {
    it('Exactly one row to clear.', () => {
        const gameMap = new GameMap(5, 5);
        gameMap.map = [
            [-1, -1, -1, -1, -1],
            [-1, -1, 1, -1, -1],
            [1, 2, 1, 1, 5],
            [-1, -1, -1, 4, -1],
            [-1, -1, 3, -1, -1]];
        gameMap.clearFullRows();

        expect(gameMap.map, "Game map after full rows are cleared").to.deep.equal([
            [-1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1],
            [-1, -1, 1, -1, -1],
            [-1, -1, -1, 4, -1],
            [-1, -1, 3, -1, -1]
        ]);
    });
    it('Multiple rows to clear.', () => {
        const gameMap = new GameMap(3, 7);
        gameMap.map = [
            [-1, -1, 1],
            [-1, 1, -1],
            [7, 8, 9],
            [3, 4, 5],
            [6, -1, -1],
            [1, 2, 3],
            [-1, -1, -1]];
        gameMap.clearFullRows();

        expect(gameMap.map, "Game map after full rows are cleared").to.deep.equal([
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, 1],
            [-1, 1, -1],
            [6, -1, -1],
            [-1, -1, -1]]);
    });
    it('No rows to clear.', () => {
        const gameMap = new GameMap(3, 5);
        gameMap.map = [
            [7, -1, 9],
            [-1, 4, 5],
            [6, 5, -1],
            [1, 2, -1],
            [-1, -1, -1]];
        gameMap.clearFullRows();

        expect(gameMap.map, "Game map after full rows are cleared").to.deep.equal([
            [7, -1, 9],
            [-1, 4, 5],
            [6, 5, -1],
            [1, 2, -1],
            [-1, -1, -1]]);
    });
});