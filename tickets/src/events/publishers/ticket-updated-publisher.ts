import { Publisher, Subjects, TicketUpdatedEvent } from "@agrkushal-test/commontixis";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    
}