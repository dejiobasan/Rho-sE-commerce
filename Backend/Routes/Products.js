const router = require("express").Router();
let Product = require("../Models/Product.js");
const redis = require("../Lib/Redis.js")
const { protectRoute, adminRoute } =  require("../Middleware/authMiddleware.js")

router.route(protectRoute, adminRoute, "/getAllproducts").get(async (req, res) => {
    try {
        const Products = await Product.find({});
        res.json({ Products });
    } catch (error) {
        console.log("Error in getAllproducts Controller", error);
        res.status(500).json({ message: error.message });
    }

});

router.route(protectRoute, adminRoute, "/createProduct").get(async(req, res)  => {
    
})

router.route("/getFeaturedProducts").get(async  (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products")
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts))
        }

        featuredProducts = await Product.find({isFeatured: true}).lean(); //.lean() is gonna return a plain javaScript object of a mongoDB document

        if(!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts Controller", error);
        res.status(500).json({ message: error.message });
    }
})













module.exports = router;