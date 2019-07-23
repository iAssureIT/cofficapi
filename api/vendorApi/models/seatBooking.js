const mongoose = require('mongoose');

const seatBookingPlanSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,

	workSpace_id				 :  String,
	user_id 					 :  String,
	date 						 :  Date,
	checkInTime	 				 :  new Date(),
	checkOutTime 				 :  new Date(),
	createdBy 	 				 :  user_id,
	createAt 		 			 :  new Date(),	

});

module.exports = mongoose.model('seatBooking',seatBookingSchema);
