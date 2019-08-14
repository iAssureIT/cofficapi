const mongoose  = require("mongoose");
const WorkspaceDetails = require('../models/workspaceDetails');



exports.create_workspace = (req,res,next)=>{
    console.log("create_workspace--->",req.body);
        const workspaceDetails = new WorkspaceDetails({
                _id                    : new mongoose.Types.ObjectId(),
                nameOfCafe             : req.body.cafeName,
                address                : req.body.address,
                landmark               : req.body.landmark,
                area                   : req.body.area,
                city                   : req.body.state,
                state                  : req.body.city,
                country                : req.body.country,
                pincode                : req.body.pin,
                location               : req.body.location,
                numberOfSeats          : req.body.numberOfSeats,
                name                   : req.body.name,
                mobile                 : req.body.mobile,
                email                  : req.body.email,
                facilities             : req.body.facilities ,
                cost                   : req.body.cost ,
                openingtime            : req.body.openingtime ,
                closingtime            : req.body.closingtime ,
                createdBy              : "ddd" ,
                createAt               : new  Date(),
                // updatedBy              : "ddd",
                lastUpdateAt           : new Date(),
                logo                   : req.body.logo,
                banner                 : req.body.banner,
                workspaceImages        : req.body.workspaceImages,
                cafeAdmin              : req.body.cafeAdmin,
                isOpen                 : true,
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

exports.single_workspace = (req,res,next)=>{
    console.log('list');
    WorkspaceDetails.findOne({"_id":req.params.workspaceID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('workspace Details not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_workspace = (req,res,next)=>{
    console.log('inside api---->',req.params,req.body)
    WorkspaceDetails.findOne({"_id":req.params.workspaceID})
                    .then(data=>{ 
                        // console.log('data',data)
                        if(data){
                            WorkspaceDetails.updateOne({"_id":data._id},
                                        {
                                    $set:{
                                                    
                                        nameOfCafe             : req.body.cafeName,
                                        address                : req.body.address,
                                        landmark               : req.body.landmark,
                                        area                   : req.body.area,
                                        State                  : req.body.state,
                                        City                   : req.body.city,
                                        country                : req.body.country,
                                        pincode                : req.body.pin,
                                        location               : req.body.location,
                                        numberOfSeats          : req.body.numberOfSeats,
                                        name                   : req.body.name,
                                        mobile                 : req.body.mobile,
                                        Email                  : req.body.email ,
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
                                        cafeAdmin              : req.body.cafeAdmin,
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







