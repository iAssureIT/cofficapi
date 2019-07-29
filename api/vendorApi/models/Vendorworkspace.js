const mongoose = require('mongoose');

const VendorworkspaceSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
	nameOfCafe 		       : String,
	address 			   : String,
	landmark 			   : String,
	area 				   : String,
	city				   : String,
	state 				   : String,
	country 			   : String,
	pincode 			   : String,
	lat 				   : String,
	long 				   : String,
	numberOfSeats          : Number,
	facilities 		       : [],
	cafeAdmin  		       :  String,
	createdBy 	           :  String,
	createAt 		       :  Date,
	updatedBy 	           :  String,
	lastUpdateAt           :  Date,
});

module.exports = mongoose.model('Vendorworkspace',VendorworkspaceSchema);
