const mongoose = require('mongoose');

const VendorsubscriptionSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,

	plan_id   	            :  String,
	user_id 		        :  String,
	maxCheckIns	            :  Number,
	startDate		 		:  Date,
	endDate			 		:  Date,
	status 			 		:  String,
	createdBy 	 			:  Date,
	createAt 		 		:  Date,

});

module.exports = mongoose.model('Vendorsubscription',VendorsubscriptionSchema);
