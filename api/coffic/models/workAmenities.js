const mongoose = require('mongoose');

const workAmenitiesSchema = mongoose.Schema({
	_id			: mongoose.Schema.Types.ObjectId,
	amenityName : String,
	icon        : String,
});

module.exports = mongoose.model('workAmenities',workAmenitiesSchema);
