const mongoose = require('mongoose');

const SeatBookingSchema = mongoose.Schema({
	_id			                : mongoose.Schema.Types.ObjectId,
    user_id 					 :  String,
	workSpace_id				 :  String,
	plan_id					     :  String,
	subcription_id  			 :  String,
	date 						 :  String,
	checkInTime	 				 :  Date,
	checkOutTime 				 :  Date,
	bookAllSeats 				 :  String,
	createdAt 		 			 :  Date,
	getstatus 					 :  String,
});

module.exports = mongoose.model('seatBooking',SeatBookingSchema);
