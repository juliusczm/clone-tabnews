import orchestrator from 'tests/orchestrator.js';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe('GET /api/v1/status', () => {
  describe('Anonymous user', () => {
    test('Retrieving current system status', async () => {
      const response = await fetch('http://localhost:3000/api/v1/status');
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.update_at).toBeDefined();
      const parsedUpdatedAt = new Date(responseBody.update_at).toISOString();
      expect(responseBody.update_at).toEqual(parsedUpdatedAt);

      const { max_connections, opened_connections, version } = responseBody.dependencies.database;
      expect(max_connections).toBe(100);
      expect(opened_connections).toBe(1);
      expect(version).toBe('16.9');
    });
  });
});
