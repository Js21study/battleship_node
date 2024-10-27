import { PlayerGameData, Ship } from '../../types';
import { getGame } from '../game';

export const addShipsToGame = (gameId: string, ships: Ship[], playerId: number) => {
  const game = getGame(gameId);
  if (!game) {
    throw new Error(`Game with ID ${gameId} not found.`);
  }

  const playerData: PlayerGameData | undefined = game.players.find(
    (player) => player.playerId === playerId,
  );

  if (playerData) {
    playerData.ships = ships;
  } else {
    game.players.push({
      playerId,
      ships,
      hits: [],
    });
  }

  if (game.players.length === 2 && game.players.every((player) => player.ships.length > 0)) {
    console.log(`Both players have placed their ships. Game ${gameId} can start.`);
  }
};
