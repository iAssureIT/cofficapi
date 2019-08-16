const mongoose	= require("mongoose");

const SubscriptionOrder = require('../models/subscriptionOrder');
const SeatBooking = require('../models/seatBooking');

exports.create_seatBooking = (req,res,next)=>{

        const seatBooking = new SeatBooking({
                _id                          : new mongoose.Types.ObjectId(),
                workSpace_id                 :  req.body.workSpace_id,
                user_id                      :  req.body.user_id,
                date                         :  req.body.date,
                checkInTime                  :  new Date(),
                checkOutTime                 :  new Date(),
                createdBy                    :  req.body.createdBy,
                createAt                     :  new Date(), 
             
        });
        seatBooking.save()
                        .then(data=>{
                            res.status(200).json("Booking Successful");
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};

exports.detail_seatBooking = (req,res,next)=>{
    SeatBooking.findOne({ID:req.params.seatBookingID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json(' Not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.list_seatBooking = (req,res,next)=>{
    console.log('list');
    SeatBooking.find({})
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

 
exports.update_seatBooking = (req,res,next)=>{
    SeatBooking.updateOne({"_id":data._id},
        {$set:{
           
            date                         :  req.body.date,
            checkInTime                  :  new Date(),
            checkOutTime                 :  new Date(),
            createdBy                    :  req.body.createdBy,
            createAt                     :  new Date(), 
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

exports.delete_seatBooking = (req,res,next)=>{
    SeatBooking.deleteOne({_id:req.params.seatBookingID})
        .exec()
        .then(data=>{
            res.status(200).json("seatBooking deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


exports.validate_checkin = (req,res,next)=>{
    //Input = user_id

    console.log("uid = ",req.params.user_id);

    var currDate = new Date();
    var day = currDate.getDate();
    var month = currDate.getMonth() + 1;
    var year = currDate.getYear();

    if (year < 1900){
        year = year + 1900;
    }

    if(day<10   || day.length<2){day = '0' + day;}
    if(month<10 || month.length<2){month = '0' + month;}

    currDate = year+"-"+month+"-"+day;



    SubscriptionOrder
        .find({ 
                "user_id" : req.params.user_id,
                "endDate" : {$lte : currDate},
                "status" : "paid" ,
             })
        .then(data=>{
            console.log("data",data);
            if(data.length>0){
               seatBooking
                    .find({
                        user_id : req.params.user_id, 
                        plan_id : data[0].plan_id
                    })
                    .count()
                    .then(totCheckIns => {
                        console.log(totCheckIns + " | " + data.maxCheckIns);
                        if (totCheckIns < data.maxCheckIns) {
                            res.status(200).json("User Subscription Plan is Valid for "+(totCheckIns - Data.maxCheckIns)+" more times");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });

            }else{
                res.status(404).json("No Active Plan Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}