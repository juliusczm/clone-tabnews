import orchestrator from 'tests/orchestrator.js';
import { version as uuidVersion } from 'uuid';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('GET /api/v1/users/[username]', () => {
  describe('Anonymous user', () => {
    test('with exact case match', async () => {
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'SameCase',
          email: 'same.case@gmail.com',
          password: 'senha123',
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch('http://localhost:3000/api/v1/users/SameCase');

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: 'SameCase',
        email: 'same.case@gmail.com',
        password: 'senha123',
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });

    test('with case mismatch', async () => {
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'DiferentCase',
          email: 'diferent.case@gmail.com',
          password: 'senha123',
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch('http://localhost:3000/api/v1/users/Diferentcase');

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: 'DiferentCase',
        email: 'diferent.case@gmail.com',
        password: 'senha123',
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });

    test('with nonexistent username', async () => {
      const response = await fetch('http://localhost:3000/api/v1/users/NonexistentUser');

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: 'NotFoundError',
        message: 'O username informado não foi encontrado no sistema.',
        action: 'Verifique se o username está digitado corretamente.',
        status_code: 404,
      });
    });
  });
});
