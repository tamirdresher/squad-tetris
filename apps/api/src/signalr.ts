// SignalR Service for real-time game state broadcasting
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';

export interface GameEvent {
  type: 'piece_moved' | 'line_cleared' | 'game_over' | 'player_joined' | 'player_left';
  roomId: string;
  playerId: string;
  data?: any;
}

class SignalRService {
  private connection: HubConnection | null = null;
  private useWebSocketFallback = false;

  async initialize() {
    const connectionString = process.env.SIGNALR_CONNECTION_STRING;

    if (!connectionString) {
      console.log('⚠️  SignalR connection string not found — using WebSocket fallback for development');
      this.useWebSocketFallback = true;
      return;
    }

    try {
      // Parse connection string to extract endpoint
      const endpoint = this.parseConnectionString(connectionString);

      this.connection = new HubConnectionBuilder()
        .withUrl(`${endpoint}/game`)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      await this.connection.start();
      console.log('✅ SignalR Service connected');
    } catch (error) {
      console.error('❌ SignalR connection failed:', error);
      console.log('⚠️  Falling back to direct WebSocket');
      this.useWebSocketFallback = true;
    }
  }

  async broadcastGameEvent(event: GameEvent) {
    if (this.useWebSocketFallback) {
      // Direct WebSocket handling will be done in index.ts
      return null;
    }

    if (!this.connection) {
      throw new Error('SignalR not initialized');
    }

    try {
      await this.connection.invoke('BroadcastGameEvent', event);
    } catch (error) {
      console.error('Failed to broadcast game event:', error);
      throw error;
    }
  }

  async sendToRoom(roomId: string, event: GameEvent) {
    if (this.useWebSocketFallback) {
      return null;
    }

    if (!this.connection) {
      throw new Error('SignalR not initialized');
    }

    try {
      await this.connection.invoke('SendToRoom', roomId, event);
    } catch (error) {
      console.error('Failed to send to room:', error);
      throw error;
    }
  }

  async notifyPieceMoved(roomId: string, playerId: string, piece: any) {
    const event: GameEvent = {
      type: 'piece_moved',
      roomId,
      playerId,
      data: piece,
    };
    return this.sendToRoom(roomId, event);
  }

  async notifyLineCleared(roomId: string, playerId: string, lines: number, score: number) {
    const event: GameEvent = {
      type: 'line_cleared',
      roomId,
      playerId,
      data: { lines, score },
    };
    return this.sendToRoom(roomId, event);
  }

  async notifyGameOver(roomId: string, playerId: string, finalScore: number) {
    const event: GameEvent = {
      type: 'game_over',
      roomId,
      playerId,
      data: { finalScore },
    };
    return this.sendToRoom(roomId, event);
  }

  async notifyPlayerJoined(roomId: string, playerId: string) {
    const event: GameEvent = {
      type: 'player_joined',
      roomId,
      playerId,
    };
    return this.sendToRoom(roomId, event);
  }

  async notifyPlayerLeft(roomId: string, playerId: string) {
    const event: GameEvent = {
      type: 'player_left',
      roomId,
      playerId,
    };
    return this.sendToRoom(roomId, event);
  }

  isUsingFallback(): boolean {
    return this.useWebSocketFallback;
  }

  private parseConnectionString(connectionString: string): string {
    const match = connectionString.match(/Endpoint=([^;]+)/);
    if (!match) {
      throw new Error('Invalid SignalR connection string format');
    }
    return match[1];
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
    }
  }
}

export const signalRService = new SignalRService();
