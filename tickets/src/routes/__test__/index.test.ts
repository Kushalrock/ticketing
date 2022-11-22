import request from 'supertest';
import { app } from '../../app';

it('returns the ticket if the ticket is found', async () => {
    const title = 'concert';
    const price = 20;
  
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price,
      })
      .expect(201);
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price,
      })
      .expect(201);
  
    const response = await request(app).get('/api/tickets').send().expect(200);

    expect(response.body.length).toEqual(2);
  });