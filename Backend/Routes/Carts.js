const { protectRoute } = require("../Middleware/authMiddleware");
const Product = require("../Models/Product.js");
const User = require("../Models/User.js");

const router = require("express").Router();

router.get("/getCartProducts", protectRoute, async (req, res) => {
    try {
        const products = await product.find({ _id: { $in: req.user.cartItems } });
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.id === product.id);
            return { ...product.toJSON(), quantity: item.quantity };
        });

        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({ message: "Error fetching cart products" });
    }
});

router.post( "/addToCart", protectRoute, async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const cartItem = user.CartItems.find((item) => item.product.toString() === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.CartItems.push({ product: productId, quantity: 1 });
        }

        await user.save();
        res.status(200).json(user.CartItems);
    } catch (error) {
        console.log("Error in the addToCart Controller", error.message);
        res.status(500).json({ message: "Error in the addToCart Controller" });
    }
});

router.delete("/removeAllFromCart", protectRoute, async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            user.CartItems = [];
        } else {
            user.CartItems = user.CartItems.filter((item) => item.id !== productId);
        }
        await user.save();
        res.json(user.CartItems)
    } catch (error) {
        res.status(500).json({ message: "Error in the removeAllFromCart Controller" });
    }
});

router.put("/updateQuantity", protectRoute, async (req, res) => {
    try {
        const { id: productId } = req.body;
        const{ quantity } = req.body;
        const user = req.user;
        const existingItem = user.CartItems.find((item) => item.id === productId);
        if(existingItem) {
            if(quantity === 0) {
                user.CartItems = user.CartItems.filter((item) => item.id !== productId);
                await user.save();
                return res.json(user.CartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.CartItems);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log("Error in the updateQuantity Controller", error.message);
        res.status(500).json({ message: "Error in the updateQuantity Controller" });
    }
});

module.exports = router;