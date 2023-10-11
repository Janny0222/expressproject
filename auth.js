const jwt = require("jsonwebtoken");
const secret_key = "EcommerceAPIB303";

//Generating a token
module.exports.createAccessToken = (user) => {
	const user_data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin,
		firstName: user.firstName
	}
	return jwt.sign(user_data, secret_key, {});
}

//Verifying a token
module.exports.verify = (request, response, next) => {
	let token = request.headers.authorization;
	if(typeof token === "undefined"){
		return response.send({auth: "Failed, please include token in the header of the request."});
	}
	token = token.slice(7, token.length);
	jwt.verify(token, secret_key, (error, decoded_token) => {
		if(error){
			return response.send({
				auth: "Failed",
				message: error.message
			});
		}
		request.user = decoded_token;
		next();
	});
}

//Verifying if user is admin
module.exports.verifyAdmin = (request, response, next) => {
	if(request.user.isAdmin){
		return next();
	}
	return response.send({
		auth: "Failed",
		message: "Action Forbidden"
	});
}