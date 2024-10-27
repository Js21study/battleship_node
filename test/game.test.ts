import { Game } from '../src/types';
import { addShipsToGame } from '../src/services/ships/index';

const mockGame: Game = {
  gameId: 'testGame',
  players: [],
  currentTurn: 0,
};

jest.mock('../src/services/game/index.ts', () => ({
  getGame: jest.fn(() => mockGame),
}));

describe('addShipsToGame', () => {
  beforeEach(() => {
    mockGame.players = [];
  });

  it('should add ships for a new player', () => {
    const ships = [{ position: { x: 0, y: 0 }, direction: true, length: 3, type: 'medium' }];
    addShipsToGame('testGame', ships, 1);

    expect(mockGame.players.length).toBe(1);
    expect(mockGame.players[0].ships).toEqual(ships);
  });

  it('should update ships for an existing player', () => {
    const initialShips = [{ position: { x: 0, y: 0 }, direction: true, length: 3, type: 'medium' }];
    addShipsToGame('testGame', initialShips, 1);

    const newShips = [{ position: { x: 1, y: 1 }, direction: false, length: 2, type: 'small' }];
    addShipsToGame('testGame', newShips, 1);

    expect(mockGame.players[0].ships).toEqual(newShips);
  });

  it('should start the game when both players have ships', () => {
    const shipsPlayer1 = [{ position: { x: 0, y: 0 }, direction: true, length: 3, type: 'medium' }];
    const shipsPlayer2 = [{ position: { x: 1, y: 1 }, direction: false, length: 2, type: 'small' }];

    addShipsToGame('testGame', shipsPlayer1, 1);
    addShipsToGame('testGame', shipsPlayer2, 2);

    expect(mockGame.players.length).toBe(2);
  });
});
