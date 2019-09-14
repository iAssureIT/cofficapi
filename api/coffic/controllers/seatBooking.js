const mongoose  = require("mongoose");
const ObjectID  = require("mongodb").ObjectID;
const SubscriptionOrder = require('../models/subscriptionOrder');
const SeatBooking = require('../models/seatBooking');
const WorkspaceDetails = require('../models/workspaceDetails');
const User          = require('../../coreAdmin/models/users');
var moment                          = require('moment');

exports.chekinUser = (req,res,next)=>{
    // console.log("into seatbooking.....");
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
    // console.log('currDateISO', currDateISO, typeof currDateISO)
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
                console.log("activeSubOrder = ",activeSubOrder.length);
                SeatBooking
                    .find({
                        user_id : req.body.user_id, 
                        plan_id : activeSubOrder[0].plan_id
                    })
                    .estimatedDocumentCount()
                    .then(totCheckIns => {
                        console.log("totCheckIns = ",totCheckIns);
                        console.log("activeSubOrder[0].maxCheckIns = ",activeSubOrder[0].maxCheckIns);
                        if(totCheckIns <= activeSubOrder[0].maxCheckIns) {
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
                            res.status(200).json("Checkin Exceeded");
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


function getuserDetails(user_id){
    return new Promise(function(resolve,reject){
        User.findOne({"_id": new ObjectID(user_id)})
                        .exec()
                        .then(data=>{
                            resolve(data);
                        })
                        .catch(err=>{
                            reject(err);
                  });
            });
}

function getuserDetailsforReports(user_id){
    return new Promise(function(resolve,reject){
        User.findOne({"_id": new ObjectID(user_id)})
                        .exec()
                        .then(data=>{
                            resolve(data);
                        })
                        .catch(err=>{
                            reject(err);
                  });
            });
}


exports.dailyCheckins_Report=(req,res,next)=>{

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
            // console.log('workspace',workspace)
            SeatBooking
                .find({
                    workSpace_id : req.params.workspace_id,
                    date :  currDateISO,
                })
                // .estimatedDocumentCount()
                .exec()
                .then(seatdata =>{
                    // console.log("seatdata",seatdata); 
                        var returnData = {
                            reportdata        : [],
                        };
                        getData();
                        async function getData(){ 
                            for(i = 0 ; i < seatdata.length ; i++){
                               var userData = await getuserDetails(seatdata[i].user_id);
                                // console.log("userDta",userData);
                                returnData.reportdata.push({
                                 "user_id"           : userData._id,
                                 "workspace_id"      : seatdata[i].workSpace_id,
                                 "checkInTime"       : seatdata[i].checkInTime,
                                 "checkOutTime"      : seatdata[i].checkOutTime,
                                 "userName"          : userData.profile.fullName,
                                });
                                // console.log("returnData ",returnData);
                             }
                             if(i >= seatdata.length){
                                res.status(200).json(returnData);
                             }
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

 exports.dailyOrder_Report=(req,res,next)=>{

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
             // console.log('workspace',workspace)
             cafedata= workspace.cafeMenu[0];
            // console.log("cafeeeeee",cafedata);   
           
            SeatBooking
                .find({
                    workSpace_id : req.params.workspace_id,
                    date :  currDateISO,
                })
                // .estimatedDocumentCount()
                .exec()
                .then(seatdata =>{
                    
                    // console.log("seatdata",seatdata); 
                        var returnData = {

                            
                            reportdata        : [],
                        };
                        getData();
                        async function getData(){ 
                            for(i = 0 ; i < seatdata.length ; i++){
                               var userData = await getuserDetails(seatdata[i].user_id);
                                console.log("userDta",userData);
                                returnData.reportdata.push({
                                 "user_id"           : userData._id,
                                 // "workspace_id"      : seatdata[i].workSpace_id,
                                 "checkInTime"       : seatdata[i].checkInTime,
                                 "userName"          : userData.profile.fullName,
                                 "itemName"          : cafedata.itemName,
                                 "price"             : cafedata.cost,
                                 
                                });
                                console.log("returnData ",returnData);
                             }
                             if(i >= seatdata.length){
                                res.status(200).json(returnData);
                             }
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
    
exports.monthly_Report=(req,res,next)=>{


}
 exports.dailyBeverage_Report=(req,res,next)=>{

    WorkspaceDetails
        .findOne({_id : req.params.workspace_id})
        .exec()
        .then(data=>{
             if(data){
                for(i=0; i<data.cafeMenu.length;i++){
                 cafedata=data.cafeMenu[i];
                 
                 console.log("cafedata",cafedata);
                }
                console.log("cafedata",cafedata);
                
               
                res.status(200).json(data);
            }else{
                res.status(404).json(' Not found');
            }
            console.log("data",data);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
        
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
            console.log("Inside workspace",workspace);

            if(workspace.status === "occupied"){
                console.log("occupied = ",workspace.numberOfSeats);
                var returnData = {
                    maxSeats        : workspace.numberOfSeats,
                    bookedSeats     : workspace.numberOfSeats,
                    availableSeats  : 0,
                    userList        : [],
                };

                res.status(200).json(returnData);

            }else{
                SeatBooking
                    .find({
                        workSpace_id : req.params.workspace_id,
                        date :  currDateISO,
                        checkOutTime : null
                    })
                    // .estimatedDocumentCount()
                    .exec()
                    .then(bookedSeats =>{
                            console.log("Inside bookedSeats",bookedSeats);
                        if(bookedSeats.length>0){
                            console.log("available = "+workspace.numberOfSeats+" - "+bookedSeats.length);
                            var returnData = {
                                
                                maxSeats        : workspace.numberOfSeats,
                                bookedSeats     : bookedSeats.length,
                                availableSeats  : workspace.numberOfSeats - bookedSeats.length,
                                userList        : [],
                            };
                            getData();
                            async function getData(){ 
                                for(i = 0 ; i < bookedSeats.length ; i++){
                                   var userData = await getuserDetails(bookedSeats[i].user_id);
                                    returnData.userList.push({
                                     "user_id"           : userData._id,
                                     "workspace_id"      : bookedSeats[i].workSpace_id,
                                     "checkInTime"       : bookedSeats[i].checkInTime,
                                     "checkOutTime"      : bookedSeats[i].checkOutTime,
                                     "userName"          : userData.profile.fullName,
                                    });
                                    // console.log("returnData ",returnData);
                                 }
                                 if(i >= bookedSeats.length){
                                    res.status(200).json(returnData);
                                 }
                            }
                        }else{
                            console.log("bookedSeats length ",bookedSeats.length);
                            res.status(200).json({
                                
                                maxSeats        : workspace.numberOfSeats,
                                bookedSeats     : 0,
                                availableSeats  : workspace.numberOfSeats,
                                userList        : [],
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
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};



// exports.list_seatBooking_available= (req,res,next)=>{
//     SeatBooking.find({})
//         .exec()
//         .then(data=>{
//             if(data){
//                 console.log("data.length",data.length);
//                 for(i=0; i < data.length; i++){
                
//                 console.log("data.workSpace_id",data[i].workSpace_id);

//                 res.status(200).json({
                    
//                     workSpace_id        : data.workSpace_id,
                    
//                 });
//             }
//                 // res.status(200).json(data);
//             }else{
//                 res.status(404).json('Not found');
//             }
//         })
//         .catch(err =>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };

// exports.list_seatBooking_available= (req,res,next)=>{
//     SeatBooking.find({})
//         .exec()
//         .then(data=>{
//             if(data){
//                 console.log("data.length",data.length);
//                 for(i=0; i < data.length; i++){
                
//                 console.log("data.workSpace_id",data[i].workSpace_id);

//                 res.status(200).json({
                    
//                     workSpace_id        : data.workSpace_id,
                    
//                 });
//             }
//                 // res.status(200).json(data);
//             }else{
//                 res.status(404).json('Not found');
//             }
//         })
//         .catch(err =>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };
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
    // console.log("user_id",String(req.params.user_id));
    var selector = { "$match" : {"user_id":String(req.params.user_id)}};
    // console.log("selector",selector);
    SeatBooking
        .find({"user_id":String(req.params.user_id)})
        .exec()
        .then(data=>{
            // console.log("data",data);
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


 
exports.delete_seatBooking = (req,res,next)=>{
    SeatBooking
        .deleteOne({_id:req.params.seatBookingID})
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



exports.checkoutUser = (req,res,next)=>{

    console.log("req.body===============>",req.body);

    // console.log("res.body===============>",res.body);

    var currDate = new Date();
    var day = currDate.getDate();
    var month = currDate.getMonth() + 1;
    var year = currDate.getYear();
    console.log("currDate===============>",currDate);

    if (year < 1900){
        year = year + 1900;
    }
    if(day<10 || day.length<2){day = '0' + day;}
    if(month<10 || month.length<2){month = '0' + month;}

    var currDateISO = year+"-"+month+"-"+day;
    console.log("currDateISO===============>",currDateISO);

if(currDateISO){
    SeatBooking
    .updateOne(
        {
            "user_id"       : req.body.user_id, 
            "workSpace_id"  : req.body.workspace_id,
            "date"          : currDateISO,
        },
        {
            $set:   {
                        checkOutTime  :  currDate,
                    }
        }
    )

   
    .exec()
    .then(data=>{

        
        console.log("data===============>",data);

            if(data.nModified==1){

                res.status(200).json("Checkout is Successful");
            }else{
                res.status(200).json("Something Went Wrong");
            }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}
};

