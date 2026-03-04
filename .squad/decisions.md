# Squad Decisions

## Active Decisions

### Azure CDN for Static Assets (#30)

**Date:** 2026-03-04  
**Author:** Riker (Lead)  
**Status:** Implemented  
**Branch:** `squad/30-cdn-config`  

Add Azure CDN (Standard Microsoft tier) in front of Azure Static Web Apps for static asset delivery with intelligent caching policies.

**Implementation:**
- Standard Microsoft tier CDN profile with global edge distribution
- Caching rules: 1-year immutable assets (content-hashed), 5-minute HTML, API pass-through
- HTTPS enforcement and compression (JS, CSS, HTML, JSON)
- Custom domain support for production DNS

**Rationale:** Vite generates content-hashed filenames, making assets immutable. CDN significantly reduces origin load and improves global performance. Standard tier cost-effective for startup phase.

**Trade-offs:** Additional Azure resource to manage; cache propagation delay (~5-15 min); upgrade path to Premium tier if advanced features needed.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
