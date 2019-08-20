const mongoose	= require("mongoose");

const SubscriptionOrder = require('../models/subscriptionOrder');
const SubscriptionPlan = require('../models/subscriptionPlan');

exports.submit_subscriptionOrder = (req,res,next)=>{     

    SubscriptionPlan.find({_id : req.body.plan_id})
        .exec()
        .then(plan=>{
            const maxCheckIns = plan[0].maxCheckIns;
            const validityDays = plan[0].validityDays;
            var currDate = new Date();
            var day = currDate.getDate();
            var month = currDate.getMonth() + 1;
            var year = currDate.getYear();
            if (year < 1900){
                year = year + 1900;
            }
            if(day<10 || day.length<2){day = '0' + day;}
            if(month<10 || month.length<2){month = '0' + month;}
            currDate = year+"-"+month+"-"+day;


            var endDay = parseInt(day) + parseInt(validityDays);

            if(endDay>30){
                endDay = endDay - 30;
                if(endDay<10 || endDay.length<2){endDay = '0' + endDay;}
                month = parseInt(month) + 1;                
                if(month > 12){
                    month = parseInt(month) - 12;
                    year = year + 1;
                }
                if(month<10 || month.length<2){month = '0' + month;}
            }  

            var endDate = year+"-"+month+"-"+endDay;


        const newSubscriptionOrder = new SubscriptionOrder({
                                _id          :  new mongoose.Types.ObjectId(),
                                plan_id      :  req.body.plan_id,
                                user_id      :  req.body.user_id,
                                maxCheckIns  :  maxCheckIns,
                                startDate    :  currDate,
                                endDate      :  endDate,
                                pgTransId    :  '123456',
                                status       :  "paid",
                                createdAt     :  new Date(),                               
                        });

            newSubscriptionOrder
                .save()
                .then(data=>{
                    if(data){
                        res.status(200).json("New Subscription is made Successful");
                    }else{
                        res.status(400).json("New Subscription NOT Saved");
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
 

exports.single_activesub = (req,res,next)=>{
  var currDate = new Date();
    var day = currDate.getDate();
    var month = currDate.getMonth() + 1;
    var year = currDate.getYear();
    if (year < 1900){
        year = year + 1900;
    }
    if(day<10 || day.length<2){day = '0' + day;}
    if(month<10 || month.length<2){month = '0' + month;}
    var currDateISO = year+"-"+month+"-"+day;

    SubscriptionOrder.findOne({
                "user_id" : req.params.user_id,
                "endDate" : {$gte : new Date()},
                "status" : "paid" ,
              })
            .exec()
            .then(data=>{
                console.log("data",data);
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


exports.detail_subscriptionOrder = (req,res,next)=>{
    SubscriptionOrder.findOne({"_id":req.params.suborderID})
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
    SubscriptionOrder.find({})
        .exec()
        .then(data=>{
            if(data){
                console.log("data = ",data);
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








