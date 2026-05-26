import request from 'supertest';
import app from '../../src/app.js';
import { UserModel } from '../../src/modules/users/user.model.js';

describe('Auth Endpoints Integration', () => {
  const registerPayload = {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user and set a cookie on success', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(registerPayload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Alice');
      expect(res.body.email).toBe('alice@example.com');
      expect(res.body).not.toHaveProperty('passwordHash');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=');
    });

    it('should reject registration if fields do not match validation schemas', async () => {
      const invalidPayload = {
        name: 'A', // too short
        email: 'not-an-email',
        password: '123', // too short
        confirmPassword: '456',
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toBeDefined();
    });

    it('should reject duplicate email registration with 409 conflict', async () => {
      await request(app).post('/api/auth/register').send(registerPayload);

      const res = await request(app)
        .post('/api/auth/register')
        .send(registerPayload);

      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate valid credentials and set cookie', async () => {
      await request(app).post('/api/auth/register').send(registerPayload);

      const res = await request(app).post('/api/auth/login').send({
        email: registerPayload.email,
        password: registerPayload.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(registerPayload.email);

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=');
    });

    it('should reject login for wrong credentials with 401', async () => {
      await request(app).post('/api/auth/register').send(registerPayload);

      const res = await request(app).post('/api/auth/login').send({
        email: registerPayload.email,
        password: 'WrongPassword!',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info when authenticated via cookie', async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .send(registerPayload);

      const cookie = regRes.headers['set-cookie'][0].split(';')[0];

      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [cookie]);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(registerPayload.email);
    });

    it('should return 401 unauthorized when cookie is absent', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
