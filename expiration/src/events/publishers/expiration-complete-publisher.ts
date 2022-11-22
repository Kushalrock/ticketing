import { ExpirationCompleteEvent, Publisher, Subjects } from "@agrkushal-test/commontixis";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    
}