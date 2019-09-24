const mongoose	= require("mongoose");

const SubscriptionPlan = require('../models/subscriptionPlan');

exports.create_subscriptionPlan = (req,res,next)=>{
    var descriptions = req.body.description.replace(/&nbsnbsp;/g, '');
    const subscriptionplan = new SubscriptionPlan({
                _id                    :  new mongoose.Types.ObjectId(),
                planName               :  req.body.planName,
                description            :  descriptions,
                maxCheckIns            :  req.body.maxCheckIns,
                price                  :  req.body.price,
                validityDays           :  req.body.validityDays,
                discount               :  req.body.discount,
                createdBy              :  req.body.createdBy,
                createAt               :  new Date(),
        });
        SubscriptionPlan.find({
            planName               :  req.body.planName
        })
        .exec()
        .then(data=>{
            if(data.length > 0){
                res.status(200).json("Subscription Plan Already exists");
            }else{               
                subscriptionplan.save()
                .then(data=>{
                    res.status(200).json("Subscription Plan Details Submitted Successfully");
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });              
            }
        })
};

exports.list_subscriptionPlan = (req,res,next)=>{
    SubscriptionPlan.find()
    .sort({"createdAt":-1})
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
 SubscriptionPlan
    .findOne({"_id" :req.params.subscriptionPlansID})
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
    SubscriptionPlan.find({ "_id": { "$ne" :req.params.subscriptionPlansID},"planName" : req.body.planName})
                    .exec()
                    .then(data=>{
                        if(data.length > 0){
                            res.status(200).json({message : "Plan Already exists"});    
                        }else{
                            SubscriptionPlan.updateOne({ "_id" : req.params.subscriptionPlansID},
                                                    { 
                                                        $set : {
                                                            planName                :  req.body.planName,
                                                            maxCheckIns             :  req.body.maxCheckIns,
                                                            price                   :  req.body.price,
                                                            validityDays            :  req.body.validityDays,
                                                            description             :  req.body.description,
                                                            discount                :  req.body.discount,
                                                            updatedBy               :  req.body.createdBy,
                                                            lastUpdateAt            :  new Date(),
                                                        }
                                                    })
                                            .exec()
                                            .then(updateData=>{
                                                if(updateData.nModified == 1){
                                                    res.status(200).json({message : "Data Updated"});
                                                }else{
                                                    res.status(200).json({message : "Data Not Updated"});
                                                }
                                            })
                                            .catch(err=>{
                                                res.status(200).json({error : err});
                                            });
                        }
                        // res.status(200).json(data);
                    })
                    .catch(err=>{
                        res.status(200).json({error : err})
                    });
    
};


exports.delete_subscriptionPlan = (req,res,next)=>{
        SubscriptionPlan.deleteOne({"_id":req.params.subscriptionPlansID})
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
