import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: ["upi", "card", "COD", "wallet"],
        required: true
    },
    refunded: {
        type: Boolean,
        default: false
    },
    refundedDate: {
        type: Date,
        default: null
    }
}, { timestamps: true })
const Payment = new mongoose.model("Payment", paymentSchema)
export default Payment;