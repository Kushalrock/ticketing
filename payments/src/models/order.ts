import { OrderStatus } from "@agrkushal-test/commontixis";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface OrderAttrs{
    id: string;
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderDoc extends mongoose.Document{
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: Object.values(OrderStatus)
    },
    price:{
        type: Number,
        required: true
    },
}, {
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({_id: attrs.id, version: attrs.version, userId: attrs.userId, status: attrs.status, price: attrs.price});
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};