import WebSocket from 'ws';
import { registerPlayer } from './db/database';
import { addPlayerToRoom, createRoom, getRooms } from './services/room';
import { addShipsToGame } from './services/ships';
import { Player } from './types';
import { processAttack } from './services/game';

const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: Number(PORT) });
const players = new Map<WebSocket, Player>();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const request = JSON.parse(message.toString());
    const currentPlayer = players.get(ws);
    if (request.type === 'reg') {
      const { name, password } = request.data;
      const result = registerPlayer(name, password);
      const response = {
        type: 'reg',
        data: {
          name,
          index: result.index,
          error: result.error,
          errorText: result.error ? result.errorText : '',
        },
        id: 0,
      };
      ws.send(JSON.stringify(response));
    }
    if (request.type === 'create_room') {
      const roomId = currentPlayer ? createRoom(currentPlayer) : 'current player is not found';
      const response = {
        type: 'create_game',
        data: {
          idGame: roomId,
          idPlayer: currentPlayer?.index,
        },
        id: 0,
      };
      ws.send(JSON.stringify(response));
    } else if (request.type === 'add_user_to_room') {
      const success = currentPlayer
        ? addPlayerToRoom(request.data.indexRoom, currentPlayer)
        : 'current player is not found';
      const response = {
        type: 'room_update',
        data: {
          success,
          roomId: request.data.indexRoom,
        },
        id: 0,
      };
      ws.send(JSON.stringify(response));
    } else if (request.type === 'update_room') {
      const rooms = getRooms();
      const response = {
        type: 'update_room',
        data: rooms,
        id: 0,
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(response));
        }
      });
    }
    if (request.type === 'add_ships') {
      const { gameId, ships, indexPlayer } = request.data;
      try {
        addShipsToGame(gameId, ships, indexPlayer);
      } catch (error) {
        console.error(error);
      }
    }
    if (request.type === 'attack') {
      const { gameId, x, y, indexPlayer } = request.data;
      try {
        const result = processAttack(gameId, x, y, indexPlayer);
        const response = {
          type: 'attack',
          data: result,
          id: 0,
        };

        ws.send(JSON.stringify(response));
      } catch (error) {
        console.error(error);
      }
    }
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server started on ws://localhost:${PORT}`);
