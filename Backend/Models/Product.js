const mongoose = require("mongoose");

// Schema for Products
const ProductsSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true,
    },
    Price: {
        type: Number,
        min: 0,
        required: true
    },
    Image: {
        type: String,
        required: [true, "Image is required!"]
    },
    Category: {
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

// Model for Products
const product = new mongoose.model("product", ProductsSchema);

module.exports = product;