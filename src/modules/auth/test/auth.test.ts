import request from 'supertest';
import app from '../../../app';
import db from '../../../db/connection';

describe('Auth Module Integration Tests', () => {
  beforeEach(() => {
    // Clean up users database table
    db.prepare('DELETE FROM users').run();
  });

  afterAll(() => {
    db.close();
  });

  it('successful register returns 201 and sets cookie', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser');
    expect(response.body).not.toHaveProperty('passwordHash');

    // Verify cookie headers are present and set properly
    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('token=');
    expect(cookies[0]).toContain('HttpOnly');
  });

  it('register with already taken username returns 400', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'anotherpassword' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username is already taken');
  });

  it('login with wrong password returns 401', async () => {
    // Create user first
    await request(app)
      .post('/auth/register')
      .send({ username: 'loginuser', password: 'password123' });

    // Attempt login with wrong password
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'loginuser', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid username or password');
  });

  it('login with correct credentials returns 200 and sets cookie', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'loginuser2', password: 'password123' });

    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'loginuser2', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('loginuser2');

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('token=');
  });
});
