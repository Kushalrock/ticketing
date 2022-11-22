import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 id doesn\'t exist', async() => {
    const id = new mongoose.Types.ObjectId().toHexString();
    
    await request(app).put(`/api/tickets/${id}`).set('Cookie', global.signin()).send({
        title: 'iuugigiu',
        price: 10
    }).expect(404);
});

it('returns 401 user not authenticated', async() => {
    const id = new mongoose.Types.ObjectId().toHexString();
    
    await request(app).put(`/api/tickets/${id}`).send({
        price: 10
    }).expect(401);
});

it('returns 401 user not owns ticket', async() => {
    const response = await request(app).post(`/api/tickets`).set('Cookie', global.signin()).send({
        title: 'cugsagusuic',
        price: 10
    }).expect(201);

    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', global.signin()).send({
        title: 'gugucguguas',
        price: 1000
    }).expect(401);
});

it('returns 400 invalid title/price', async() => {
    const cookie = global.signin();
    const response = await request(app).post(`/api/tickets`).set('Cookie', cookie).send({
        title: 'cugsagusuic',
        price: 10
    }).expect(201);
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: '',
        price: 1000
    }).expect(400);
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'ewwv',
        price: -1000
    }).expect(400);
});

it('Updating ticket if all valid inputs', async() => {
    const cookie = global.signin();
    const response = await request(app).post(`/api/tickets`).set('Cookie', cookie).send({
        title: 'cugsagusuic',
        price: 10
    }).expect(201);
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'new Title',
        price: 1000
    }).expect(200);

    const tkResponse = await request(app).get(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send();
    expect(tkResponse.body.price).toEqual(1000);
});

it("Publishes an event",  async () => {
    const cookie = global.signin();
    const response = await request(app).post(`/api/tickets`).set('Cookie', cookie).send({
        title: 'cugsagusuic',
        price: 10
    }).expect(201);
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'new Title',
        price: 1000
    }).expect(200);
    

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("Rejects upadtes if ticket is reserved", async () => {
    const cookie = global.signin();
    const response = await request(app).post(`/api/tickets`).set('Cookie', cookie).send({
        title: 'cugsagusuic',
        price: 10
    }).expect(201);

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()});

    await ticket!.save();
    await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send({
        title: 'new Title',
        price: 1000
    }).expect(400);
})