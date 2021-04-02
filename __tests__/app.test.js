require('dotenv').config();
const supertest = require('supertest');
const app = require('../src/app');
const agent = supertest(app);
const connectionToDB = require('../src/database');

const {
  cleanDB,
  createUserAndSession,
  getUserSession,
  createTestFinance
} = require('./utils');

beforeEach(cleanDB);
afterAll(async () => {
  await cleanDB();
  connectionToDB.close();
});

describe('POST /users/sign-up', () => {
  it('should return status code 201 and created user data if correct inputs are sent', async () => {
    const body = {
      name: 'Test',
      email: 'automated-test@gmail.com',
      password: '123456',
      passwordConfirmation: '123456'
    };

    const response = await agent.post('/users/sign-up').send(body);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'Test',
      email: 'automated-test@gmail.com'
    });
  });

  it('should return 409 for repeated emails', async () => {
    await createUserAndSession(); // uses the same email of the following body
    const body = {
      name: 'Test',
      email: 'automated-test@gmail.com',
      password: '123456',
      passwordConfirmation: '123456'
    };

    const response = await agent.post('/users/sign-up').send(body);

    expect(response.status).toBe(409);
  });

  it('should return 422 in case of receiving invalid data', async () => {
    const body = {
      email: 'abc@gmail.com',
      password: '123456',
      passwordConfirmation: '123456'
    };

    const response = await agent.post('/users/sign-up').send(body);

    expect(response.status).toBe(422);
  });
});

describe('POST /users/sign-in', () => {
  it('should return 201 if receiving data matches an user in DB', async () => {
    await createUserAndSession();
    const body = {
      email: 'automated-test@gmail.com',
      password: '123456'
    };

    const response = await agent.post('/users/sign-in').send(body);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Test',
      email: 'automated-test@gmail.com',
      token: expect.any(String)
    });
  });

  it("should return 404 if receiving data doesn't match any user in DB", async () => {
    const body = {
      email: 'automated-test-with-invalid-data@gmail.com',
      password: '123456'
    };

    const response = await agent.post('/users/sign-in').send(body);

    expect(response.status).toBe(404);
  });

  it('should return 401 if receiving password does not match the correspondent user in DB', async () => {
    await createUserAndSession();
    const body = {
      email: 'automated-test@gmail.com',
      password: '1234567890'
    };

    const response = await agent.post('/users/sign-in').send(body);

    expect(response.status).toBe(401);
  });
});

describe('POST /users/sign-out', () => {
  it('should destroy user session and return status code 204 if sign out process has been completed', async () => {
    const user = await createUserAndSession();

    const response = await agent
      .post('/users/sign-out')
      .set('Authorization', `Bearer ${user.session.token}`);

    const userSession = await getUserSession(user.session.id);

    expect(userSession).toBeNull();
    expect(response.status).toBe(204);
  });

  it('should return status code 401 if Authorization header is not sent', async () => {
    const response = await agent.post('/users/sign-out');

    expect(response.status).toBe(401);
  });

  it('should return status code 401 if invalid token is sent', async () => {
    const response = await agent
      .post('/users/sign-out')
      .set('Authorization', 'Bearer invalidToken');

    expect(response.status).toBe(401);
  });
});

describe("GET /finances", () => {
  it("should return 200 if user's data is correctly sent", async () => {
    const user = await createUserAndSession();
    await createTestFinance(user.id); // see used data in creation

    const response = await supertest(app)
      .get('/finances')
      .set({ Authorization: `Bearer ${user.session.token}` });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: expect.any(Number),
        userId: user.id,
        type: 'Income',
        value: 5.55,
        description: 'Test'
      })
    ]);
  });

  it('should return 401 if Authorization header is not sent', async () => {
    const response = await supertest(app).get('/finances');

    expect(response.status).toBe(401);
  });

  it('should return 401 if an invalid token is sent', async () => {
    const token = 'aacaba9-aascns1az-adfm2mqpq';

    const response = await supertest(app)
      .get('/finances')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(401);
  });
});

describe('POST /finances', () => {    
  it('should return 201 for correct inputs', async () => {
    const user = await createUserAndSession();
    const body = {
      value: '11,90',
      description: 'automated test',
      type: 'Expense'
    };

    const response = await supertest(app)
        .post('/finances')
        .set({Authorization: `Bearer ${user.session.token}`})
        .send(body);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: user.id,
        type: 'Expense',
        value: -11.9,
        description: 'automated test'
      })
    );
  });

  it('should return 201 even if description string is empty', async () => {
    const user = await createUserAndSession();

    const body = {
      value: '11,90',
      description: '',
      type: 'Income'
    };

    const response = await supertest(app)
      .post('/finances')
      .set({ Authorization: `Bearer ${user.session.token}` })
      .send(body);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: user.id,
        type: 'Income',
        value: 11.9,
        description: ''
      })
    );
  });

  it('should return 401 if Authorization header is not sent', async () => {
    const body = {
      value: '11,90',
      description: 'automated test',
      type: 'Income'
    };

    const response = await supertest(app).post('/finances').send(body);

    expect(response.status).toBe(401);
  });

  it('should return 403 if an invalid token is sent', async () => {
    const token = 'aacaba9-aascns1az-adfm2mqpq';
    const body = {
      value: '11,90',
      description: 'automated test',
      type: 'Expense'
    };

    const response = await supertest(app)
      .post('/finances')
      .set({ Authorization: `Bearer ${token}` })
      .send(body);

    expect(response.status).toBe(401);
  });

  it('should return 422 if an invalid value pattern is sent', async () => {
    const user = await createUserAndSession();
    const body = {
      value: '11.90',
      description: 'automated test',
      type: 'Expense'
    };

    const response = await supertest(app)
      .post('/finances')
      .set({ Authorization: `Bearer ${user.session.token}` })
      .send(body);

    expect(response.status).toBe(422);
  });

  it('should return 422 if an operation type is not sent', async () => {
    const user = await createUserAndSession();
    const body = {
      value: '11,90',
      description: 'automated test'
    };

    const response = await supertest(app)
      .post('/finances')
      .set({ Authorization: `Bearer ${user.session.token}` })
      .send(body);

    expect(response.status).toBe(422);
  });
});