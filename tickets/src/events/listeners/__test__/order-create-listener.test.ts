import { OrderCreatedEvent, OrderStatus } from "@agrkushal-test/commontixis";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async() => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const userIdNew = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'jjv',
        price: 99,
        userId: userIdNew,
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] ={
        userId: userIdNew,
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        expiresAt: '9bj',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, ticket, data, msg};
}

it('Sets the userId of ticket', async() => {
    const {listener, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async() => {
    const {listener, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('Publishes a ticked updated event', async () => {
    const {listener, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

})