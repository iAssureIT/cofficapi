const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
	workSpace_id 		    : String,
	user_id 				: String,
	date 					: Date,
	item                    : String,
	price                   : Number,
	isDelivered             : Boolean,
	orderedAt               :  Date,
					

});

module.exports = mongoose.model('oredrs',ordersSchema);
