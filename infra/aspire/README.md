# Squad Tetris — .NET Aspire AppHost

Local development orchestration using .NET Aspire for the Squad Tetris multiplayer game.

## What is This?

.NET Aspire is a cloud-ready stack for building observable, production-ready distributed applications. This AppHost project orchestrates our local development environment, managing:

- **Web App** (React + Vite) on port 3000
- **API Server** (Express + WebSocket) on port 3001
- Service discovery and dependency management
- Observability and telemetry (logs, traces, metrics)

## Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [.NET Aspire workload](https://learn.microsoft.com/dotnet/aspire/fundamentals/setup-tooling)

Install the Aspire workload:

```bash
dotnet workload update
dotnet workload install aspire
```

## Getting Started

### 1. Install Dependencies

From the repository root:

```bash
npm install
```

### 2. Run with Aspire

From the `infra/aspire` directory:

```bash
cd infra/aspire
dotnet run --project AppHost
```

This will:
- Start the Aspire Dashboard at http://localhost:15000
- Launch the API server (port 3001)
- Launch the Web app (port 3000)
- Wire up service discovery and observability

### 3. Access the Apps

- **Aspire Dashboard**: http://localhost:15000 — View logs, traces, metrics
- **Web App**: http://localhost:3000 — React frontend
- **API Server**: http://localhost:3001 — Express backend

## Project Structure

```
infra/aspire/
├── AppHost/              # Main orchestration project
│   ├── Program.cs        # Service definitions
│   ├── AppHost.csproj
│   └── Properties/
│       └── launchSettings.json
├── ServiceDefaults/      # Shared configuration (telemetry, health checks)
│   ├── Extensions.cs
│   └── ServiceDefaults.csproj
├── SquadTetris.sln       # Solution file
└── README.md             # This file
```

## How It Works

The `AppHost/Program.cs` uses Aspire's Node.js hosting support:

- **AddNpmApp()** — Runs `npm run dev:api` and `npm run dev:web` from the repo root
- **WithHttpEndpoint()** — Configures ports and environment variables
- **WithEnvironment()** — Passes the API URL to the web app (VITE_API_URL)
- **PublishAsDockerFile()** — Enables future container deployment

## Development Workflow

1. **Start everything**: `dotnet run --project AppHost`
2. **Make changes** to API or Web code — Aspire restarts services automatically
3. **View telemetry** in the Aspire Dashboard (http://localhost:15000)
4. **Stop**: Ctrl+C in the terminal

## Adding Services

To add a new service (e.g., Redis, PostgreSQL):

```csharp
// In AppHost/Program.cs
var redis = builder.AddRedis("cache");

var api = builder.AddNpmApp("api", nodeWorkingDir, "dev:api")
    .WithReference(redis) // Injects connection string
    .WithHttpEndpoint(port: 3001);
```

## Troubleshooting

**Ports already in use:**
- Stop any running instances of the web or api apps
- Change ports in `Program.cs` if needed

**Aspire Dashboard not loading:**
- Ensure ports 15000, 19999, 20000 are available
- Check `launchSettings.json` for configuration

**Node.js apps not starting:**
- Verify `npm install` has been run in the repo root
- Check that `package.json` scripts `dev:web` and `dev:api` work independently

## Learn More

- [.NET Aspire Documentation](https://learn.microsoft.com/dotnet/aspire/)
- [Node.js Integration](https://learn.microsoft.com/dotnet/aspire/get-started/build-aspire-apps-with-nodejs)
- [Aspire Dashboard](https://learn.microsoft.com/dotnet/aspire/fundamentals/dashboard)
