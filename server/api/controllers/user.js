const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Order = require('../models/orders');

exports.user_signup = (req, res, next) => {
	User.find({ email: req.body.email })
	.exec()
	.then(user => {
		if(user.length >= 1){
			return res.status(409).json({
				errCode: 2,
				message: 'Mail exists'
			});
		}else{
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if(err){
					return res.status(500).json({
						errCode: 1,
						error: err
					});
				}else{
					const userOb = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						password: hash
					});
					userOb
					.save()
					.then(result => {
						console.log(result);
						res.status(201).json({
							errCode: 0,
							userId: userOb._id,
							message: 'User created'
						});
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({
							errorCode: 1,
							error: err
						});
					});
				}
			});
		}
	});	
}

exports.user_login = (req, res, next) => {
	User.find({email: req.body.email})
	.exec()
	.then(user => {
		if(user.length < 1){
			return res.status(401).json({
				errCode: 1,
				message: 'Auth failed'
			});
		}
		bcrypt.compare(req.body.password, user[0].password, (err, result) => {
			if(err){
				return res.status(404).json({
					errCode: 1,
					message: 'Auth failed'
				});
			}
			if(result){
				const token = jwt.sign(
					{
						email: user[0].email,
						userId: user[0]._id
					}, 
					process.env.JWT_KEY, 
					{
						expiresIn: "1h"
					}
				);
				return res.status(200).json({
					errCode: 0,
					userId: user[0]._id,
					message: 'Auth successful',
					token: token
				});
			}
			res.status(401).json({
				errCode: 1,
				message: 'Auth failed'
			});
		});
	})
	.catch(err => {
		console.log();
		res.status(500).json({
			errCode: 3,
			error: err
		});
	});
}

exports.user_delete = (req, res, next) => {
	User
	.findOneAndRemove({ _id: req.params.userId })
	.exec()
	.then(result => {
		if(result){
			res.status(200).json({
				errCode: 0,
				message: 'User deleted'
			});
		}else{
			res.status(404).json({
				errCode: 1,
				message: 'User does not exist'
			});
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			errCode: 3,
			error: err
		});
	});
}

exports.user_get_all = (req,res,next) => {
	const response = {};
	User
	.find()
	.exec()
	.then(users => {
		response.count = users.length;
		response.errCode = 0;
		response.users = users.map(user => {
			return {
				_id: user._id,
				email: user.email,
				qt_orders: 0,
				purchases: 0
			}
		});
		return Order.find().exec()
	})
	.then(orders => {
		response.users.forEach((user, index, arr) => {

			arr[index].qt_orders = orders.reduce((sum, order) => {
				if(String(order.consumer._id) == String(user._id)){
					return sum + 1;
				}else{
					return sum + 0;
				}
			}, 0);
			arr[index].purchases = orders.reduce((sum, order) => {
				if(String(order.consumer._id) == String(user._id)){
					return sum + order.purchase;
				}else{
					return sum + 0;
				}
			}, 0);
		});
		res.status(200).json(response);
	})
	.catch(err => {
		res.status(500).json({
			errCode: 1,
			errMessage: 'Internal Server Error'
		});
	});
}