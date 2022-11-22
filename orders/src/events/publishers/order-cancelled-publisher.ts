import { OrderCancelledEvent, Publisher, Subjects } from "@agrkushal-test/commontixis";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

}
