import * as appInsights from 'applicationinsights';

let isInitialized = false;
let client: appInsights.TelemetryClient | null = null;

/**
 * Initialize Application Insights telemetry
 * Safe to call in local development (graceful no-op when no connection string)
 */
export function initializeTelemetry(): void {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
  
  if (!connectionString) {
    console.log('📊 Application Insights: No connection string found, telemetry disabled (local dev mode)');
    return;
  }

  try {
    appInsights.setup(connectionString)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(false)
      .start();

    client = appInsights.defaultClient;
    isInitialized = true;

    console.log('📊 Application Insights initialized');
  } catch (error) {
    console.error('Failed to initialize Application Insights:', error);
  }
}

/**
 * Track custom metrics for game events
 */
export function trackGameMetric(
  metricName: 'games_started' | 'lines_cleared' | 'matches_completed',
  value: number = 1,
  properties?: Record<string, string>
): void {
  if (!isInitialized || !client) return;

  client.trackMetric({
    name: metricName,
    value,
    properties,
  });
}

/**
 * Track game state changes
 */
export function trackGameTrace(
  message: string,
  severity: 'info' | 'warning' | 'error' = 'info',
  properties?: Record<string, string>
): void {
  if (!isInitialized || !client) return;

  const severityMap = {
    info: appInsights.Contracts.SeverityLevel.Information,
    warning: appInsights.Contracts.SeverityLevel.Warning,
    error: appInsights.Contracts.SeverityLevel.Error,
  };

  client.trackTrace({
    message,
    severity: severityMap[severity],
    properties,
  });
}

/**
 * Track custom events
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, string>,
  measurements?: Record<string, number>
): void {
  if (!isInitialized || !client) return;

  client.trackEvent({
    name: eventName,
    properties,
    measurements,
  });
}

/**
 * Flush telemetry data (useful before shutdown)
 */
export function flushTelemetry(): Promise<void> {
  if (!isInitialized || !client) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    client!.flush({
      callback: () => resolve(),
    });
  });
}
