const { MongoMemoryServer } = require("mongodb-memory-server");
import mongoose from "mongoose";
import { app } from "../app";
import request from 'supertest';
let mongo: any;
declare global {
    var signin: () => Promise<string[]>;
}
beforeAll(async() => {
    process.env.JWT_KEY = 'asdf';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);

});

beforeEach(async() => {
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async() => {
    if(mongo){
        await mongo.stop();
    }
    await mongoose.connection.close();
})

global.signin = async() => {
    const email= 'test@test.com';
    const password = 'password'
    const authResp = await request(app)
      .post('/api/users/signup')
      .send({
        email: email,
        password: password
      })
      .expect(201);
    const cookie = authResp.get('Set-Cookie');
    return cookie;
}