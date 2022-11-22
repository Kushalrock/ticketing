import request from 'supertest';
import { app } from '../../app';

it('Fails when a email doesnot exist supplied', async () => {
    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(400);
  });
  it('Fails when a incorrect password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(201);
    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'pass'
      })
      .expect(400);
  });
  it('Fails when a incorrect password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(201);
    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
  });