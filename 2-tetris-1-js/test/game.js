import { assert, expect } from 'chai';
import { PlayerInfo } from '../src/playerInfo.js';
import { Game } from '../src/game.js';
import { GameMap } from '../src/gameMap.js';
import { Shape } from '../src/shape.js';

class MockGameMap extends GameMap {
    constructor(width, height, onShapeDrop, onClearFullRows) {
        super(width, height);
        this.onShapeDrop = onShapeDrop;
        this.onClearFullRows = onClearFullRows;
    }

    dropShape(shape) {
        if (this.onShapeDrop) {
            this.onShapeDrop(shape);
        }
        return super.dropShape(shape);
    }

    clearFullRows() {
        if (this.onClearFullRows) {
            this.onClearFullRows();
        }
        return super.clearFullRows();
    }
}

function createGame(map, shapes) {
    let game = new Game(map);
    shapes.forEach((shape) => {
        let pi = new PlayerInfo(shape.playerId, shape)
        game.set(shape.playerId, pi);
    });
    return game;
}

describe('Game stepping', () => {
    it('All shapes should move down by 1', () => {
        const gameMap = new GameMap(10, 10);
        let rows = new Map([[1, 3], [2, 5]]);
        let shapes = Array.from(rows.entries()).map(([id, row]) => new Shape(0, id, 5, row, 0));

        const game = createGame(gameMap, shapes);

        game.step();
        
        game.forEachShape((s) => {
            expect(s, "Shape").to.not.be.undefined;
            expect(s.row, "Shape row").to.equal(rows.get(s.playerId) + 1)
        });

        expect(rows.keys, "Player ids").to.deep.equal(game.keys);
    });
    it('Should ask gameMap to drop shape when touching the ground upon step, and clear full rows.', () => {
        let dropCount = 0;
        let clearCount = 0;

        let shape1 = new Shape(0, 1, 5, 3, 0);
        let shape2 = new Shape(0, 2, 5, 1, 0);

        const gameMap = new MockGameMap(10, 5, (shape) => {
            dropCount++;
            // Only player 1's shape should drop.
            expect(shape.playerId, "Player Id of the shape that got dropped").to.equal(1);
        }, () => {
            clearCount++;
        });

        let game = createGame(gameMap, [shape1, shape2]);

        game.step();

        expect(dropCount, "Number of shapes dropped on the gameMap").to.equal(1);
        expect(clearCount, "Number of times row was asked to be cleared").to.equal(1);
    });
    it('If multiple shapes touch the ground upon stepping, they should drop and be replaced, the others unaffected.', () => {
        let shape1 = new Shape(0, 1, 2, 3, 0); // will be dropped
        let shape2 = new Shape(0, 2, 5, 1, 0);
        let shape3 = new Shape(0, 3, 7, 3, 0); // will be dropped

        shape1.testShape = true;
        shape2.testShape = true;
        shape3.testShape = true;

        let gameMap = new GameMap(10, 5);
        
        let game = createGame(gameMap, [shape1, shape2, shape3]);
        
        game.step();

        expect(game.size, "Number of players in the game").to.equal(3)
        
        expect(game.getShape(1), "Shape after it was dropped").to.not.be.undefined;
        expect(game.getShape(3), "Shape after it was dropped").to.not.be.undefined;
        
        expect(game.getShape(1).testShape, "Whether shape is the same as before after it was dropped").to.be.undefined;
        expect(game.getShape(3).testShape, "Whether shape is the same as before after it was dropped").to.be.undefined;

        expect(game.getShape(2).testShape, "Whether shape is the same as before after another was dropped").to.not.be.undefined;
    })
    it('If two shapes overlap when touching the ground, only one should drop', () => {
        let shape1 = new Shape(0, 1, 5, 3, 0);
        let shape2 = new Shape(0, 2, 5, 3, 0);

        shape1.testShape = true;
        shape2.testShape = true;

        let dropCount = 0;

        let gameMap = new MockGameMap(10, 5, (shape) => { dropCount++; });
        
        let game = createGame(gameMap, [shape1, shape2]);
        
        game.step();

        expect(game.size, "Number of players after dropping.").to.equal(2)
        
        expect(game.getShape(1), "Shape after it was dropped").to.not.be.undefined;
        expect(game.getShape(2), "Shape after it was dropped.").to.not.be.undefined;
        
        expect(game.getShape(1).testShape, "Whether shape is the same after it was dropped").to.be.undefined;
        expect(game.getShape(2).testShape, "Whether shape is the same after it was dropped").to.be.undefined;

        expect(dropCount, "Number of shapes that actually dropped on the map").to.equal(1);
    })
});