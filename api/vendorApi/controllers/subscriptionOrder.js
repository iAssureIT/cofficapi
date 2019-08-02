const mongoose	= require("mongoose");

const SubscriptionOrder = require('../models/subscriptionOrder');

exports.submit_subscriptionOrder = (req,res,next)=>{     
        const subscriptionOrder = new SubscriptionOrder({
                                _id          : new mongoose.Types.ObjectId(),
                                plan_id      :  "xxx",
                                user_id      :  "Id of workspace",
                                maxCheckIns  :  req.body.maxCheckIns,
                                startDate    :  new Date(),
                                endDate      :  new Date(),
                                status       :  "paid",
                                createdBy    :  "user_id",
                                createAt     :  new Date(),
                               
                        });
        subscriptionOrder.save()
                .then(data=>{
                    res.status(200).json("Successfull");
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
};






