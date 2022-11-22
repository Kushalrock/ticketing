import nats from 'node-nats-streaming';
import { Stan } from "node-nats-streaming";

class NatsWrapper{
    private _client?: Stan;

    get client(){
        if(!this._client){
            throw new Error('Please connect the client');
        }
        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string){
        this._client = nats.connect(clusterId, clientId, {url});

        return new Promise<void>((resolve, reject) => {
            this._client?.on('connect', () => {
                console.log("NATS connected");
                resolve();
            });
            this._client?.on('error', (err) => {
                console.log("NATS connection error");
                console.log(err);
                reject(err);
            });
        });
    }
}

export const natsWrapper = new NatsWrapper();