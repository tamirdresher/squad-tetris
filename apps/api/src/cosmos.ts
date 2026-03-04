import { CosmosClient, Database, Container } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

if (!endpoint || !key) {
  throw new Error('COSMOS_ENDPOINT and COSMOS_KEY environment variables must be set');
}

export const client = new CosmosClient({ endpoint, key });
export const database: Database = client.database('squad-tetris-db');
export const leaderboardContainer: Container = database.container('leaderboard');
export const playersContainer: Container = database.container('players');
