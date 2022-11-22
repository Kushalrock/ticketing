import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});
it('returns a 400 on invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'testtest.com',
        password: 'password'
      })
      .expect(400);
  });

it('returns a 400 on invalid password', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'p'
      })
      .expect(400);
  });

it('returns a 400 on missing email and password', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        
      })
      .expect(400);
  });

  it('disallowed same email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(201);
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(400);
  });

it('set state cookie after signup', async () => {
    const resp =  await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(201);
    

      expect(resp.get('Set-Cookie')).toBeDefined();
  });
  