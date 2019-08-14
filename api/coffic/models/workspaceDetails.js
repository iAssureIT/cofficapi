const mongoose = require('mongoose');

const WorkspaceDetailsSchema = mongoose.Schema({
    _id                    : mongoose.Schema.Types.ObjectId,
    nameOfCafe             : String,
    address                : String,
    landmark               : String,
    area                   : String,
    city                   : String,
    state                  : String,
    country                : String,
    pincode                : String,
    location               : Object,
    numberOfSeats          : Number,
    facilities             : Array,
    cost                   : Number,
    openingtime            : String,
    closingtime            : String,
    mobile                 : Number,
    email                  : String,
    name                   : String,
    createdBy              :  String,
    createAt               :  Date,
    // updatedBy              :  {type: mongoose.Schema.Types.ObjectId, ref : 'users'},
    lastUpdateAt           :  Date,
    logo                   : String,
    banner                 : String,
    workspaceImages        : Array,
    cafeAdmin              : String,
    isOpen                 : Boolean,
});

module.exports = mongoose.model('workspaceDetails',WorkspaceDetailsSchema);
