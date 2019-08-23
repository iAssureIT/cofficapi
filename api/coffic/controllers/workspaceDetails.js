const mongoose  = require("mongoose");
const ObjectID  = require("mongodb").ObjectID;
const WorkspaceDetails = require('../models/workspaceDetails');
const CafeMenu = require('../models/CafeMenu');

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
            if(data.length>0){
             getData();
                async function getData(){
                 var returnData = [];
                    for(i = 0 ; i < data.length ; i++){
                    var cafeData = await getcafeDetails(data[i].workSpace_id);
                    console.log("cafeData----------",cafeData);
                     returnData.push({
                         _id                    : data[i]._id,
                        nameOfCafe             : data[i].nameOfCafe,
                        address                : data[i].address,
                        landmark               : data[i].landmark,
                        area                   : data[i].area,
                        city                   : data[i].city,
                        state                  : data[i].state,
                        country                : data[i].country,
                        pin                    : data[i].pin,
                        location               : data[i].location,
                        numberOfSeats          : data[i].numberOfSeats,
                        name                   : data[i].name,
                        mobile                 : data[i].mobile,
                        email                  : data[i].email,
                        facilities             : data[i].facilities, 
                        cost                   : data[i].cost, 
                        openingtime            : data[i].openingtime,
                        closingtime            : data[i].closingtime,
                        createdBy              : "user_id" ,
                        createAt               : new  Date(),
                        logo                   : data[i].logo,
                        banner                 : data[i].banner,
                        workspaceImages        : data[i].workspaceImages,
                        cafeAdmin              : data[i].cafeAdmin,
                        isOpen                 : true,
                        status                 : data[i].status,
                        reason                 : data[i].reason,
                        cafedata               : cafeData,

                     })
                    }
                            
                }   

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
                res.status(200).json(workspace)
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







