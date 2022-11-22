import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper');

it('Has a route handler listening to /api/tickets for post requests', async() => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
});
it('Can only be accessed by signed in user', async() => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).toEqual(401);
});
it('The status 401 is not returned even if the user is signed in', async() => {
    const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({});
    expect(response.status).not.toEqual(401);
});
it('Returns an error if invalid title is provided', async() => {
    await request(app).post('/api/tickets')
    .set('Cookie', global.signin()).send({
        title: '',
        price: 10
    }).expect(400);
    await request(app).post('/api/tickets')
    .set('Cookie', global.signin()).send({
        price: 10
    }).expect(400);
});
it('Returns error if invalid price is provided', async() => {
    await request(app).post('/api/tickets')
    .set('Cookie', global.signin()).send({
        title: 'asucgusacu',
        price: -10
    }).expect(400);
    await request(app).post('/api/tickets')
    .set('Cookie', global.signin()).send({
        title: 'ugicqvcqv'
    }).expect(400);
});
it('Creates a ticket with valid inputs', async() => {
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);
    
    await request(app).post('/api/tickets')
    .set('Cookie', global.signin()).send({
        title: 'asucgusacu',
        price: 10
    }).expect(201);
    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
});


it("Publishes an event",  async () => {
    await request(app).post('/api/tickets')
    .set('Cookie', global.signin()).send({
        title: 'asucgusacu',
        price: 10
    }).expect(201);
    

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
