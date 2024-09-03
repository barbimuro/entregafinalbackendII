import mongoose from 'mongoose'

const collection = "Product"

const schema = new mongoose.Schema({
    name: String,
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String
});

const Product = mongoose.model(collection, schema);
export default Product