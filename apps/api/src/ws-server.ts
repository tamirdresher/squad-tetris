import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HttpServer } from 'http';
import { createGameState } from '@squad-tetris/game-engine';
import type { GameState } from '@squad-tetris/game-engine';
import {
  validateClientMessage,
  type ServerMessage,
  type ClientMessage,
} from './message-types.js';

/** Represents a connected player */
interface ConnectedPlayer {
  ws: WebSocket;
  playerId: string;
  playerName: string;
  roomId: string;
  gameState: GameState;
}

/** Room containing players */
interface Room {
  players: Map<string, ConnectedPlayer>;
}

/** Tracks all rooms */
const rooms = new Map<string, Room>();

/** Map from WebSocket to playerId for cleanup on disconnect */
const socketToPlayer = new Map<WebSocket, { playerId: string; roomId: string }>();

function send(ws: WebSocket, message: ServerMessage): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function broadcastToRoom(roomId: string, message: ServerMessage, exclude?: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  for (const [id, player] of room.players) {
    if (id !== exclude) {
      send(player.ws, message);
    }
  }
}

function handleJoin(ws: WebSocket, msg: ClientMessage & { type: 'join' }): void {
  const { roomId, playerId, playerName } = msg.payload;

  // Check if player is already in a room
  const existing = socketToPlayer.get(ws);
  if (existing) {
    send(ws, {
      type: 'error',
      payload: { code: 'ALREADY_JOINED', message: 'Already in a room' },
    });
    return;
  }

  // Get or create room
  let room = rooms.get(roomId);
  if (!room) {
    room = { players: new Map() };
    rooms.set(roomId, room);
  }

  // Check for duplicate player ID in room
  if (room.players.has(playerId)) {
    send(ws, {
      type: 'error',
      payload: { code: 'DUPLICATE_PLAYER', message: 'Player ID already in room' },
    });
    return;
  }

  const gameState = createGameState();
  const player: ConnectedPlayer = { ws, playerId, playerName, roomId, gameState };

  room.players.set(playerId, player);
  socketToPlayer.set(ws, { playerId, roomId });

  // Notify other players
  broadcastToRoom(roomId, {
    type: 'player_joined',
    payload: { playerId, playerName, roomId },
  }, playerId);

  // Send current game states of all players to the new player
  for (const [id, p] of room.players) {
    send(ws, {
      type: 'state_update',
      payload: { playerId: id, gameState: p.gameState },
    });
  }

  console.log(`Player ${playerName} (${playerId}) joined room ${roomId}`);
}

function handleMove(ws: WebSocket, msg: ClientMessage & { type: 'move' }): void {
  const info = socketToPlayer.get(ws);
  if (!info) {
    send(ws, {
      type: 'error',
      payload: { code: 'NOT_IN_ROOM', message: 'Join a room before sending moves' },
    });
    return;
  }

  const room = rooms.get(info.roomId);
  const player = room?.players.get(info.playerId);
  if (!room || !player) return;

  // TODO: Apply move using game engine when collision/movement logic is integrated
  // For now, broadcast the current state so the protocol is exercised
  broadcastToRoom(info.roomId, {
    type: 'state_update',
    payload: { playerId: info.playerId, gameState: player.gameState },
  });
}

function handleDisconnect(ws: WebSocket): void {
  const info = socketToPlayer.get(ws);
  if (!info) return;

  const { playerId, roomId } = info;
  const room = rooms.get(roomId);

  if (room) {
    room.players.delete(playerId);

    broadcastToRoom(roomId, {
      type: 'player_left',
      payload: { playerId, roomId },
    });

    // Clean up empty rooms
    if (room.players.size === 0) {
      rooms.delete(roomId);
    }
  }

  socketToPlayer.delete(ws);
  console.log(`Player ${playerId} disconnected from room ${roomId}`);
}

export function createWebSocketServer(server: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');

    ws.on('message', (raw: Buffer) => {
      let data: unknown;
      try {
        data = JSON.parse(raw.toString());
      } catch {
        send(ws, {
          type: 'error',
          payload: { code: 'INVALID_JSON', message: 'Message must be valid JSON' },
        });
        return;
      }

      const message = validateClientMessage(data);
      if (!message) {
        send(ws, {
          type: 'error',
          payload: { code: 'INVALID_MESSAGE', message: 'Unknown or malformed message' },
        });
        return;
      }

      switch (message.type) {
        case 'join':
          handleJoin(ws, message);
          break;
        case 'move':
          handleMove(ws, message);
          break;
      }
    });

    ws.on('close', () => handleDisconnect(ws));

    ws.on('error', (err: Error) => {
      console.error('WebSocket error:', err.message);
      handleDisconnect(ws);
    });
  });

  console.log('🔌 WebSocket server attached at /ws');
  return wss;
}
