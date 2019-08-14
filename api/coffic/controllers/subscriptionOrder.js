const mongoose	= require("mongoose");

const SubscriptionOrder = require('../models/subscriptionOrder');
const SubscriptionPlan = require('../models/subscriptionPlan');

exports.submit_subscriptionOrder = (req,res,next)=>{     

    SubscriptionPlan.find({_id : req.body.plan_id})
        .exec()
        .then(plan=>{
            const maxCheckIns = plan.maxCheckIns;
            const validityDays = plan.validityDays;
            var currDate = new Date();
            var day = currDate.getDate();
            var month = currDate.getMonth() + 1;
            var year = currDate.getYear();

            var endDay = parseInt(day) + parseInt(validityDays);
            if(endDay>30){
                endDay = endDay - 30;
                month = month + 1;
                if(month > 12){
                    month = month - 12;
                    year = year + 1;
                }
            }  

            var endDate = new Date(year+"-"+month+"-"+endDay);

            // if(currDate <= endDay){

            // }else{
               

        
            // }

            console.log("endDate = ",endDate);

        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });


        // const subscriptionOrder = new SubscriptionOrder({
        //                         _id          : new mongoose.Types.ObjectId(),
        //                         plan_id      :  "xxx",
        //                         user_id      :  "Id of workspace",
        //                         maxCheckIns  :  req.body.maxCheckIns,
        //                         startDate    :  new Date(),
        //                         endDate      :  new Date(),
        //                         status       :  "paid",
        //                         createAt     :  new Date(),                               
        //                 });
        // subscriptionOrder.save()
        //         .then(data=>{
        //             res.status(200).json("Successfull");
        //         })
        //         .catch(err =>{
        //             console.log(err);
        //             res.status(500).json({
        //                 error: err
        //             });
        //         });
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
    SubscriptionOrder.findOne({"_id":req.params.id})
     SubscriptionOrder.updateOne(
            { _id:req.body.id},  
            {
                $set:{
            
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







