const supertest = require('supertest');
const { app } = require('../../src/app');
const { connectionToDB } = require('../../src/database');
const { cleanDB, getValidToken } = require('../sideFunctions/sideFunctions');

beforeAll(cleanDB);
afterAll(async () => {
    await cleanDB();
    connectionToDB.end();
});

describe('signUp', () => {
    it('should return 201 for correct inputs', async () => {
        const body = {
            name: 'automated test',
            email: 'automated-test@gmail.com',
            password: '123456',
            passwordConfirmation: '123456'
        };
        
        const response = await supertest(app).post('/user/sign-up').send(body);

        expect(response.status).toBe(201);
    });

    it('should return 409 for repeated emails', async () => {
        const body = {
            name: 'Fulano',
            email: 'automated-test@gmail.com',
            password: '123456',
            passwordConfirmation: '123456'
        };
        
        const response = await supertest(app).post('/user/sign-up').send(body);

        expect(response.status).toBe(409);
    });

    it('should return 400 in case of receiving invalid data', async () => {
        const body = {
            email: 'abc@gmail.com',
            password: '123456',
            passwordConfirmation: '123456'
        };
        
        const response = await supertest(app).post('/user/sign-up').send(body);

        expect(response.status).toBe(400);
    });
});

describe('signIn', () => {
    it('should return 200 if receiving data matches an user in DB', async () => {
        const body = {
            email: 'automated-test@gmail.com',
            password: '123456'
        };

        const response = await supertest(app).post('/user/sign-in').send(body);

        expect(response.status).toBe(200);
    });

    it("should return 404 if receiving data doesn't match any user in DB", async () => {
        const body = {
            email: 'automated-test-with-invalid-data@gmail.com',
            password: '123456'
        };

        const response = await supertest(app).post('/user/sign-in').send(body);

        expect(response.status).toBe(404);
    });

    it("should return 401 if receiving password doesn't match the correspondent user in DB", async () => {
        const body = {
            email: 'automated-test@gmail.com',
            password: '1234567890'
        };

        const response = await supertest(app).post('/user/sign-in').send(body);

        expect(response.status).toBe(401);
    });
});

describe('signOut', () => {
    it('should return 200 if the user logs out successfully', async () => {

    });
});