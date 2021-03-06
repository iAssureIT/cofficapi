const mongoose = require("mongoose");
var moment = require('moment');
const ObjectID = require("mongodb").ObjectID;

const SubscriptionOrder = require('../models/subscriptionOrder');
const SubscriptionPlan = require('../models/subscriptionPlan');

exports.submit_subscriptionOrder = (req, res, next) => {
    console.log("Arrived at = ", new Date());
    console.log("req = ", req.body);
    SubscriptionPlan.find({ _id: req.body.plan_id })
        .exec()
        .then(plan => {
            SubscriptionOrder.find({
                user_id    : req.body.user_id,
                id         : req.body.id,
                billnumbers: req.body.billnumbers,
                paymentId  : req.body.paymentId,
                status     : "paid"
            })
                .then(subscriptionOrders => {
                    console.log("subscriptionOrders => ", subscriptionOrders);
                    console.log("subscriptionOrders length = ", subscriptionOrders.length);

                    if (subscriptionOrders.length == 0) {
                        const maxCheckIns = plan[0].maxCheckIns;
                        const validityDays = plan[0].validityDays;
                        var currDate = new Date();
                        var day = currDate.getDate();
                        var month = currDate.getMonth() + 1;
                        var year = currDate.getYear();
                        if (year < 1900) {
                            year = year + 1900;
                        }
                        if (day < 10 || day.length < 2) { day = '0' + day; }
                        if (month < 10 || month.length < 2) { month = '0' + month; }
                        currDate = year + "-" + month + "-" + day;

                        var endDate = moment(currDate).add(parseInt(validityDays),'days');
                        const newSubscriptionOrder = new SubscriptionOrder({
                            _id: new mongoose.Types.ObjectId(),
                            plan_id: req.body.plan_id,
                            user_id: req.body.user_id,
                            maxCheckIns: maxCheckIns,
                            startDate: currDate,
                            endDate: endDate,
                            status: req.body.status,
                            id: req.body.id,
                            billnumbers: req.body.billnumbers,
                            paymentId: req.body.paymentId,
                            createdAt: new Date(),
                        });

                        newSubscriptionOrder
                            .save()
                            .then(data => {
                                if (data) {
                                    console.log("subscription saved = ",data);
                                    res.status(200).json({message : "New Subscription is made Successful",status : data.status});
                                } else {
                                    res.status(400).json("New Subscription NOT Saved");
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }

                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.single_activesub = (req, res, next) => {
    var currDate = new Date();
    var day = currDate.getDate();
    var month = currDate.getMonth() + 1;
    var year = currDate.getYear();
    if (year < 1900) {
        year = year + 1900;
    }
    if (day < 10 || day.length < 2) { day = '0' + day; }
    if (month < 10 || month.length < 2) { month = '0' + month; }
    var currDateISO = year + "-" + month + "-" + day;

    SubscriptionOrder.findOne({
        "user_id": req.params.user_id,
        "endDate": { $gte: new Date() },
        "status": "paid",
    })
        .exec()
        .then(data => {
            if (data) {

                res.status(200).json(data);
            } else {
                res.status(404).json('Not found');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

function getPlanInfo(plan_id) {
    return new Promise(function (resolve, reject) {
        SubscriptionPlan.findOne({ "_id": new ObjectID(plan_id) })
            .exec()
            .then(data => {
                console.log('data in plan info', data)
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

exports.user_allsub = (req, res, next) => {

    SubscriptionOrder.find({ "user_id": req.params.user_id })
        .sort({ createdAt: -1 })
        .exec()
        .then(data => {
            console.log("data", data);
            if (data) {
                getPlan();
                async function getPlan() {
                    var plan = []
                    for (i = 0; i < data.length; i++) {
                        var planInfo = await getPlanInfo(data[i].plan_id)
                        console.log('plan_info', planInfo)
                        plan.push({
                            planName: planInfo.planName,
                            planPrice: planInfo.price,
                            order: data[i]
                        })
                    }
                    if (i >= data.length) {
                        res.status(200).json(plan);
                    }
                }
            } else {
                res.status(404).json('Not found');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


exports.detail_subscriptionOrder = (req, res, next) => {
    SubscriptionOrder.findOne({ "_id": req.params.suborderID })
        .exec()
        .then(data => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json(' not found');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.list_subscriptionOrder = (req, res, next) => {
    SubscriptionOrder.find({})
        .exec()
        .then(data => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json('Not found');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


exports.paymentResponse = (req, res, next) => {

    console.log("Entered paymentResponse url at: ", new Date());

    res.writeHead(301, { "Location": "/payment-success/" + req.query.status + "/" + req.query.id + "/" + req.query.billnumbers });
    return res.end();
}


exports.paymentSuccess = (req, res, next) => {
    // console.log(":status = ", req.params.status);
    // console.log(":id = ", req.params.id);
    // console.log(":billnumbers = ", req.params.billnumbers);

    console.log("Entered paymentSuccess url at: ", new Date());

    // res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.write('<div style="margin-top:200px;text-align:center;width:50%;margin-left:23%; padding: 30px; border: 1px solid #aaa;"><h1 style="color:#00aa00"> Congratulations !</h1><h3> Your Payment is Successful! <br/> </h3></div>');
    // res.status(200);
    // res.end();   
}






