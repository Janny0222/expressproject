const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const mongoose = require('mongoose');

const mongooseID = mongoose.Types.ObjectId;

// User registration w/ validation if email is already exists
module.exports.registerUser = (request, response) => {
	return User.findOne({email: request.body.email}).then(result => {
		if(result){
			return response.send({message: `${request.body.email} is already in use, please provide different one`});
		} else {
			let new_user = new User({
				firstName: request.body.firstName,
				lastName: request.body.lastName,
				age: request.body.age,
				mobileNo: request.body.mobileNo,
				email: request.body.email,
				password: bcrypt.hashSync(request.body.password, 10)
			});
			return new_user.save().then((registered_user, error) => {
		if (error){
			return response.send({message: error.message});
		}
		return response.send({message: `You are successfully register, ${request.body.firstName}!`	});
			}).catch(error => console.log(error));
		}
	}).catch(error => console.log(error));
}


module.exports.loginUser = (request, response) => {
	User.findOne({email: request.body.email}).then(result => {
        console.log(result)
		if(result == null){
			return response.send({ message: "The user isn't register yet, please register first"});
		}
		const is_password_correct = bcrypt.compareSync(request.body.password, result.password);
		if(is_password_correct){
			return response.send({
				accessToken: auth.createAccessToken(result),
                userId: result._id,
                isAdmin: result.isAdmin,
                firstName: result.firstName
			});
		}
		else{
			return response.send({
				message: "Your password is incorrect."
			});
		}
	}).catch(error => response.send(error));
}


module.exports.getProfile = (request_body) => {
	return User.findOne({_id: request_body.id}).then((result, error) => {
		if(error){
			return {
				message: error.message
			}
		}
		result.password = "";
		return result;
	});
}

module.exports.setUserAsAdmin = (request, response) => {
	let id = request.params.id;
    
    if(!mongooseID.isValid(request.params.id)){
        return response.send({message: "User is not available"})
    }
    return User.findByIdAndUpdate(id, {isAdmin: true}).then((result, error) => {
    
    if(result.isAdmin){
        return response.send({message: `User is already an ADMIN`})
    }
        if(error){
            return response.send({message: error.message})
            }
            return response.send({message: "User is successfully change to ADMIN"});
        })
}

module.exports.getAllUser = (request, response) => {
	return User.find({}).then(result => {
		result.forEach(user => {
			user.password = '';
		});
		return response.send(result);
	}).catch(error => {
		return response.send({message: error.message})
	})
}