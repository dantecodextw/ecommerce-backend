import CustomError from "../middlewares/errorHandlers/customErrorHandler.js";
import Product from "../models/productModel.js";
const getAllProducts = async () => {
    const products = await Product.find();
    return {
        products,
        status: 200
    }
};


const getProductById = async (data) => {
    const product = await Product.findById(data.id);
    if (!product) throw new CustomError("product not found", 404);
    return {
        product,
        status: 200
    }
};


const createProduct = async (data) => {
    const product = await Product.create(req.body);
    return {
        product,
        status: 200,
        msg: "product created"
    }
};


const updateProduct = async (data) => {
    const product = await Product.findByIdAndUpdate(data.id, data, {
        new: true,
    });
    if (!product) throw new CustomError('product not found', 404)
    return {
        status: 200,
        product,
        msg: "product updated"
    }
};


const deleteProduct = async (data) => {
    const product = await Product.findByIdAndDelete(data.id);
    if (!product) throw new CustomError('product not found', 404)
    return {
        product,
        msg: "product deleted",
        status: 200
    };
};
