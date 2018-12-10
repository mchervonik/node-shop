const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true},
	price: { type: Number, required: true},
	productImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }
});



module.exports = mongoose.model('Product', productSchema);