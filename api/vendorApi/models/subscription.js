const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,

	plan_id   	            :  String,
	user_id 		        :  String,
	maxCheckIns	            :  Number,
	startDate		 		:  Date,
	endDate			 		:  Date,
	status 			 		:  String,
	createdBy 	 			:  user_id,
	createAt 		 		:  new Date(),

});

module.exports = mongoose.model('subscription',subscriptionSchema);
