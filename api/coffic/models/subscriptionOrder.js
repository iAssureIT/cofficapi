const mongoose = require('mongoose');

const subscriptionOrderSchema = mongoose.Schema({
	_id		     : mongoose.Schema.Types.ObjectId,
	plan_id   	 :  String,
	user_id 	 :  String,
	maxCheckIns	 :  Number,
	startDate	 :  Date,
	endDate		 :  Date,
	pgTransId 	 :  String,
	status 		 :  String,
	createdBy 	 :  String,
	createdAt 	 :  Date,
});

module.exports = mongoose.model('subscriptionOrder',subscriptionOrderSchema);
