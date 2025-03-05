const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

require("dotenv").config();
const port = Number(process.env.PORT);

app.use(
  cors({
    origin: process.env.DEPLOYEDPORT, // allow to server to accept request from different origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

mongoose.connect(process.env.BusinessDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully!");
});

const UserRouter = require("./Routes/Users");
const ProductRouter = require("./Routes/Products");
const CartRouter = require("./Routes/Carts");
const CouponRouter = require("./Routes/Coupons");
const PaymentRouter = require("./Routes/Payment");
const AnalyticsRouter = require("./Routes/Analytics");
const ProfileRouter = require("./Routes/Profile");

app.use("/Users", UserRouter);
app.use("/Products", ProductRouter);
app.use("/Carts", CartRouter);
app.use("/Coupon", CouponRouter);
app.use("/Payments", PaymentRouter);
app.use("/Analytics", AnalyticsRouter);
app.use("/Profile", ProfileRouter);

app.listen(port, function () {
  console.log(`server started at port ${port}.`);
});
