import { Request, Response } from 'express';

export interface DependencyCheck {
  name: string;
  check: () => Promise<boolean>;
}

interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
}

interface ReadyResponse {
  status: 'ready' | 'starting';
  timestamp: string;
  dependencies?: Record<string, 'ok' | 'fail'>;
}

const dependencies: DependencyCheck[] = [];
let isReady = false;

export function registerDependency(check: DependencyCheck): void {
  dependencies.push(check);
}

export function markAsReady(): void {
  isReady = true;
}

export async function healthCheck(req: Request, res: Response): Promise<void> {
  const response: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
  };
  
  res.status(200).json(response);
}

export async function readyCheck(req: Request, res: Response): Promise<void> {
  if (!isReady) {
    const response: ReadyResponse = {
      status: 'starting',
      timestamp: new Date().toISOString(),
    };
    res.status(503).json(response);
    return;
  }

  const dependencyResults: Record<string, 'ok' | 'fail'> = {};
  let allReady = true;

  for (const dep of dependencies) {
    try {
      const result = await dep.check();
      dependencyResults[dep.name] = result ? 'ok' : 'fail';
      if (!result) {
        allReady = false;
      }
    } catch (error) {
      dependencyResults[dep.name] = 'fail';
      allReady = false;
    }
  }

  const response: ReadyResponse = {
    status: allReady ? 'ready' : 'starting',
    timestamp: new Date().toISOString(),
    dependencies: Object.keys(dependencyResults).length > 0 ? dependencyResults : undefined,
  };

  res.status(allReady ? 200 : 503).json(response);
}
