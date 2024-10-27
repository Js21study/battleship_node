import { Player } from '../../types';

interface Room {
  id: string;
  players: Player[];
}

let rooms: Room[] = [];

export const createRoom = (player: Player) => {
  const roomId = `${rooms.length + 1}`;
  rooms.push({ id: roomId, players: [player] });
  return roomId;
};

export const addPlayerToRoom = (roomId: string, player: Player) => {
  const room = rooms.find((r) => r.id === roomId);
  if (room && room.players.length < 2) {
    room.players.push(player);
    return true;
  }
  return false;
};

export const getRooms = () => rooms.map((room) => ({ roomId: room.id, roomUsers: room.players }));
