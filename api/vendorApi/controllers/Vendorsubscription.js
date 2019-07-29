const mongoose	= require("mongoose");

const Vendorsubscription = require('../models/Vendorsubscription');

exports.create_Vendorsubscription = (req,res,next)=>{

        const vendorsubscription = new Vendorsubscription({
                _id                     : new mongoose.Types.ObjectId(),
               plan_id                  :  req.body.plan_id,
                user_id                 :  req.body.user_id,
                maxCheckIns             :  req.body.maxCheckIns,
                startDate               :  req.body.startDate,
                endDate                 :  req.body.endDate,
                status                  :  req.body.status,
                createdBy               :  req.body.createdBy,
                createAt                :  new Date(),
        });
        vendorsubscription.save()
                        .then(data=>{
                            res.status(200).json("subscription Details Submitted Successfully");
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};

exports.detail_Vendorsubscription = (req,res,next)=>{
    subscription.findOne({propertyID:req.params.SellRecidentialID})
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

exports.list_Vendorsubscription = (req,res,next)=>{
    console.log('list');
    subscription.find({})
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



exports.update_Vendorsubscription = (req,res,next)=>{
        subscription.updateOne(
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

exports.delete_Vendorsubscription = (req,res,next)=>{
    subscription.deleteOne({_id:req.params.subscriptionID})
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
