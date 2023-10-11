const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController.js");
const auth = require("../auth.js");

router.post("/register", (request, response) => {
	UserController.registerUser(request, response);
});

router.post("/login", (request, response) => {
	UserController.loginUser(request, response);
});

router.post("/userProfile", auth.verify, (request, response) => {
	UserController.getProfile(request.body).then((result) => {
		response.send(result);
	});
});

router.put("/admin/:id", auth.verify, auth.verifyAdmin, (request, response) => {
	UserController.setUserAsAdmin(request, response);
});

router.get("/allUser", auth.verify, auth.verifyAdmin, (request, response) => {
	UserController.getAllUser(request, response);
});

module.exports = router;