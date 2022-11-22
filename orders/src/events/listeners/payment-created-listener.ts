import { NotFoundError, OrderStatus, PaymentCreatedEvent, Subjects } from "@agrkushal-test/commontixis";
import Listener from "@agrkushal-test/commontixis/build/events/base-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId);
        if(!order){
            throw new NotFoundError();
        }

        order.set({status: OrderStatus.Complete});

        await order.save();

        msg.ack();
    }
    
    
}