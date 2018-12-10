const mongoose = require('mongoose');
const Product = require('../models/products');
const Image = require('../models/images');

exports.products_get_all = (req, res, next) => {
	Product
	.find()
	.select('name price _id productImage')
	.populate('productImage')
	.exec()
	.then(docs => {
		const response  = {
			count: docs.length,
			errCode: 0,
			products: docs.map(doc => {
				return {
					name: doc.name,
					price: doc.price,
					productImage: doc.productImage,
					_id: doc._id,
					request: {
						type: "GET",
						url: "http://localhost:3000/api/products/"+ doc._id
					}
				}
			})
		}
		// if(docs.length >= 0){
			res.status(200).json(response);
		// }else{
		// 	res.status(404).json({
		// 		res.status(404).json(docs);
		// 	});
		// }
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			errCode: 1,
			error: err
		});
	});
}

function isNumber(n){
	return typeof n == 'number' && !isNaN(n) && isFinite(n);
}

exports.products_create_product = (req, res, next) => {

	if(!req.body.name || !isNumber(Number.parseInt(req.body.price))){
		return res.status(500).json({
			errCode: 2,
			error: 'Incorrect data'
		});
	}
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});

	if(!req.file){
		product.save()
		.then( prod => {
			res.status(200).json({
				_id: prod._id,
				name: prod.name,
				price: prod.price,
				request: {
					type: "GET",
					url: "http://localhost:3000/api/products/" + prod._id
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				errCode: 1,
				errMessage: 'Internal Server Error'
			});
		})
	}else{
		const image = new Image({
			_id: new mongoose.Types.ObjectId(),
			name: req.file.originalname,
			created: new Date(),
			path: req.file.path
		});
		image.save()
		.then( img => {
			product.productImage = img._id;
			return product.save();
		})
		.then(prod => {
			res.status(200).json({
				_id: prod._id,
				name: prod.name,
				price: prod.price,
				productImage: prod.productImage,
				request: {
					type: "GET",
					url: "http://localhost:3000/api/products/" + prod._id
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				errCode: 1,
				errMessage: 'Internal Server Error'
			});
		})
	}
}

exports.products_get_product = (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
	.select('name price _id productImage')
	.populate('productImage')
	.exec()
	.then(doc => {
		console.log(doc);
		if(doc) {
			res.status(200).json({
				_id: doc._id,
				name: doc.name,
				price: doc.price,
				productImage: doc.productImage,
				request: {
					type: 'GET',
					url: "http://localhost:3000/api/products"
				}
			});
		}else{
			res.status(404).json({
				errCode: 1,
				message: "Not found"
			});
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			errCode: 1,
			error: err
		});
	});
}

// only json data, productImage
exports.products_update_product = (req, res, next) => {
	const id = req.params.productId;
	const updateOps = {};
	for (const ops of req.body){
		updateOps[ops.propName] = ops.value;
	}
	Product.update({ _id: id }, { $set: updateOps})
	.exec()
	.then(result => {
		res.status(200).json({
			errCode: 0,
			errMessage: "Product updated",
			request: {
				type: "GET",
				url: "http://localhost:3000/api/products/" + id
			}
		});
	})
	.catch(err => {
		res.status(404).json({
			errCode: 1,
			error: 'Incorrect data'
		});
	});
}

exports.products_delete_product = (req, res, next) => {
	const id = req.params.productId;
	Product
	.findOneAndRemove({_id: id})
	//.find({_id: id})
	.exec()
	.then(result => {
		res.status(200).json({
			message: "Product deleted",
			request: {
				type: "POST",
				url: "http://localhost:3000/api/products",
				body: { name: 'String', price: 'Number', productImage: 'file' }
			}
		});
	})
	.catch(err => {
		res.status(500).json({
			errCode: 1,
			error: 'Internal Server Error'
		});
	});
}

exports.products_delete_ALL = (req, res, next) => {
	Product.deleteMany()
	.then(result => {
		res.status(200).json({
			errCode: 0,
			errMessage: 'Deleted all products'
		})
	})
	.catch(err => {
		res.status(500).json({
			errCode: 1,
			errMessage: 'Internal Server Error'
		})
	})
}