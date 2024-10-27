export interface Player {
  name: string;
  password: string;
  index: number;
}

export interface Room {
  id: string;
  players: Player[];
}

export interface Ship {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: string;
}

export interface PlayerGameData {
  playerId: number;
  ships: Ship[];
  hits: { x: number; y: number }[];
}

export interface Game {
  gameId: string;
  players: PlayerGameData[];
  currentTurn: number;
}
