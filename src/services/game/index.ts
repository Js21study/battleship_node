import { Game } from '../../types';

const games: Game[] = [];

export const addGame = (gameId: string) => {
  const newGame: Game = {
    gameId,
    players: [],
    currentTurn: 0,
  };
  games.push(newGame);
};

export const getGame = (gameId: string) => games.find((game) => game.gameId === gameId);

export const processAttack = (gameId: string, x: number, y: number, playerId: number) => {
  const game = getGame(gameId);
  if (!game) {
    throw new Error(`Game with ID ${gameId} not found.`);
  }

  const currentPlayerIndex = game.currentTurn;
  const opponentIndex = currentPlayerIndex === 0 ? 1 : 0;

  const opponent = game.players[opponentIndex];
  const hitStatus = { position: { x, y }, status: 'miss' };

  for (const ship of opponent.ships) {
    const { position, length, direction } = ship;

    const isHit = direction
      ? x === position.x && y >= position.y && y < position.y + length
      : y === position.y && x >= position.x && x < position.x + length;

    if (isHit) {
      hitStatus.status = 'shot';
      opponent.hits.push({ x, y });
      break;
    }
  }

  if (hitStatus.status === 'shot') {
    const allHits = opponent.ships.every(
      (ship) =>
        ship.length ===
        opponent.hits.filter((hit) =>
          ship.direction
            ? hit.x === ship.position.x &&
              hit.y >= ship.position.y &&
              hit.y < ship.position.y + ship.length
            : hit.y === ship.position.y &&
              hit.x >= ship.position.x &&
              hit.x < ship.position.x + ship.length,
        ).length,
    );

    if (allHits) {
      hitStatus.status = 'killed';
    }
  }

  game.currentTurn = opponentIndex;

  return hitStatus;
};
