const mongoose = require('mongoose');
const Image = require('../models/images');


exports.images_create_image = (req, res, next) => {
	console.log(req.file);
	if(!req.file){
		return res.status(404).json({
			errCode: 1,
			errMessage: 'Incorrect Data'
		});
	}
	const image = new Image({
		_id: new mongoose.Types.ObjectId(),
		name: req.file.originalname,
		created: new Date(),
		path: req.file.path
	});
	image
	.save()
	.then( img => {
		res.status(200).json({
			errCode:0,
			errMessage: 'Image is created',
			_id: img._id,
			name: img.name,
			created: img.created,
			path: img.path 
		})
	})
	.catch(err => {
		res.status(500).json({
			errCode: 1,
			errMessage: 'Internal Server Error'
		});
	});
}


exports.images_get_images = (req, res, next) => {
	Image.find()
	.exec()
	.then(images => {
		res.status(200).json({
			errCode: 0,
			count: images.length,
			images: images.map(img => {
				return {
					_id: img._id,
					name: img.name,
					created: img.created,
					path: img.path
				}
			})
		})
	})
	.catch(err => {
		res.status(500).json({
			errCode: 1,
			errMessage: 'Internal Server Error'
		})
	})
}

exports.images_delete_image = (req, res, next) => {
	const id = req.params.imageId;
	Image
	.findOneAndRemove({_id: id})
	.exec()
	.then(result => {
		console.log(result);
		res.status(200).json({
			message: "Image deleted",
			request: {
				type: "POST",
				url: "http://localhost:3000/api/images",
				body: { productImage: 'image file'}
			}
		});
	})
	.catch(err => {
		res.status(500).json({
			errCode: 1,
			errMessage: 'Internal Server Error'
		})
	})
}

exports.images_delete_ALL = (req, res, next) => {
	Image.deleteMany()
	.then(result => {
		res.status(200).json({
			errCode: 0,
			errMessage: 'Deleted all images'
		})
	})
	.catch(err => {
		res.status(500).json({
			errCode: 1,
			errMessage: 'Internal Server Error'
		})
	})
}