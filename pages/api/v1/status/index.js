import { createRouter } from 'next-connect';
import database from 'infra/database.js';
import controller from 'infra/controller.js';

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const updatedAt = new Date().toISOString();
  const dbVersionResult = await database.query('SHOW server_version;');
  const dbVersionValue = dbVersionResult.rows[0].server_version;
  const dbMaxConnectionsResult = await database.query('SHOW max_connections;');

  const dbName = process.env.POSTGRES_DB;
  const dbMaxConnectionsValue = dbMaxConnectionsResult.rows[0].max_connections;
  const dbOpenedConnectionsResult = await database.query({
    text: 'SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;',
    values: [dbName],
  });
  const dbOpenedConnectionsValue = dbOpenedConnectionsResult.rows[0].count;

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        //status: null,
        max_connections: parseInt(dbMaxConnectionsValue),
        opened_connections: dbOpenedConnectionsValue,
        version: dbVersionValue,
      },
    },
  });
}
