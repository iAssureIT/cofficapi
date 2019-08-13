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
                Description             :  req.body.Description,
                lastUpdateAt            :  req.body.lastUpdateAt,
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

exports.list_subscription = (req,res,next)=>{
    console.log('list');
    Subscription.find()
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('subscription Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}



exports.single_subscription = (req,res,next)=>{
        Subscription.findOne({"_id":req.params.subscriptionID})
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


exports.update_subscription = (req,res,next)=>{
    console.log('inside api---->',req.params,req.body)
    Subscription.findOne({"_id":req.params.subscriptionID})
                    .then(data=>{ 
                        if(data){
                            Subscription.updateOne({"_id":data._id},
                                        {$set:{                                          
                                           plan_id                  :  req.body.plan_id,
                                            user_id                 :  req.body.user_id,
                                            subscriptionName        :  req.body.subscriptionName,
                                            maxCheckIns             :  req.body.maxCheckIns,
                                            Cost                    :  req.body.Cost,
                                            Validity                :  req.body.Validity,
                                            Description             :  req.body.Description,
                                            lastUpdateAt            :  new Date(),
                                            createdBy               :  req.body.createdBy,
                                            createAt                :  new Date(),
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
                                .catch()
                        }                          
                        
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
};


exports.delete_subscription = (req,res,next)=>{
        Subscription.deleteOne({"_id":req.params.subscriptionID})
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
