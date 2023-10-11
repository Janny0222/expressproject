const mongoose = require("mongoose");

const order_schema = new mongoose.Schema({
	userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "UserId is required!"]
    },
    fullName: {
        type: String,
        required: false
    },
    products: [
        {
            productId: {
                type : mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "ProductId is required!"]
            },
            productName: {
                type: String
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required!"]
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required!"]
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    purchasedOn: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model("Order", order_schema);