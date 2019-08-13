const mongoose	= require("mongoose");

const SeatBooking = require('../models/workspaceDetails');

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
    seatBooking.findOne({propertyID:req.params.seatBookingID})
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
    seatBooking.find({})
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
     seatBooking.updateOne(
            { _id:req.body.seatBooking_ID},  
            {
                $set:{
                   _id                       : new mongoose.Types.ObjectId(),
                workSpace_id                 :  req.body.workSpace_id,
                user_id                      :  req.body.user_id,,
                date                         :  req.body.date,,
                checkInTime                  :  new Date(),
                checkOutTime                 :  new Date(),
                createdBy                    :  req.body.createdBy,,
                createAt                     :  new Date(), 
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "seatBooking Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "seatBooking Not Found"
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

exports.delete_seatBooking = (req,res,next)=>{
    seatBooking.deleteOne({_id:req.params.seatBookingID})
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
