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
        SubscriptionPlan.find({
            planName               :  req.body.planName
        })
        .exec()
        .then(data=>{
            if(data.length > 0){
                console.log('data', data);
                res.status(200).json("Subscription Plan Already exists");
            }else{               
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
            }
        })
};

exports.list_subscriptionPlan = (req,res,next)=>{
    console.log('list');
    SubscriptionPlan.find()
    .sort({"createdAt":-1})
        .exec()
        .then(data=>{
            console.log("data//////",data)
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



// exports.single_subscriptionPlan = (req,res,next)=>{
//         SubscriptionPlan.findOne({"_id":r})
//                         .then(data=>{                           
//                             res.status(200).json(data);
//                         })
//                         .catch(err =>{
//                             console.log(err);
//                             res.status(500).json({
//                                 error: err
//                             });
//                         });
// };


exports.update_subscriptionPlan = (req,res,next)=>{
    SubscriptionPlan
    .find({planName : req.body.planName})
    .exec()
    .then(data=>{
        if(data.length>0){
            res.status(200).json("Plan Already Exists");
        }else{
            console.log('inside api---->',req.params,req.body)
        SubscriptionPlan
            .updateOne({"_id":req.params.subscriptionPlansID},
                    {$set:{                                          
                        plan_id                 :  req.body.plan_id,
                        planName                :  req.body.planName,
                        maxCheckIns             :  req.body.maxCheckIns,
                        price                   :  req.body.price,
                        validityDays            :  req.body.validityDays,
                        description             :  req.body.description,
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

        }
    })
    
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
