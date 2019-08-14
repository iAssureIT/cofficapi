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
exports.detail_subscriptionOrder = (req,res,next)=>{
    SubscriptionOrder.findOne({propertyID:req.params.seatBookingID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Company Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.list_subscriptionOrder = (req,res,next)=>{
    console.log('list');
    SubscriptionOrder.find({})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_subscriptionOrder = (req,res,next)=>{
     SubscriptionOrder.updateOne(
            { _id:req.body.suborder_ID},  
            {
                $set:{
                _id          : new mongoose.Types.ObjectId(),
                                plan_id      :  "",
                                user_id      :  "",
                                maxCheckIns  :  req.body.maxCheckIns,
                                startDate    :  new Date(),
                                endDate      :  new Date(),
                                status       :  "paid",
                                createdBy    :  "user_id",
                                createAt     :  new Date(),
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": " Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": " Not Found"
                });
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.delete_subscriptionOrder = (req,res,next)=>{
    SubscriptionOrder.deleteOne({_id:req.params.suborder_ID})
        .exec()
        .then(data=>{
            res.status(200).json(" deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
      });
}







