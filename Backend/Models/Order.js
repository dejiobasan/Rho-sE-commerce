const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    flutterSessionId: {
        type: String,
        unique: true,
    },
},
{timestamp: true });


const Order = mongoose.model("Order", orderSchema);


module.exports = Order;