// Express + WebSocket server with SignalR integration
import { signalRService } from './signalr';

const PORT = process.env.PORT || 3001;

async function startServer() {
  console.log(`🎮 Squad Tetris API starting on port ${PORT}...`);

  // Initialize SignalR Service (falls back to WebSocket if not configured)
  await signalRService.initialize();

  if (signalRService.isUsingFallback()) {
    console.log('🔌 Development mode: Direct WebSocket will be used');
  } else {
    console.log('☁️  Production mode: Azure SignalR Service connected');
  }

  // TODO: Set up Express app
  // TODO: Set up WebSocket server for real-time game state (fallback mode)
  // TODO: Connect game engine for move validation
  // TODO: Implement room management

  console.log(`✅ Server ready on port ${PORT}`);
}

startServer().catch((error) => {
  console.error('❌ Server startup failed:', error);
  process.exit(1);
});
