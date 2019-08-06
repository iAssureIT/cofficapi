const mongoose = require('mongoose');

const SubscriptionSchema = mongoose.Schema({

					_id			                    : mongoose.Schema.Types.ObjectId,
					user_id 		          	    :  String,
					subscriptionName   	            :  String,
					maxCheckIns	         	        :  Number,
					Cost                            :  Number,
				    Validity                        :  Number,
				    Description                     :  String,
				    lastUpdateAt                    :  Date,
				    updatedBy                    	:  String,
					createdBy 	 					:  String,
					createAt 		 				:  Date,

					// endDate	updatedBy 	 :  user_id,		 				:  Date,
					// status 			 				:  String,
					// plan_id   	          		    :  String,
					// startDate		 				:  Date,

});

module.exports = mongoose.model('subscription',SubscriptionSchema);
