# Decision: Azure Static Web Apps for Frontend Hosting

**Date:** 2026-03-04  
**Status:** Approved  
**Decider:** Riker (Lead)  
**Context:** Issue #24

## Decision

Use Azure Static Web Apps to host the React frontend with the following configuration:

- **Tier Strategy:** Free tier for dev environment, Standard tier for production
- **Build Configuration:** Vite-based React app in `apps/web` with output to `dist`
- **API Integration:** Parameterized backend linking to Azure Container Apps API
- **Custom Domains:** Support for custom domain configuration per environment
- **Security:** Comprehensive security headers including CSP, X-Frame-Options, and Referrer-Policy

## Rationale

1. **Developer Experience:** Built-in GitHub Actions integration with automatic deployments
2. **Performance:** Global CDN with edge caching, automatic SSL/TLS certificates
3. **Cost Efficiency:** Free tier for development, pay only for production Standard features
4. **Feature Set:** Staging environments, custom domains, built-in authentication support
5. **Azure Integration:** Seamless linking with Azure Container Apps backend

## Implementation

Created:
- `infra/main.bicep`: Static Web App resource with environment-based SKU selection
- `apps/web/staticwebapp.config.json`: SPA routing, security headers, and response overrides

Parameters added for flexibility:
- `customDomain`: Optional custom domain configuration
- `apiBackendUrl`: Backend API resource ID for linked backends feature

## Alternatives Considered

- **Azure App Service:** More expensive, unnecessary compute for static content
- **Azure Blob Storage + CDN:** More complex setup, no built-in GitHub Actions integration
- **Third-party hosting:** Would split infrastructure across providers, increase complexity

## Impact

- Frontend now has production-grade hosting with CDN and SSL
- Automatic deployment pipeline through GitHub Actions
- Staging environments for PR previews
- Reduced operational overhead with managed service
