const mongoose = require("mongoose");

const product_schema = new mongoose.Schema({
	productName: {
        type: String,
        required: [true, "Product is required!"]
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    quantity: {
        type: Number,
        required: [true, "Stock is required!"]
    },
    price: {
        type: Number,
        required: [true, "Price is required!"]
    },
    catalog: {
        type: String,
        required: [true, "Catalog is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model("Product", product_schema);