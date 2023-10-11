const Order = require("../models/Order.js");
const Product = require("../models/Product.js");
const User = require("../models/User.js");
const mongoose = require('mongoose');

module.exports.getUserOrders = (request, response) => {
	Order.find({userId: request.user.id}).then(user_orders => {
		if(user_orders.length == 0){
			return response.send({
				message: "User has no recorded orders in the database."
			});
		}
		return response.send(user_orders);
	}).catch(error => response.send(error));
}


module.exports.getAllUsersOrders = (request, response) => {
	Order.find({}).then(all_orders => {
		if(all_orders.length == 0){
			return response.send({
				message: "No orders in the database."
			});
		}
		return response.send(all_orders);
	}).catch(error => response.send(error));
}

module.exports.removeSpecificOrder = (request, response) => {
	const orderId = request.params.id;
	if(!mongoose.Types.ObjectId.isValid(orderId)){
		return response.send({message: 'Invalid Order'});
	}
	Order.findByIdAndRemove(orderId).then((result, error) => {
		if(error){
			return response.send({message: 'Failed to delete the order'});
		}
		if(!result){
			return response.send({message: 'Order Not found'})
		}
		return response.send({message: 'Order Successfully delete'});
	}).catch((error) => {
		response.send({message: "Internal Error"})
	})
}


module.exports.createOrder = async (request, response) => {
	if (request.user.isAdmin) {
        return response.send({message: 'Action Forbidden'});
    }
	let qtyValid = true;
	let qtyOverQty = false;
	let isProductActive = true;
	for(let itemProducts of request.body.products){
		await Product.findOne({_id: itemProducts.productId}).then(product => {
			if(itemProducts.quantity <= 0) return qtyValid = false;
			if(itemProducts.quantity > product.stock) return qtyOverQty = true;
			if(product && !product.isActive) return isProductActive = false;
		}).catch(error => response.send(error));
	}
	if(!isProductActive){
		return response.send({
			message: "Not Available"
		});
	}
	if(!qtyValid){
		return response.send({
			message: "Invalid Quantity"
		});
	}	
	if(qtyOverQty){
		return response.send({
			message: "Insufficient stock "
		});
	}

	let user = await User.findOne({_id: request.user.id});
	let fullname = `${user.firstName} ${user.lastName}`;
  let totalValue = 0;
	let productWithName = []
    if(request.body.products && Array.isArray(request.body.products)){
        for(let productsArrayItem of request.body.products){
            if(productsArrayItem.productId && productsArrayItem.quantity){
                let product = await Product.findOne({_id: productsArrayItem.productId});
                if(product){
                    totalValue += product.price * productsArrayItem.quantity;
                    productWithName.push({
											productId: productsArrayItem.productId,
											quantity: productsArrayItem.quantity,
											productName: productsArrayItem.productName
										})
                }
            }
        }
    }

    for(let productsArrayItem of request.body.products){
		await Product.findOne({_id: productsArrayItem.productId}).then(product => {
			product.quantity -= productsArrayItem.quantity;
			if(product.quanity == 0) product.isActive = false;
			product.save().then().catch(error => response.send(error));
		}).catch(error => response.send(error));
	}
	let new_order = new Order({
		userId: request.user.id,
		fullName: fullname,
		products: productWithName,
		totalAmount: totalValue
	});
	return new_order.save().then(order => {
		return response.send({
			message: "Thank you for your purchase!"
		});
	}).catch(error => response.send(error));
}

module.exports.checkoutAllOrders = async (request, response) => {
	try {
			const userOrders = await Order.find({ userId: request.user.id, isPaid: false });

			if (userOrders.length === 0) {
					return response.send({
							message: "No unpaid orders found for the user."
					});
			}
			let totalAmount = 0;

			for (const order of userOrders) {
					order.isPaid = true;
					await order.save();

					for (const productInfo of order.products) {
							const product = await Product.findById(productInfo.productId);
							if (product) {
									totalAmount += product.price * productInfo.quantity;
							}
					}
			}
			return response.send({
					message: "Payment Successful",
					totalAmount: totalAmount
			});
	} catch (error) {
			response.send({ message: "Internal Error" });
	}
};

