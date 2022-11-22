import { PaymentCreatedEvent, Publisher, Subjects } from "@agrkushal-test/commontixis";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    
}