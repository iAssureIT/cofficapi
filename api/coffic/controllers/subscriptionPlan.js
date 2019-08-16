const mongoose	= require("mongoose");

const SubscriptionPlan = require('../models/subscriptionPlan');

exports.create_subscriptionPlan = (req,res,next)=>{
    const subscriptionplan = new SubscriptionPlan({
                _id                    :  new mongoose.Types.ObjectId(),
                planName               :  req.body.planName,
                description            :  req.body.description,
                maxCheckIns            :  req.body.maxCheckIns,
                price                  :  req.body.price,
                validityDays           :  req.body.validityDays,
                createdBy              :  req.body.createdBy,
                createAt               :  new Date(),
        });

        subscriptionplan.save()
                        .then(data=>{
                            console.log('data', data);
                            res.status(200).json("Subscription Plan Details Submitted Successfully");
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                
          
};

exports.list_subscriptionPlan = (req,res,next)=>{
    console.log('list');
    SubscriptionPlan.find()
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('SubscriptionPlan Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}



exports.single_subscriptionPlan = (req,res,next)=>{
        SubscriptionPlan.findOne({"_id":req.params.subscriptionID})
                        .then(data=>{                           
                            res.status(200).json(data);
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};


exports.update_subscriptionPlan = (req,res,next)=>{
    console.log('inside api---->',req.params,req.body)
        SubscriptionPlan
            .updateOne({"_id":req.params.subscriptionID},
                    {$set:{                                          
                        plan_id                 :  req.body.plan_id,
                        subscriptionName        :  req.body.subscriptionName,
                        maxCheckIns             :  req.body.maxCheckIns,
                        Cost                    :  req.body.Cost,
                        Validity                :  req.body.Validity,
                        Description             :  req.body.Description,
                        updatedBy               :  req.body.createdBy,
                        lastUpdateAt            :  new Date(),
                    }
            })
            .exec()
            .then(data=>{
                if(data){
                    if(data.nModified==1){
                        res.status(200).json("Successful");
                    }
                }

            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
};


exports.delete_subscriptionPlan = (req,res,next)=>{
        SubscriptionPlan.deleteOne({"_id":req.params.subscriptionID})
                        .then(data=>{
                            if(data.deletedCount==1){
                                res.status(200).json('Deleted Successfully');
                            }                         
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};
