import { Publisher, Subjects, TicketCreatedEvent } from "@agrkushal-test/commontixis";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    
}