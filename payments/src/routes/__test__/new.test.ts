import { OrderStatus } from '@agrkushal-test/commontixis';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
jest.mock("../../stripe");
it('Returns a 404 when purchasing a order that not exists', async () => {
    await request(app).post('/api/payments').set('Cookie', global.signin()).send({
        token: 'bjbbhhhb',
        orderId: new mongoose.Types.ObjectId().toHexString()
    }).expect(404);
});

it('Returns a 401 for unauthorized purchases', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app).post('/api/payments').set('Cookie', global.signin()).send({
        token: 'bjbbhhhb',
        orderId: order.id,
    }).expect(401);
});

it('Returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app).post('/api/payments').set('Cookie', global.signin(userId)).send({
        token: 'bjbbhhhb',
        orderId: order.id,
    }).expect(400);
});