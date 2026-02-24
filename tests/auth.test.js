const request = require('supertest');
const app = require('../server');

describe('Pruebas de Rutas', () => {
  test('La ruta de login debe responder algo (aunque sea un error 400)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: "test@test.com", password: "123" });
    
    // Si responde 400 o 401, el test PASA porque la ruta existe
    expect(res.statusCode).not.toBe(404);
  });
});