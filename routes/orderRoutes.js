const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController.js");
const auth = require("../auth.js");


router.post("/create-order", auth.verify, (request, response) => {
	OrderController.createOrder(request, response);
});

router.get("/", auth.verify, (request, response) => {
	OrderController.getUserOrders(request, response);
});;

router.get("/all", auth.verify, auth.verifyAdmin, (request, response) => {
	OrderController.getAllUsersOrders(request, response);
});

router.delete("/:id/remove", auth.verify, (request, response) => {
	OrderController.removeSpecificOrder(request, response);
})
router.patch("/checkout", auth.verify, (request, response) => {
	OrderController.checkoutAllOrders(request, response);
});



module.exports = router;