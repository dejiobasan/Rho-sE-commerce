const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")

const app = express();

require("dotenv").config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.BusinessDB, {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully!");  
});

const UserRouter = require("./Routes/Users");


app.use("/Users", UserRouter);


app.listen(port, function () {
    console.log(`server started at port ${port}.`);
});