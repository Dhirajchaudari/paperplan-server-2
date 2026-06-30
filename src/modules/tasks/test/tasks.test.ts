import request from 'supertest';
import app from '../../../app';
import db from '../../../db/connection';

describe('Tasks Module Integration Tests', () => {
  let agent: request.Agent;

  beforeEach(() => {
    // Reset database state before each test
    db.prepare('DELETE FROM users').run();
    db.prepare('DELETE FROM tasks').run();
  });

  beforeAll(() => {
    agent = request.agent(app);
  });

  afterAll(() => {
    db.close();
  });

  it('unauthenticated POST /tasks returns 401', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Secret Project',
        priority: 'High',
        dueDate: new Date().toISOString(),
        status: 'To Do',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized');
  });

  it('successful POST /tasks (authenticated) returns 201 with created task', async () => {
    // Register and login to set JWT cookie
    await agent
      .post('/auth/register')
      .send({ username: 'taskuser', password: 'password123' });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const validDueDate = tomorrow.toISOString();

    const response = await agent
      .post('/tasks')
      .send({
        title: 'Write unit tests',
        description: 'Ensure Jest covers critical requirements',
        priority: 'High',
        assignee: 'Developer',
        dueDate: validDueDate,
        status: 'To Do',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Write unit tests');
    expect(response.body.priority).toBe('High');
    expect(response.body.status).toBe('To Do');
    expect(response.body.assignee).toBe('Developer');
    expect(response.body.dueDate).toBe(validDueDate);
  });

  it('POST /tasks with missing title returns 400 with validation message', async () => {
    await agent
      .post('/auth/register')
      .send({ username: 'taskuser2', password: 'password123' });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const response = await agent
      .post('/tasks')
      .send({
        priority: 'Medium',
        dueDate: tomorrow.toISOString(),
        status: 'To Do',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'title is required');
  });

  it('POST /tasks with invalid schema fields returns 400', async () => {
    await agent
      .post('/auth/register')
      .send({ username: 'taskuser3', password: 'password123' });

    // Test invalid priority value
    let response = await agent
      .post('/tasks')
      .send({
        title: 'Invalid Priority',
        priority: 'Critical',
        dueDate: new Date().toISOString(),
        status: 'To Do',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('priority must be one of Low/Medium/High');

    // Test invalid status value
    response = await agent
      .post('/tasks')
      .send({
        title: 'Invalid Status',
        priority: 'Medium',
        dueDate: new Date().toISOString(),
        status: 'In Queue',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('status must be one of To Do/In Progress/Done');

    // Test past dueDate value
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    response = await agent
      .post('/tasks')
      .send({
        title: 'Past Due Date',
        priority: 'Medium',
        dueDate: yesterday.toISOString(),
        status: 'To Do',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('dueDate cannot be in the past');
  });

  it('GET /tasks/:id with non-existent id returns 404', async () => {
    const response = await request(app).get('/tasks/99999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Task not found');
  });
});
