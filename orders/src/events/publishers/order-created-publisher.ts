import { OrderCreatedEvent, Publisher, Subjects } from "@agrkushal-test/commontixis";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}
