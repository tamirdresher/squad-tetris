# SignalR Architecture Decision

**Date:** 2026-03-04  
**Author:** Riker (Lead)  
**Issue:** #22  

## Decision

Adopt Azure SignalR Service in **Serverless mode** as the WebSocket scaling solution for squad-tetris multiplayer.

## Rationale

1. **Serverless Mode:** Pay-per-message pricing eliminates idle costs during low usage. Ideal for a game with variable player counts.

2. **Standard Tier (S1):** Provides 1,000 concurrent connections and 1M messages/day — sufficient for initial launch, scalable to Premium if needed.

3. **Development Fallback:** Service layer auto-detects missing connection string and falls back to direct WebSocket. No separate dev infrastructure required.

4. **Typed Event API:** Strongly-typed game events (piece_moved, line_cleared, etc.) enforce consistency across client/server communication.

## Implementation

- **Infrastructure:** `infra/main.bicep` — SignalR resource with CORS enabled for cross-origin frontend access
- **Backend Service:** `apps/api/src/signalr.ts` — Abstraction layer handling both Azure SignalR and WebSocket fallback
- **Integration:** `apps/api/src/index.ts` — Initializes SignalR on server startup with error handling

## Impact on Teams

- **Backend Team:** Use `signalRService.notifyX()` methods for game events
- **UI Team:** Connect to SignalR endpoint (documented separately)
- **Cloud Team:** Deploy SignalR via Bicep, manage connection strings in Azure

## Future Considerations

- Monitor message usage to optimize Serverless billing
- Consider Premium tier if concurrent users exceed 1,000
- Add Redis backplane for multi-region if latency requires geographic distribution
