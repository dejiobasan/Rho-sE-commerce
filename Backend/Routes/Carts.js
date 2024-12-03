const { protectRoute } = require("../Middleware/authMiddleware");
let product = require("../Models/Product.js");

const router = require("express").Router();



router.route(protectRoute, "/getCartProducts").get(async (req, res) => {
    try {
        const products = await product.find({_id: {$in: req.user.cartItems}})
        const cartItems = products.map(product => {
            const item = req.user.CartItems.find(cartItem => cartItem.id === product.id);
            return {...product.toJSON(), quantity: item.quantity}
        });

        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({ message: "Error fetching cart products" });
    }
});


router.route(protectRoute, "/addToCart").post(async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.CartItems.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.CartItems.push(productId);
        }
        await user.save();
        res.json(user.CartItems)
        res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
        console.log("Error in the addToCart Controller", error.message);
        res.status(500).json({ message: "Error in the addToCart Controller" });
    }
});

router.route(protectRoute, "/removeAllFromCart").delete(async (req, res) => {
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

router.route(protectRoute, "/updateQuantity").put(async (req, res) => {
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