const mongoose  = require("mongoose");
const ObjectID  = require("mongodb").ObjectID;
const WorkspaceDetails = require('../models/workspaceDetails');
const CafeMenu = require('../models/CafeMenu');
const SeatBooking = require('../models/seatBooking');

exports.create_workspace = (req,res,next)=>{
    console.log("create_workspace--->",req.body);
    const workspaceDetails = new WorkspaceDetails({
                _id                    : new mongoose.Types.ObjectId(),
                nameOfCafe             : req.body.nameOfCafe,
                address                : req.body.address,
                landmark               : req.body.landmark,
                area                   : req.body.area,
                city                   : req.body.city,
                state                  : req.body.state,
                country                : req.body.country,
                pin                    : req.body.pin,
                location               : req.body.location,
                numberOfSeats          : req.body.numberOfSeats,
                name                   : req.body.name,
                mobile                 : req.body.mobile,
                email                  : req.body.email,
                facilities             : req.body.facilities ,
                cost                   : req.body.cost ,
                openingtime            : req.body.openingtime ,
                closingtime            : req.body.closingtime ,
                createdBy              : "user_id" ,
                createdAt               : new  Date(),
                logo                   : req.body.logo,
                banner                 : req.body.banner,
                workspaceImages        : req.body.workspaceImages,
                cafeAdmin              : req.body.cafeAdmin,
                isOpen                 : true,
                status                 : req.body.status,
                reason                 : req.body.reason,
        });
        workspaceDetails.save()
                        .then(data=>{
                            res.status(200).json({ message: "Workspace Details Submitted Successfully",ID:data._id});
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
             });
};

exports.list_workspace = (req,res,next)=>{
    console.log('list_workspace WorkspaceDetails');
    WorkspaceDetails.find()
    .sort({"createdAt":-1})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(200).json('Workspace Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.listcity_workspace = (req,res,next)=>{
    console.log('list_workspace WorkspaceDetails');
    WorkspaceDetails.find()
    .sort({"createdAt":-1})
        .exec()
        .then(data=>{
            console.log("data",data);
            if(data){
               var info = data.map((city,index)=>{
                    return city.city

               }) 
               info = [...new Set(info)];
            console.log('info',info)
                res.status(200).json(info);
            }else{
                res.status(200).json('Not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.single_workspace = (req,res,next)=>{
   console.log('list_workspace-');
   CafeMenu.find({'workspaceID':req.params.workspaceID})
     .sort({"createdAt":-1})
        .exec()
        .then(data=>{
            console.log(data);
            // res.status(200).json(data);
            WorkspaceDetails.findOneAndUpdate({"_id":req.params.workspaceID},
                {$set:{
                    cafeMenu: data
                    }
                },
                // {returnOriginal: false},
            )
            .exec()
            .then(workspace=>{
                console.log('updated',workspace)
                if(workspace){
                  res.status(200).json(workspace)
                }else{
                  res.status(400).json("Not updated")
                }
            })
            .catch(error=>{
                res.status(400).json('No workspace added')
            })
        })
        .catch(error=>{
            console.log(error)
            res.status(500).json('Not Found')
        })
    }
exports.update_workspace = (req,res,next)=>{
    WorkspaceDetails
    .updateOne({"_id":req.params.workspaceID},
                       { $set:{
                                        
                            nameOfCafe             : req.body.nameOfCafe,
                            address                : req.body.address,
                            landmark               : req.body.landmark,
                            area                   : req.body.area,
                            state                  : req.body.state,
                            city                   : req.body.city,
                            country                : req.body.country,
                            pin                    : req.body.pin,
                            location               : req.body.location,
                            numberOfSeats          : req.body.numberOfSeats,
                            name                   : req.body.name,
                            mobile                 : req.body.mobile,
                            email                  : req.body.email ,
                            facilities             : req.body.facilities,
                            cost                   : req.body.cost,
                            openingtime            : req.body.openingtime,
                            closingtime            : req.body.closingtime,
                            status                 : req.body.status,
                            reason                 : req.body.reason,

                            createdBy              : "ddd" ,
                            createAt               : new  Date(),
                            // updatedBy              : "ddd",
                            lastUpdateAt           : new Date(),
                            logo                   : req.body.logo,
                            banner                 : req.body.banner,
                            workspaceImages        : req.body.workspaceImages,
                            // cafeAdmin              : req.body.cafeAdmin,
                            isOpen                 : true,
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

exports.delete_workspace = (req,res,next)=>{
    WorkspaceDetails.deleteOne({_id:req.params.workspaceID})
        .exec()
        .then(data=>{
            res.status(200).json("workspace deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
     });
}


/*Reports API*/



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
            console.log('workspace',workspace)
            SeatBooking
                .find({
                    workSpace_id : req.params.workspace_id,
                    date :  currDateISO,
                })
                // .estimatedDocumentCount()
                .exec()
                .then(seatdata =>{
                    console.log("seatdata",seatdata); 
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
                                 "workspace_id"      : seatdata[i].workSpace_id,
                                 "checkInTime"       : seatdata[i].checkInTime,
                                 "checkOutTime"      : seatdata[i].checkOutTime,
                                 "userName"          : userData.profile.fullName,
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
             console.log('workspace',workspace)
             cafedata= workspace.cafeMenu[0];
            console.log("cafeeeeee",cafedata);   
           
            SeatBooking
                .find({
                    workSpace_id : req.params.workspace_id,
                    date :  currDateISO,
                })
                // .estimatedDocumentCount()
                .exec()
                .then(seatdata =>{
                    
                    console.log("seatdata",seatdata); 
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
    
exports.monthly_Report=(req,res,next)=>{}

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






