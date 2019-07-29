const mongoose = require('mongoose');

const subscriptionPlanSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
	planName  	            :  String,
	description	            :  String,
	maxCheckIns	            :  Number,
	price 			        :  Number,
	validityDays            :  String,
	createdBy 	            :  String,
	createAt 		        :  Date,
	updatedBy 	            :  String,
	lastUpdateAt            :  Date,

});

module.exports = mongoose.model('subscriptionPlan',subscriptionPlanSchema);
