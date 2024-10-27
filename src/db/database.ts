import { Player } from '../types';

let players: Player[] = [];
let playerIndex = 0;

export const registerPlayer = (name: string, password: string) => {
  const existingPlayer = players.find((player) => player.name === name);
  if (existingPlayer) {
    return { error: true, errorText: 'Player already exists', index: existingPlayer.index };
  }

  const newPlayer = { name, password, index: playerIndex++ };
  players.push(newPlayer);
  return { error: false, index: newPlayer.index };
};
