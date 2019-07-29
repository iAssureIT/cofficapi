const mongoose = require('mongoose');

const seatBookingPlanSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,

	workSpace_id				 :  String,
	user_id 					 :  String,
	date 						 :  Date,
	checkInTime	 				 :  Date,
	checkOutTime 				 :  Date,
	createdBy 	 				 :  user_id,
	createAt 		 			 :  Date,	

});

module.exports = mongoose.model('seatBooking',seatBookingSchema);
