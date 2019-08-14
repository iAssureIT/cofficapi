const mongoose	= require("mongoose");

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
                allowcheckin                 :  true,
        });
        seatBooking.save()
                        .then(data=>{
                            res.status(200).json("Booking Successfully");
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};

exports.detail_seatBooking = (req,res,next)=>{
    SeatBooking.findOne({propertyID:req.params.seatBookingID})
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

exports.list_seatBooking = (req,res,next)=>{
    console.log('list');
    SeatBooking.find({})
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

 

exports.update_seatBooking = (req,res,next)=>{
    console.log('inside api---->',req.params,req.body)
    SeatBooking.findOne({"_id":req.params.seatBookingID})
                    .then(data=>{ 
                        if(data){
                            SeatBooking.updateOne({"_id":data._id},
                                {$set:{
                                    workSpace_id                 :  req.body.workSpace_id,
                                    user_id                      :  req.body.user_id,
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
/*
exports.allow_seatBooking = (req,res,next)=>{
    subscriptionorder  
    user_id->subscriptionorder-> (subsciption y/n)
    checkin date<=subscription end date

    seatBooking
    no of checkins : aggregate sum()

true


SeatBooking.findOne({_id:req.params.})
        .exec()
        .then(data=>{
            res.status(200).json("Allow seatbooking");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}*/