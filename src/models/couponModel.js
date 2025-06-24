import mongoose, { mongo } from "mongoose";
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        required: true
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTill: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: 1
    },
    usedCount: {
        type: Number,
        default: 0
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
const Coupon = new mongoose.model("Coupon", couponSchema)
export default Coupon;