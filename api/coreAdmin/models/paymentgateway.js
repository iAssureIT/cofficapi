const mongoose = require('mongoose');

const paymentgatewaySchema = mongoose.Schema({
    _id                 : String,
    quikWalletId        : Number,
    environment         : String,
    prodKey             : String,
    prodSecret          : String,
    sandboxKey          : String,
    sandboxSecret       : String,
    user                : String,
    createdAt           : Date,
    prodAPI             : String,
    sandboxAPI          : String,
    mobile              : String,
    secret              : String,
    partnerid           : Number,
    status              : String,
    url                 : String,
    updatedAt           : Date
});

module.exports = mongoose.model('paymentgateway',paymentgatewaySchema);