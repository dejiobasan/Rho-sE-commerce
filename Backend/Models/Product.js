const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
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
        min: 0,
        required: true
    },
    image: {
        type: String,
        required: [true, "Image is required!"]
    },
    category: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

const Product = new mongoose.model("Product", ProductsSchema);

module.exports = Product;