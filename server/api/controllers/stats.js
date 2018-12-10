const Order = require('../models/orders');
const Product = require('../models/products');
const User = require('../models/user');

exports.stats_get_all = (req, res, next) => {
	const response = {};
	User.find().exec()
	.then(users => {
		response.errCode = 0;
		response.usr_cnt = users.length;
		return Product.find().exec()
	})
	.then( products => {
		response.prd_cnt = products.length;
		return Order.find().exec()
	})
	.then(orders => {
		response.ord_cnt = orders.length;
		response.ord_pchs = orders.reduce((sum, order) => {
			return roundNumber(sum + order.purchase, 2);
		}, 0);
		response.ord_itm_sold = orders.reduce((sum, order) => {
			return sum + order.quantity;
		}, 0);
		response.ord_avr_prc = parseFloat((response.ord_pchs / response.ord_cnt).toFixed(2));
		res.status(200).json(response);
	})
	.catch(err => {
		res.status(500).json({
			errCode: 1,
			errMessage: 'Internal Server Error'
		})
	})
}


function roundNumber(value, decimals){
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
