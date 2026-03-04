var builder = DistributedApplication.CreateBuilder(args);

// Configure Node.js working directory (repository root)
var nodeWorkingDir = Path.GetFullPath(Path.Combine(builder.AppHostDirectory, "..", "..", ".."));

// API Server (Express + WebSocket on port 3001)
var api = builder.AddNpmApp("api", nodeWorkingDir, "dev:api")
    .WithHttpEndpoint(port: 3001, env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

// Web App (Vite dev server on port 3000)
var web = builder.AddNpmApp("web", nodeWorkingDir, "dev:web")
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("http"))
    .PublishAsDockerFile();

builder.Build().Run();
