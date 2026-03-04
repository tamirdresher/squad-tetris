# @squad-tetris/game-engine

Shared Tetris game logic used by both frontend and backend.

## Squad: Backend Team

Core game engine including:
- Board state management
- Piece movement and rotation
- Collision detection
- Line clearing and scoring
- Multiplayer garbage lines

## Usage

```typescript
import { createGameState, BOARD_WIDTH, BOARD_HEIGHT } from '@squad-tetris/game-engine';

const state = createGameState();
```
