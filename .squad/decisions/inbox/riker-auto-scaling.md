# Auto-Scaling Strategy for Game Servers

**Date:** 2026-03-04  
**Author:** Riker (Lead)  
**Issue:** #29 — Implement auto-scaling rules for game servers  
**Status:** Implemented  
**Branch:** `squad/29-auto-scaling`

## Decision

Implement multi-metric auto-scaling rules for Azure Container Apps API service with game-specific optimizations.

### Scaling Configuration

**Environment-specific replica limits:**
- **Dev:** Min 1, Max 3
- **Staging:** Min 1, Max 10  
- **Prod:** Min 1, Max 20

**Scaling Rules:**
1. **HTTP Concurrent Requests:** Scale when > 50 connections per replica (tracks active WebSocket connections)
2. **CPU Utilization:** Scale at 70% CPU threshold (handles game state computation load)

**Stability Controls:**
- Scale-to-zero disabled (always minimum 1 replica for game availability)
- Cool-down period: 60 seconds to prevent thrashing during connection spikes

## Rationale

WebSocket connections for multiplayer Tetris are long-lived (5-15 minutes per game). Traditional request/response metrics don't reflect this load pattern. Players expect instant availability and cannot tolerate cold-start delays or mid-game disconnections.

**Metric Selection:**
- **HTTP Concurrent Requests (50/replica):** Container Apps tracks persistent connections as concurrent requests. 50 connections per replica ≈ 12-25 active games (2-4 players each).
- **CPU Utilization (70%):** Game state management is CPU-intensive. 70% threshold provides buffer for computational spikes while complementing connection-based scaling.
- **Cool-down (60 seconds):** Prevents scale-down thrashing during brief connection dips while protecting game sessions.

**Always-On Strategy (Scale-to-zero disabled):**
- User Experience: Instant game availability, no cold-start delays
- Cost: ~$20-30/month baseline for 1 replica
- Trade-off: Worth the cost to ensure professional gaming experience

## Future Enhancements

1. Application Insights custom metrics to track active game session count directly
2. Multi-region deployment for latency optimization  
3. Predictive scaling based on historical load patterns
4. Connection draining optimization for graceful replica shutdown

## Trade-offs

**Pros:**
- Balanced scaling across connection count and CPU load
- Protects active game sessions during scale transitions
- Professional gaming experience with instant availability

**Cons:**
- Higher baseline cost (always-on replica)
- Longer cool-down may delay scale-down cost savings
- No custom WebSocket metrics (requires Application Insights integration)
