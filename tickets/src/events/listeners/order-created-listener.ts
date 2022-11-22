import { NotFoundError, OrderCreatedEvent, OrderStatus, Subjects } from "@agrkushal-test/commontixis";
import Listener from "@agrkushal-test/commontixis/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    queueGroupName: string = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket){
            throw new NotFoundError();
        }

        ticket.set({orderId: data.id});

        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        msg.ack();
    }

}