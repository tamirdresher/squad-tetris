# Azure CDN for Static Assets

**Date:** 2026-03-04  
**Author:** Riker (Lead)  
**Issue:** #30 — Add CDN configuration for static assets  
**Branch:** `squad/30-cdn-config`  
**Status:** Implemented

## Decision

Add Azure CDN (Standard Microsoft tier) in front of Azure Static Web Apps to optimize static asset delivery with intelligent caching policies.

## Context

The React SPA generates static assets (JS bundles, CSS, images, fonts) that benefit from edge caching. Static Web Apps includes basic CDN, but explicit CDN configuration provides:
- Fine-grained cache control per asset type
- Better performance for global users
- Reduced origin load during traffic spikes
- Cost optimization through aggressive edge caching

## Implementation

### Infrastructure (infra/main.bicep)

**CDN Profile:**
- Standard Microsoft tier (cost-efficient for moderate traffic)
- Global location for worldwide edge distribution

**CDN Endpoint:**
- Origin: Azure Static Web App hostname
- HTTPS enforcement (HTTP disabled)
- Compression: JS, CSS, HTML, JSON (gzip/brotli)

**Caching Rules (Delivery Policy):**

1. **Immutable Assets** (`/assets/*.{js,css,woff,woff2,ttf,png,jpg,svg,ico}`)
   - Cache duration: 1 year (365 days)
   - Behavior: SetIfMissing (respects existing headers)
   - Rationale: Vite generates content-hashed filenames, making assets immutable

2. **HTML Files** (`*.html`)
   - Cache duration: 5 minutes
   - Behavior: Override (enforce fresh content)
   - Rationale: SPA entry point must refresh frequently for new deployments

3. **API Pass-through** (`/api/*`)
   - Cache behavior: BypassCache
   - Rationale: API responses are dynamic and user-specific

**Custom Domain Support:**
- Parameterized `cdnCustomDomain` for production DNS configuration
- Conditional resource creation

### Build Configuration (apps/web/vite.config.ts)

Content hashing ensures:
- Cache-friendly immutable assets
- Automatic cache busting on updates
- No manual cache purge needed

## Trade-offs

**Benefits:**
- Faster asset delivery from edge locations
- Reduced Static Web App origin load
- Cost-effective caching (less origin bandwidth)
- Automatic SSL termination at CDN edge
- Global performance improvement

**Considerations:**
- Additional Azure resource to manage
- Cache propagation delay (~5-15 minutes) on deployments
- Standard Microsoft tier has basic feature set (vs Premium Verizon)

**Why Standard Microsoft?**
- Cost-efficient for startup/moderate traffic
- Sufficient features for static asset caching
- Upgrade path to Premium if advanced features needed

## Future Enhancements

- Add Application Insights integration for CDN telemetry
- Implement cache purge automation in CI/CD pipeline
- Consider Premium tier for real-time cache purge and advanced analytics

## References

- Azure CDN Documentation: https://learn.microsoft.com/en-us/azure/cdn/
- Vite Build Options: https://vitejs.dev/config/build-options.html
- Issue #30: tamirdresher/squad-tetris#30
