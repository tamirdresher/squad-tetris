import express, { Express, Request, Response } from 'express';
import { healthCheck, readyCheck, markAsReady } from './health';

const PORT = process.env.PORT || 3001;

const app: Express = express();

app.use(express.json());

app.get('/health', healthCheck);
app.get('/ready', readyCheck);

app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Squad Tetris API',
    version: '0.1.0',
    status: 'running',
  });
});

async function startServer(): Promise<void> {
  try {
    console.log(`🎮 Squad Tetris API starting on port ${PORT}...`);
    
    // TODO: Initialize dependencies (DB, WebSocket, etc.)
    // For now, mark as ready immediately
    await new Promise(resolve => setTimeout(resolve, 100));
    markAsReady();
    
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
      console.log(`🚦 Ready: http://localhost:${PORT}/ready`);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
