import { leaderboardContainer } from './cosmos';

export interface ScoreEntry {
  id: string;
  playerId: string;
  score: number;
  gameMode: string;
  timestamp: number;
}

export async function submitScore(
  playerId: string,
  score: number,
  gameMode: string,
  timestamp: number
): Promise<ScoreEntry> {
  const entry: ScoreEntry = {
    id: `${playerId}-${timestamp}`,
    playerId,
    score,
    gameMode,
    timestamp,
  };

  const { resource } = await leaderboardContainer.items.create(entry);
  return resource as ScoreEntry;
}

export async function getTopScores(
  gameMode: string,
  limit: number = 10
): Promise<ScoreEntry[]> {
  const querySpec = {
    query: 'SELECT * FROM c WHERE c.gameMode = @gameMode ORDER BY c.score DESC OFFSET 0 LIMIT @limit',
    parameters: [
      { name: '@gameMode', value: gameMode },
      { name: '@limit', value: limit },
    ],
  };

  const { resources } = await leaderboardContainer.items
    .query<ScoreEntry>(querySpec)
    .fetchAll();

  return resources;
}

export async function getPlayerScores(playerId: string): Promise<ScoreEntry[]> {
  const querySpec = {
    query: 'SELECT * FROM c WHERE c.playerId = @playerId ORDER BY c.timestamp DESC',
    parameters: [{ name: '@playerId', value: playerId }],
  };

  const { resources } = await leaderboardContainer.items
    .query<ScoreEntry>(querySpec)
    .fetchAll();

  return resources;
}
