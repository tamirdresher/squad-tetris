# CI/CD Pipeline Architecture

**Decision Date:** 2026-03-04  
**Author:** Riker  
**Status:** Proposed

## Context

Squad-tetris needs automated build, test, and deployment pipelines to support parallel development across multiple teams and codespaces.

## Decision

Implement three separate GitHub Actions workflows:

1. **CI Workflow** (`ci.yml`):
   - Triggers on all pushes and PRs
   - Builds and tests all workspaces
   - Caches node_modules and build artifacts
   - Gates all code changes

2. **Deploy Workflow** (`deploy.yml`):
   - Triggers only on main branch pushes
   - Separate jobs for API (Container Apps) and web (Static Web Apps)
   - Uses OIDC authentication for Azure
   - Environment protection on production

3. **Infrastructure Workflow** (`infra.yml`):
   - Triggers on changes to `infra/` directory
   - Validates Bicep templates on all changes
   - Deploys only on main branch
   - Uses OIDC for secure authentication

## Rationale

- **Separation of concerns**: CI, deployment, and infrastructure are independent concerns with different triggers
- **Security**: OIDC authentication eliminates need for long-lived service principal credentials
- **Efficiency**: Caching and workspace-level builds optimize pipeline speed
- **Safety**: Environment protection and validation steps prevent bad deployments
- **Monorepo support**: Workflows handle npm workspaces correctly

## Required Secrets

Teams must configure these secrets in GitHub:
- `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` (for OIDC)
- `AZURE_RESOURCE_GROUP`
- `AZURE_CONTAINER_REGISTRY`
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

## Trade-offs

- More workflow files vs. single complex workflow: Chose separation for clarity
- OIDC vs. service principal: Chose OIDC for better security posture
- Build caching complexity: Accepted for faster CI runs

## Next Steps

- Configure Azure OIDC federated credentials
- Set up GitHub environments with protection rules
- Configure required secrets
- Test workflows on first PR
