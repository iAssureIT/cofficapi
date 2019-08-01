const mongoose	= require("mongoose");

const Subscription = require('../models/subscription');

exports.create_subscription = (req,res,next)=>{
    console.log("create_subscription",create_subscription);

        const subscription = new Subscription({
                _id                     : new mongoose.Types.ObjectId(),
                user_id                 :  req.body.user_id,
                subscriptionName        :  req.body.subscriptionName,
                maxCheckIns             :  req.body.maxCheckIns,
                Cost                    :  req.body.Cost,
                Validity                :  req.body.Validity,
                createdBy               :  req.body.createdBy,
                createAt                :  new Date(),
        });

        console.log("subscription",subscription);
        subscription.save()
                        .then(data=>{
                            console.log('data', data);
                            res.status(200).json("subscription Details Submitted Successfully");
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};

exports.detail_subscription = (req,res,next)=>{
    Subscription.findOne({propertyID:req.params.subscriptionlID})
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

exports.list_subscription = (req,res,next)=>{
    console.log('list');
    Subscription.find()
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



exports.update_subscription = (req,res,next)=>{
        Subscription.updateOne(
            { _id:req.body.subscription_ID},  
            {
                $set:{
                _id                     : new mongoose.Types.ObjectId(),
               plan_id                  :  req.body.plan_id,
                user_id                 :  req.body.user_id,
                maxCheckIns             :  req.body.maxCheckIns,
                startDate               :  req.body.startDate,
                endDate                 :  req.body.endDate,
                status                  :  req.body.status,
                createdBy               :  req.body.createdBy,
                createAt                :  new Date(),
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "subscription Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "subscription Report Not Found"
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

exports.delete_subscription = (req,res,next)=>{
    Subscription.deleteOne({_id:req.params.subscriptionID})
        .exec()
        .then(data=>{
            res.status(200).json("subscription deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
