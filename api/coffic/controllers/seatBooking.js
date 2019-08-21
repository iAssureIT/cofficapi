const mongoose  = require("mongoose");
const ObjectID  = require("mongodb").ObjectID;
const SubscriptionOrder = require('../models/subscriptionOrder');
const SeatBooking = require('../models/seatBooking');
const WorkspaceDetails = require('../models/workspaceDetails');

exports.create_seatBooking = (req,res,next)=>{
    console.log("into seatbooking.....");
    var currDate = new Date();
    var day = currDate.getDate();
    var month = currDate.getMonth() + 1;
    var year = currDate.getYear();
    if (year < 1900){
        year = year + 1900;
    }
    if(day<10 || day.length<2){day = '0' + day;}
    if(month<10 || month.length<2){month = '0' + month;}
    currDateISO = year+"-"+month+"-"+day;

    var selector={ 
                "user_id" : req.body.user_id,
                "endDate" : {$gte : new Date()},
                "status" : "paid" , };

    console.log("selector",selector);
    
    SubscriptionOrder
        .find({ 
                "user_id" : req.body.user_id,
                "endDate" : {$gte : new Date()},
                "status" : "paid" ,
             })
        .then(activeSubOrder=>{
            if(activeSubOrder.length>0){
                console.log("activeSubOrder = ",activeSubOrder);
                SeatBooking
                    .find({
                        user_id : req.body.user_id, 
                        plan_id : activeSubOrder[0].plan_id
                    })
                    .estimatedDocumentCount()
                    .then(totCheckIns => {
                        console.log("totCheckIns = ",totCheckIns);
                        console.log("activeSubOrder[0].maxCheckIns = ",activeSubOrder[0].maxCheckIns);
                        if(totCheckIns < activeSubOrder[0].maxCheckIns) {
                            const seatBookingObj = new SeatBooking({
                                _id                 :  new mongoose.Types.ObjectId(),
                                plan_id             :  activeSubOrder[0].plan_id,
                                user_id             :  req.body.user_id,
                                workSpace_id        :  req.body.workSpace_id,
                                date                :  currDateISO,
                                bookAllSeats        : '' ,
                                checkInTime         :  new Date(),
                                checkOutTime        :  "",
                                createAt            :  new Date(),                      
                            });

                            seatBookingObj
                                .save()
                                .then(data=>{                   
                                    var message = "Booking Successful";                 
                                    if(activeSubOrder[0].maxCheckIns == (totCheckIns+1)){
                                        SubscriptionOrder
                                            .update(
                                                {plan_id : activeSubOrder[0].plan_id},
                                                {$set : {"status" : "inactive"}}
                                            )
                                            .then(data=>{
                                                message = "Booking Successful & Order status made inactive";
                                            })
                                            .catch(err =>{
                                                console.log(err);
                                                res.status(500).json({
                                                    error: err
                                                });
                                            });
                                    }
                                    res.status(200).json(message);                                    
                                })
                                .catch(err =>{
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        }else{
                            res.status(200).json("Booking Can not be made because Plan is inactive.");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }else{
                res.status(200).json("User Has not paid yet");
            }

   });
}

// exports.seatsOccupied = (req,res,next)=>{
//     console.log("into seats .....");
//     var currDate = new Date();
//     var day = currDate.getDate();
//     var month = currDate.getMonth() + 1;
//     var year = currDate.getYear();
//     if (year < 1900){
//         year = year + 1900;
//     }
//     if(day<10 || day.length<2){day = '0' + day;}
//     if(month<10 || month.length<2){month = '0' + month;}
//     currDateISO = year+"-"+month+"-"+day;

//     SeatBooking.updateOne({"_id":req.params.workspaceId},
//                 {
//                     $set:{
    
//                         plan_id             :  "",
//                         user_id             :  "",
//                         workSpace_id        :  req.body.workspaceId,
//                         bookAllSeats        :  req.body.bookAllSeats,
//                         date                :  currDateISO,
//                         checkInTime         :  new Date(),
//                        }
                                             
//                     })
//                     .exec()
//                     .then(data=>{
//                         console.log("data",data);
//                         if(data){
//                             if(data.nModified==1){
//                                 res.status(200).json("Successful");
//                             }
//                         }

//                     })
//             .catch(err =>{
//                 console.log(err);
//                 res.status(500).json({
//                     error: err
//                 });
//             });
//     };


exports.detail_seatBooking = (req,res,next)=>{
    SeatBooking.findOne({user_id:req.params.seatBookingID})
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
};

exports.availableSeats = (req,res,next)=>{
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
    
    WorkspaceDetails
        .findOne({_id : req.params.workspace_id})
        .exec()
        .then(workspace => {
            SeatBooking
                .find({
                    workspace_id : req.params.workspace_id,
                    date : currDateISO,
                    checkOutTime : ""
                })
                .estimatedDocumentCount()
                .exec()
                .then(bookedSeats =>{
                    if(bookedSeats){
                        wsStatus = workspace.status;
                        if(wsStatus === "occupied"){
                            bookedSeats = workspace.numberOfSeats;
                        }
                        var availableSeats = workspace.numberOfSeats - bookedSeats;
                        res.status(200).json({
                            maxSeats        : workspace.numberOfSeats,
                            bookedSeats     : bookedSeats,
                            availableSeats  : availableSeats
                        });
                    }else{
                        res.status(200).json({
                            maxSeats        : workspace.numberOfSeats,
                            bookedSeats     : bookedSeats,
                            availableSeats  : workspace.numberOfSeats
                        });
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

exports.availableSeatsdata = (req,res,next)=>{
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
    
    WorkspaceDetails
        .findOne({_id : req.params.workspace_id})
        .exec()
        .then(workspace => {
            SeatBooking
                .find({
                    workspace_id : req.params.workspace_id,
                    date : currDateISO,
                    checkOutTime : ""
                })
                // .estimatedDocumentCount()
                .exec()
                .then(bookedSeats =>{
                    console.log("bookedSeats",bookedSeats);
                     res.status(200).json("Data found");

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

exports.list_seatBooking = (req,res,next)=>{
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
};
exports.list_checkIncount = (req,res,next)=>{
    SeatBooking.find({})
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
};
function getworkSpaceDetails(workspaceId){
    return new Promise(function(resolve,reject){
        WorkspaceDetails.findOne({"_id": new ObjectID(workspaceId)})
                        .exec()
                        .then(data=>{
                            resolve(data);
                        })
                        .catch(err=>{
                            reject(err);
                        });
        // resolve(workspaceId);
    });
}
exports.list_userSeatBooking=(req,res,next)=>{
    console.log("user_id",String(req.params.user_id));
    var selector = { "$match" : {"user_id":String(req.params.user_id)}};
    console.log("selector",selector);
    SeatBooking
        .find({"user_id":String(req.params.user_id)})
        .exec()
        .then(data=>{
            console.log("data",data);
            if(data.length > 0){
                getData();
                async function getData(){
                    var returnData = [];
                    for(i = 0 ; i < data.length ; i++){
                        var workSpaceData = await getworkSpaceDetails(data[i].workSpace_id);
                        returnData.push({
                            "_id"               : data[i]._id,
                            "user_id"           : data[i].user_id,
                            "date"              : data[i].date,
                            "checkInTime"       : data[i].checkInTime,
                            "checkOutTime"      : data[i].checkOutTime,
                            "workSpace_id"      : data[i].workSpace_id,
                            "workspaceDetails"  : workSpaceData,
                        });
                    }
                    if(i >= data.length){
                        res.status(200).json(returnData);        
                    }
                }
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
};


exports.validate_checkin = (req,res,next)=>{
    SubscriptionOrder
        .find({ 
                "user_id" : req.params.user_id,
                "endDate" : {$gte : new Date()},
                "status" : "paid" ,
             })
        .then(data=>{
            if(data.length>0){
               SeatBooking
                    .find({
                        user_id : req.params.user_id, 
                        plan_id : data[0].plan_id,
                    })

                    .countDocuments()
                    .then(totCheckIns => {
                        if (totCheckIns < data[0].maxCheckIns) {
                            res.status(200).json("User Subscription Plan is Valid for "+(totCheckIns - data[0].maxCheckIns)+" more times");
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