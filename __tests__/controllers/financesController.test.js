const supertest = require('supertest');
const { connectionToDB } = require('../../src/database');
const { app } = require('../../src/app');
const { cleanDB, getValidToken } = require('../sideFunctions/sideFunctions');

beforeAll(cleanDB);
afterAll(async () => {
    await cleanDB();
    connectionToDB.end();
});

describe("get user's operation", () => {
    it("should return 200 if user's data is correctly sent", async () => {
        const token = await getValidToken();

        const response = await supertest(app)
            .get('/finances/user-operations')
            .set({Authorization: `Bearer ${token}`})

        expect(response.status).toBe(200);
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
});

describe('post new operation', () => {    
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