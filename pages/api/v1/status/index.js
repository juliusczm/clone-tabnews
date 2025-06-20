import database from 'infra/database.js';

export default async function status(req, res) {
  const updateAt = new Date().toISOString();
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
    update_at: updateAt,
    dependencies: {
      database: {
        //status: null,
        max_connections: Number(dbMaxConnectionsValue),
        opened_connections: dbOpenedConnectionsValue,
        version: dbVersionValue,
      },
    },
  });
}
