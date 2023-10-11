const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController.js");
const auth = require("../auth.js");

//Create product
router.post("/create-product", auth.verify, auth.verifyAdmin, (request, response) => {
	ProductController.addProduct(request, response);
});

//Retrieve all products
router.get("/allProducts", (request, response) => {
	ProductController.getAllProducts(request, response);
});

//Retrive all active products
router.get("/activeProducts", (request, response) => {
	ProductController.getAllActiveProducts(request, response);
});

//Retrieve single product
router.get("/:id", (request, response) => {
	ProductController.getProduct(request, response);
});

//Update product information
router.put("/:id", auth.verify, auth.verifyAdmin, (request, response) => {
	ProductController.updateProduct(request, response);
});

//Archive product
router.put("/:id/archive", auth.verify, auth.verifyAdmin, (request, response) => {
	ProductController.archiveProduct(request, response);
});

//Activate product
router.put("/:id/activate", auth.verify, auth.verifyAdmin, (request, response) => {
	ProductController.activateProduct(request, response);
});


module.exports = router;