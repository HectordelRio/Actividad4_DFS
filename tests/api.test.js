const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Pruebas Unitarias', () => {
    
    
    beforeAll(async () => {
        
        await new Promise(resolve => setTimeout(resolve, 1500)); 
    });

    it('Debería loguear al admin', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@test.com', password: '123' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('Debería denegar acceso sin token', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(401);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});