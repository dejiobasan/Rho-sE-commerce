const router = require("express").Router();
let product = require("../Models/Product.js");
const redis = require("../Lib/Redis.js");
const cloudinary = require("../Lib/Cloudinary.js");
const { protectRoute, adminRoute } = require("../Middleware/authMiddleware.js");

router.get("/getAllproducts", protectRoute, adminRoute, async (req, res) => {
  try {
    const Products = await product.find({});
    res.json({ Products });
  } catch (error) {
    console.log("Error in getAllproducts Controller", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/createProduct", protectRoute, adminRoute, async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "Products",
      });
    }

    const newProduct = new product({
      Name: name,
      Description: description,
      Price: price,
      Image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : null,
      Category: category,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log("Error in createProducts Controller", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete(
  "/deleteProduct/:id",
  protectRoute,
  adminRoute,
  async (req, res) => {
    try {
      const product = await product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`Products/${publicId}`);
          console.log("deleted image from cloudinary");
        } catch (error) {
          console.log("error deleting image from cloudinary", error);
        }
      }

      await product.findByIdAndDelete(req.params.id);
      res.json({ message: "Products deleted successfully!" });
    } catch (error) {
      console.log("Error in deleteProduct Controller", error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.route("/getFeaturedProducts").get(async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    featuredProducts = await product.find({ isFeatured: true }).lean(); //.lean() is gonna return a plain javaScript object of a mongoDB document

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts Controller", error);
    res.status(500).json({ message: error.message });
  }
});

router.route("/recommendations").get(async (req, res) => {
  try {
    const products = await product.aggregate([
      { $sample: { size: 3 } },
      { $project: { _id: 1, Name: 1, Description: 1, Image: 1, Price: 1 } },
    ]);
    res.json(products);
  } catch (error) {
    console.log("Error in recommendations Controller", error);
  }
});

router.route("/category/:Category").get(async (req, res) => {
  const { Category } = req.params;
  try {
    const products = await product.find({ Category });
    res.json(products);
  } catch (error) {
    console.log("Error in category Controller", error);
  }
});

router.route("/toggleFeaturedProduct/:id").patch(async (req, res) => {
  try {
    const product = await product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found! " });
    }
  } catch (error) {
    console.log("Error in the toogleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

async function updateFeaturedProductCache() {
  try {
    const featuredProducts = await product.find({ isFeatured: true }).lean(); //lean() returns plain JavaScript
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in updateFeaturedProductCache", error);
  }
}

module.exports = router;
