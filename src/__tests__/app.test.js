const request = require('supertest');
const app = require('../app');

describe('app', () => {
  it('should export the express app correctly', () => {
    expect(app).toBeTruthy();
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown-route');
    expect(response.status).toEqual(404);
  });

  it('should return 200 for the root route', async () => {
    const response = await request(app).get('/api/user/c3c3a799-61b4-4b30-a10e-237056bd5c85');
    expect(response.status).toEqual(200);
  });
});
