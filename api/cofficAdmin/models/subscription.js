const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,

	plan_id   	          		    :  String,
	subscriptionName   	            :  String,
	user_id 		          	    :  String,
	maxCheckIns	         	        :  Number,
	startDate		 				:  Date,
	Cost                            :  Number,
    Validity                        :  Number
	endDate			 				:  Date,
	status 			 				:  String,
	createdBy 	 					:  String,
	createAt 		 				:  Date,

});

module.exports = mongoose.model('subscription',subscriptionSchema);
