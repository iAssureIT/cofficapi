const mongoose	        = require("mongoose");
var moment              = require('moment');

const SubscriptionOrder = require('../models/subscriptionOrder');
const SubscriptionPlan  = require('../models/subscriptionPlan');

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

            var endDate = moment(currDate).add('days',parseInt(validityDays))
            const newSubscriptionOrder = new SubscriptionOrder({
                                _id          :  new mongoose.Types.ObjectId(),
                                plan_id      :  req.body.plan_id,
                                user_id      :  req.body.user_id,
                                maxCheckIns  :  maxCheckIns,
                                startDate    :  currDate,
                                endDate      :  endDate,
                                status       :  req.body.status,
                                id           :  req.body.id,
                                billnumbers  :  req.body.billnumbers,
                                paymentId    : req.body.paymentId,
                                createdAt    :  new Date(),                               
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

 exports.user_allsub = (req,res,next)=>{

    SubscriptionOrder.find({ "user_id" : req.params.user_id })
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
                res.status(404).json(' not found');
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


exports.paymentResponse = (req,res,next)=>{
    //res.writeHead(301, { "Location": "http://" + req.headers['host'] + '/page-b.html' });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<div style="margin-top:200px;text-align:center;width:50%;margin-left:23%; padding: 30px; border: 1px solid #aaa;"><h1 style="color:#00aa00">'+req.query.status+'/'+req.query.id+'/'+req.query.billnumbers+'</h1></div>');
    res.writeHead(301, { "Location": "/payment-success/"+req.query.status+"/"+req.query.id+"/"+req.query.billnumbers });
    return res.end();
}


exports.paymentSuccess = (req,res,next)=>{
    // res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.write('<div style="margin-top:200px;text-align:center;width:50%;margin-left:23%; padding: 30px; border: 1px solid #aaa;"><h1 style="color:#00aa00"> Congratulations !</h1><h3> Your Payment is Successful! <br/> Click below button to proceed. </h3></div>');
    // res.status(200);
    // res.end();   
}






