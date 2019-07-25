const mongoose = require('mongoose');

const SubscriptionSchema = mongoose.Schema({

					_id			                    : mongoose.Schema.Types.ObjectId,
					subscriptionName   	            :  String,
					user_id 		          	    :  String,
					maxCheckIns	         	        :  Number,
					Cost                            :  Number,
				    Validity                        :  Number,
					createdBy 	 					:  String,
					createAt 		 				:  Date,
					// endDate			 				:  Date,
					// status 			 				:  String,
					// plan_id   	          		    :  String,
					// startDate		 				:  Date,

});

module.exports = mongoose.model('subscription',SubscriptionSchema);
