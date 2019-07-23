const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
	workSpace_id 		    : String,
	user_id 				: String,
	date 					: Date,
	itemsOrdered 			: [
								{item: String, price: Number, isDelivered: Boolean, orderedAt: new Date(),}
								{item: String, price: Number, isDelivered: Boolean, orderedAt: new Date(),}
								{item: String, price: Number, isDelivered: Boolean, orderedAt: new Date(),}
							  ]	

});

module.exports = mongoose.model('oredrs',ordersSchema);
