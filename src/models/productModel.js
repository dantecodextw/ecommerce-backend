import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    saleStart: {
        type: Date,
        default: null
    },
    saleEnd: {
        type: Date,
        default: null
    }
}, { timestamps: true })
const Product = new mongoose.model("Product", productSchema)
export default Product;