import mongoose from "mongoose";

const orderhistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: [{
        type: Map
    }],
    deliveryAddress: {
        type: Map,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    supercoinsearned: {
        type: Number
    },
    supercoinsused: {
        type: Number
    },
    totalPayment: {
        type: Number
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(Date.now())
    }
});

export default mongoose.models.OrderHistory || mongoose.model("OrderHistory", orderhistorySchema);