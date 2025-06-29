import migrationRunner from 'node-pg-migrate';
import database from 'infra/database.js';
import { resolve } from 'node:path';
import { ServiceError } from 'infra/errors.js';

const migrateDefaultOptions = {
  dryRun: true,
  dir: resolve('infra', 'migrations'),
  direction: 'up',
  log: () => {},
  migrationsTable: 'pgmigrations',
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...migrateDefaultOptions,
      dbClient,
    });
    await dbClient.end();
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...migrateDefaultOptions,
      dbClient,
      dryRun: false,
    });
    await dbClient.end();

    return migratedMigrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: 'Erro na execução das migrations',
      cause: error,
    });

    throw serviceErrorObject;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
