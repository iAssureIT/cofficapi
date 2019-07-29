const mongoose	= require("mongoose");

const SubscriptionPlan = require('../models/subscriptionPlan');

exports.create_workspace = (req,res,next)=>{

        const subscriptionPlan = new SubscriptionPlan({
                _id                    : new mongoose.Types.ObjectId(),
                planName               :  req.body.planName,,
                description             :  req.body.description,
                maxCheckIns             :  req.body.maxCheckIns,
                price                   :  req.body.price,
                validityDays            :  req.body.validityDays,
                createdBy               :  req.body.createdBy,
                createAt                :  new Date(),
                updatedBy               :  req.body.planName,
                lastUpdateAt            :  new Date(),
        });
        subscriptionPlan.save()
                        .then(data=>{
                            res.status(200).json("subscriptionPlan Details Submitted Successfully");
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};

exports.detail_subscriptionPlan = (req,res,next)=>{
    subscriptionPlan.findOne({propertyID:req.params.subscriptionPlanID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('subscriptionPlans Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.list_subscriptionPlans = (req,res,next)=>{
    console.log('list');
    subscriptionPlans.find({})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('subscriptionPlans Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}



exports.update_subscriptionPlans = (req,res,next)=>{
    subscriptionPlans.updateOne(
            { _id:req.body.asubscriptionPlans_ID},  
            {
                $set:{
                _id                    : new mongoose.Types.ObjectId(),
                planName               :  req.body.planName,,
                description             :  req.body.description,
                maxCheckIns             :  req.body.maxCheckIns,
                price                   :  req.body.price,
                validityDays            :  req.body.validityDays,
                createdBy               :  req.body.createdBy,
                createAt                :  new Date(),
                updatedBy               :  req.body.planName,
                lastUpdateAt            :  new Date(),
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "subscriptionPlans Updated Successfully."
                });
            }else{ 
                res.status(401).json({
                    "message": "subscriptionPlans Not Found"
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

exports.delete_subscriptionPlans = (req,res,next)=>{
    subscriptionPlans.deleteOne({_id:req.params.subscriptionPlansID})
        .exec()
        .then(data=>{
            res.status(200).json("subscriptionPlans deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
