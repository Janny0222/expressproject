//Server variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
require("dotenv").config();
const port = 4000;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

//Database connection
mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@b303-villaruel.6drhyd4.mongodb.net/E-Commerce-API?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

let db = mongoose.connection;

db.on('error', () => console.log("Unable to connect to database!"));
db.once('open', () => console.log("Successfully connected to database!"));

app.listen(process.env.PORT || port, () => { console.log(`E-Commerece-API Successfuly Connected at localhost port:${process.env.PORT || port}`);
});


module.exports = app;