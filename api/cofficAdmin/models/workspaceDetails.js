const mongoose = require('mongoose');

const workspaceDetailsSchema = mongoose.Schema({
    _id                     : mongoose.Schema.Types.ObjectId,
    nameOfCafe             : String,
    address                : String,
    landmark               : String,
    area                   : String,
    city                   : String,
    state                  : String,
    country                : String,
    pincode                : String,
    lat                    : String,
    long                   : String,
    numberOfSeats          : Number,
    facilities             : [],
    cafeAdmin              : String,
    createdBy               :  String,
    createAt                :  new Date(),
    updatedBy               :  String,
    lastUpdateAt            :  new Date(),
});

module.exports = mongoose.model('workspaceDetails',workspaceDetailsSchema);
