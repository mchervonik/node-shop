const Order = require('../models/orders');
const Product = require('../models/products');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next) => {
	Order
	.find()
	.populate('consumer', 'email')
	.exec()
	.then(docs => {
		res.status(200).json({
			count: docs.length,
			errCode: 0,
			orders: docs.map(doc => {
				return {
					_id: doc._id,
					created: doc.created,
					consumer: doc.consumer.email,
					quantity: doc.quantity,
					purchase: doc.purchase,
					products: doc.product,
					requset: {
						type: 'GET',
						url: 'http://localhost:3000/api/orders/' + doc._id
					}
				}
			})
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
}

exports.orders_create_order = (req, res, next) => {
	const prods = req.body.products;
	if(!Array.isArray(prods)){
		return res.status(404).json({
				errCode: 1,
				message: 'Incorrect data'
			});
	}
	const lenInit = prods.length;
	prods.forEach(prod => {
		if(!prod.productId || !prod.quantity || prod.quantity < 1 || prod.productId.length != 24){
			return res.status(404).json({
				errCode: 1,
				message: 'Incorrect data'
			});
		}
	});
	const prodIds = prods.map( prod => prod.productId );
	Product.find({'_id': { $in: prodIds }})
	.then(products => {
		if(products.length != lenInit || lenInit == 0){
			return res.status(404).json({
				message: 'Product not found'
			});
		}
		User.findById(req.body.userId)
		.then(user => {
			if (!user) {
				return res.status(404).json({
					message: 'User not found'
				});
			}
		});
		const order = new Order({
				_id: new mongoose.Types.ObjectId(),
				created: new Date(),
				quantity: prods.reduce((sum, prod) => {
					return sum + parseInt(prod.quantity)
				}, 0),
				product: products.map(result => result._id),
				purchase: products.map(result => {
					return prods.reduce((sum, prod) => {
						if(result._id == prod.productId){
							return sum + (parseInt(prod.quantity) * parseFloat(result.price));
						}else{
							return sum + 0;
						}
					},0)
				}).reduce((sum, figure) => { return sum + figure }, 0),
				consumer: req.body.userId
			})
		return order.save();
	})
	.then(result => {
		/*setTimeout(() => { return*/ res.status(201).json({
			message: 'Order stored',
			createdOrder: {
				_id: result._id,
				created: result.created,
				product: result.product,
				quantity: result.quantity,
				purchase: result.purchase,
				consumer: result.consumer
			},
			request: {
				type: 'GET',
				url: 'http://localhost:3000/api/orders/' + result._id
			}
		})/*}, 4000)*/;
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		})
	});
}

exports.orders_get_order = (req, res, next) => {
	Order.findById(req.params.orderId)
	.select('-__v')
	.populate('consumer', '-__v -password')
	.exec()
	.then(order => {
		if(!order){
			return res.status(404).json({
				message: 'Order not found'
			});
		}
		res.status(200).json({
			errCode: 0,
			order: order,
			request: {
				type: 'GET',
				url: 'http://localhost:3000/api/orders/'
			}
		});
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
}

exports.orders_delete_order = (req, res, next) => {
	Order.findOneAndRemove({ _id: req.params.orderId })
	.exec()
	.then(result => {
		if(result){
			res.status(200).json({
				message: 'Order deleted',
				request: {
					type: 'POST',
					url: 'http://localhost:3000/api/orders/',
					body: `{ products: [{productId: ObjectId(), quantity: 'Number'}], userId: ObjectId() }`
				}
			});
		}else{
			res.status(404).json({
				message: 'Order does not exist',
			});
		}
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
}