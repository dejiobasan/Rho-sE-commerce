const { protectRoute } = require("../Middleware/authMiddleware");
const product = require("../Models/Product.js");
const User = require("../Models/User.js");

const router = require("express").Router();

// Get all products in the cart Route
router.get("/getCartProducts", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("CartItems.product");
    const cartItems = user.CartItems.map((item) => ({
      ...item.product.toJSON(),
      _id: item.product._id,
      Name: item.product.Name,
      Description: item.product.Description,
      Price: item.product.Price,
      quantity: item.quantity,
      Image: item.product.Image,
    }));

    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Error fetching cart products" });
  }
});

// Add product to cart Route
router.post("/addToCart", protectRoute, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    const Product = await product.findById(productId);
    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItem = user.CartItems.find(
      (item) => item.product.toString() === productId
    );
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      user.CartItems.push({ product: productId, quantity: 1 });
    }

    await user.save();
    const updateUser = await User.findById(req.user.id).populate(
      "CartItems.product"
    );
    const updatedCartItems = updateUser.CartItems.map((item) => ({
      _id: item.product._id,
      Name: item.product.Name,
      Description: item.product.Description,
      Price: item.product.Price,
      quantity: item.quantity,
      Image: item.product.Image,
    }));
    res.status(200).json(updatedCartItems);
  } catch (error) {
    console.log("Error in the addToCart Controller", error.message);
    res.status(500).json({ message: "Error in the addToCart Controller" });
  }
});

// Remove product from cart Route
router.delete("/removeAllFromCart", protectRoute, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!productId) {
      user.CartItems = [];
    } else {
      user.CartItems = user.CartItems.filter(
        (item) => item.product.toString() !== productId
      );
    }
    await user.save();
    res.json(user.CartItems);
  } catch (error) {
    console.log("Error in removeAllFromCart controller", error.message);
    res
      .status(500)
      .json({ message: "Error in the removeAllFromCart Controller" });
  }
});

// Update quantity of product in cart Route
router.put("/updateQuantity/:id", protectRoute, async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);
    const existingItem = user.CartItems.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      if (quantity === 0) {
        user.CartItems = user.CartItems.filter(
          (item) => item.product.toString() !== productId
        );
      } else {
        existingItem.quantity = quantity;
      }
      await user.save();
      const updatedUser = await User.findById(req.user.id).populate(
        "CartItems.product"
      );
      const updatedCartItems = updatedUser.CartItems.map((item) => ({
        _id: item.product._id,
        Name: item.product.Name,
        Description: item.product.Description,
        Price: item.product.Price,
        quantity: item.quantity,
        Image: item.product.Image,
      }));
      res.json(updatedCartItems);
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error in the updateQuantity Controller", error.message);
    res.status(500).json({ message: "Error in the updateQuantity Controller" });
  }
});

module.exports = router;
