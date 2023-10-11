const Product = require("../models/Product.js");
const mongoose = require('mongoose')

const mongooseID = mongoose.Types.ObjectId;

module.exports.addProduct = (request, response) => {
			let new_product = new Product({
				productName: request.body.productName,
				description: request.body.description,
				quantity: request.body.quantity,
				price: request.body.price,
				catalog: request.body.catalog
			});
			return new_product.save().then((saved_product, error) => {
				if(error){
			return response.send(error.message);
			}
				return response.send({message: "Product added successfully!"});
		
	}).catch(error => response.send(error));		
}

module.exports.getAllProducts = (request, response) => {
	return Product.find({}).then(result => {
		return response.send(result);
	})
}

module.exports.getAllActiveProducts = (request, response) => {
	return Product.find({isActive: true}).then(result => {
		return response.send(result);
	})
}

module.exports.getProduct = (request, response) => {
	Product.findById(request.params.id)
	.then(product => response.send(product))
	.catch(error => response.send(error));
}

module.exports.updateProduct = (request, response) => {
	let update_product = {
		productName: request.body.productName,
		description: request.body.description,
		price: request.body.price,
		quantity: request.body.quantity,
		catalog: request.body.catalog
	};
	if(!mongooseID.isValid(request.params.id)){
		return response.send({message: "Product is not available"})
	}
	return Product.findByIdAndUpdate(request.params.id, update_product).then((product, error) => {
		if(error){
			return response.send({mesage: error.message})
		}
		return response.send({message: 'Updating the product is successfully!'})
	})
}

module.exports.archiveProduct = (request, response) => {
	let id = request.params.id;
	if(!mongooseID.isValid(request.params.id)){
		return response.send({message: "Product is not available"})
	}
	return Product.findByIdAndUpdate(id, {isActive: false}).then((result, error) => {
		if(!result.isActive){
		return response.send({message: `Product is already archived`})
	}
		
		if(error){
			return response.send({message: error.message})
			}
			return response.send({message: "Product is successfully archived"});
		}) 
}

module.exports.activateProduct = (request, response) => {
	let id = request.params.id;
	
	if(!mongooseID.isValid(request.params.id)){
		return response.send({message: "Product is not available"})
	}
	return Product.findByIdAndUpdate(id, {isActive: true}).then((result, error) => {
	
	if(result.isActive){
		return response.send({message: `Product is already active`})
	}
		if(error){
			return response.send({message: error.message})
			}
			return response.send({message: "Product is successfully activate"});
		}) 
}

