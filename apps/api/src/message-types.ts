import type { GameState } from '@squad-tetris/game-engine';

// --- Client → Server messages ---

export interface JoinMessage {
  type: 'join';
  payload: {
    roomId: string;
    playerId: string;
    playerName: string;
  };
}

export interface MoveMessage {
  type: 'move';
  payload: {
    action: 'left' | 'right' | 'down' | 'rotate' | 'hard_drop';
  };
}

export type ClientMessage = JoinMessage | MoveMessage;

// --- Server → Client messages ---

export interface StateUpdateMessage {
  type: 'state_update';
  payload: {
    playerId: string;
    gameState: GameState;
  };
}

export interface GameOverMessage {
  type: 'game_over';
  payload: {
    playerId: string;
    finalScore: number;
  };
}

export interface ErrorMessage {
  type: 'error';
  payload: {
    code: string;
    message: string;
  };
}

export interface PlayerJoinedMessage {
  type: 'player_joined';
  payload: {
    playerId: string;
    playerName: string;
    roomId: string;
  };
}

export interface PlayerLeftMessage {
  type: 'player_left';
  payload: {
    playerId: string;
    roomId: string;
  };
}

export type ServerMessage =
  | StateUpdateMessage
  | GameOverMessage
  | ErrorMessage
  | PlayerJoinedMessage
  | PlayerLeftMessage;

// --- Validation ---

const VALID_CLIENT_TYPES = new Set(['join', 'move']);
const VALID_MOVE_ACTIONS = new Set(['left', 'right', 'down', 'rotate', 'hard_drop']);

export function validateClientMessage(data: unknown): ClientMessage | null {
  if (typeof data !== 'object' || data === null) return null;

  const msg = data as Record<string, unknown>;
  if (!VALID_CLIENT_TYPES.has(msg.type as string)) return null;

  if (msg.type === 'join') {
    const payload = msg.payload as Record<string, unknown> | undefined;
    if (
      !payload ||
      typeof payload.roomId !== 'string' ||
      typeof payload.playerId !== 'string' ||
      typeof payload.playerName !== 'string'
    ) {
      return null;
    }
    return msg as unknown as JoinMessage;
  }

  if (msg.type === 'move') {
    const payload = msg.payload as Record<string, unknown> | undefined;
    if (!payload || !VALID_MOVE_ACTIONS.has(payload.action as string)) {
      return null;
    }
    return msg as unknown as MoveMessage;
  }

  return null;
}
