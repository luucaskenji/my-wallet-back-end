const supertest = require('supertest');
const { v4: uuidv4 } = require('uuid');
const { connectionToDB } = require('../../src/database');
const { app } = require('../../src/app');

const getValidToken = async () => {
    const signUpBody = {
        name: 'automated test',
        email: 'automated-test@gmail.com',
        password: '123456'
    };
    let insertionArray = [signUpBody.name, signUpBody.email, signUpBody.password];
    
    const response = await connectionToDB.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, 
        insertionArray
    );
    const testUserId = response.rows[0].id;
    
    const token = uuidv4();
    insertionArray = [testUserId, token]

    await connectionToDB.query(
        `INSERT INTO sessions ("userId", token) VALUES ($1, $2)`,
        insertionArray
    );

    return token;
};

const cleanDB = async () => {
    let testUser;
    const result = await connectionToDB.query("SELECT * FROM users WHERE name = 'automated test'");
    
    if (!result.rows[0]) return;
    else testUser = result.rows[0];

    await connectionToDB.query("DELETE FROM users WHERE name = 'automated test'");
    await connectionToDB.query(`DELETE FROM sessions WHERE "userId" = ${testUser.id}`);
    await connectionToDB.query(`DELETE FROM finances WHERE "authorId" = ${testUser.id}`);
};

beforeAll(cleanDB);
afterAll(async () => {
    await cleanDB();
    connectionToDB.end();
});

describe('postIncome', () => {    
    it('should return 201 for correct inputs', async () => {
        const token = await getValidToken();

        const body = {
            value: '11,90',
            description: 'automated test',
            type: 'Expense'
        };

        const response = await supertest(app)
            .post('/finances/new-operation')
            .set({Authorization: `Bearer ${token}`})
            .send(body);

        expect(response.status).toBe(201);
    });

    it('should return 201 even if description string is empty', async () => {
        const token = await getValidToken();

        const body = {
            value: '11,90',
            description: '',
            type: 'Income'
        };

        const response = await supertest(app)
            .post('/finances/new-operation')
            .set({Authorization: `Bearer ${token}`})
            .send(body);

        expect(response.status).toBe(201);
    });

    it('should return 401 if Authorization header is not sent', async () => {
        const body = {
            value: '11,90',
            description: 'automated test',
            type: 'Income'
        };

        const response = await supertest(app).post('/finances/new-operation').send(body);

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
            .post('/finances/new-operation')
            .set({Authorization: `Bearer ${token}`})
            .send(body);

        expect(response.status).toBe(403);
    });

    it('should return 422 if an invalid value pattern is sent', async () => {
        const token = await getValidToken();

        const body = {
            value: '11.90',
            description: 'automated test',
            type: 'Expense'
        };

        const response = await supertest(app)
            .post('/finances/new-operation')
            .set({Authorization: `Bearer ${token}`})
            .send(body);

        expect(response.status).toBe(422);
    });

    it('should return 422 if an operation type is not sent', async () => {
        const token = await getValidToken();

        const body = {
            value: '11.90',
            description: 'automated test'
        };

        const response = await supertest(app)
            .post('/finances/new-operation')
            .set({Authorization: `Bearer ${token}`})
            .send(body);

        expect(response.status).toBe(422);
    });
});