import retry from 'async-retry';
import database from 'infra/database.js';
import migrator from 'models/migrator.js';

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 5000,
    });

    async function fetchStatusPage() {
      const response = await fetch('http://localhost:3000/api/v1/status');
      if (!response.ok) {
        throw new Error('Web server is not ready');
      }
    }
  }
}

async function clearDatabase() {
  await database.query('drop schema public cascade; create schema public;');
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
};

export default orchestrator;
