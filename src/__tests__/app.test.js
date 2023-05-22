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
    const response = await request(app).get('/api/user');
    expect(response.status).toEqual(200);
  });
});

describe('user', () => {
  it('should create a user', async () => {
    await request(app).post('/api/user').send({
      email: 'test@test.com',
      name: 'test',
      accounts: [
        {
          id: "1cee38a1-a84b-4b7a-8ac7-5fdfd169dedd",
        },
      ],
    });
  });
  it('should get all users', async () => {
    const response = await request(app).get('/api/user');
    expect(response.status).toEqual(200);
  });
  it('should get a user by id', async () => {
    const userId = await request(app).get('/api/user').then(res => res.body.body.users[0].id);
    const response = await request(app).get(`/api/user/${userId}`);
    expect(response.status).toEqual(200);
  });
  it('should update a user by id', async () => {
    const userId = await request(app).get('/api/user').then(res => res.body.body.users[0].id);
    const response = await request(app).put(`/api/user/${userId}`).send({
      email: 'testing@test.com',
      name: 'testing'
    });
    expect(response.status).toEqual(200);
  });
  it('should delete a user by id', async () => {
    const userId = await request(app).get('/api/user').then(res => res.body.body.users[0].id);
    const response = await request(app).delete(`/api/user/${userId}`);
    expect(response.status).toEqual(200);
  });
});
