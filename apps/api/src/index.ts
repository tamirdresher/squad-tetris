import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { signalRService } from './signalr';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TODO: Set up WebSocket server for real-time game state
// TODO: Connect game engine for move validation
// TODO: Implement room management

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  // Initialize SignalR Service (falls back to WebSocket if not configured)
  await signalRService.initialize();

  if (signalRService.isUsingFallback()) {
    console.log('🔌 Development mode: Direct WebSocket will be used');
  } else {
    console.log('☁️  Production mode: Azure SignalR Service connected');
  }

  app.listen(PORT, () => {
    console.log(`🎮 Squad Tetris API running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('❌ Server startup failed:', error);
  process.exit(1);
});
