const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	created: { type: Date, required: true },
	product: { type: Array, required: true },
	purchase: { type: Number, required: true},
	quantity: { type: Number, default: 1},
	consumer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});



module.exports = mongoose.model('Order', orderSchema);