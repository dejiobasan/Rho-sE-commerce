const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

require("dotenv").config();
const port = Number(process.env.PORT);

app.use(cors());
app.use(express.json());
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

app.use("/Users", UserRouter);
app.use("/Products", ProductRouter);

app.listen(port, function () {
  console.log(`server started at port ${port}.`);
});
