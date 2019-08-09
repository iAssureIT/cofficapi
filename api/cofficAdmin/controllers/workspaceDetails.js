const mongoose  = require("mongoose");
const WorkspaceDetails = require('../models/workspaceDetails');



exports.create_workspace = (req,res,next)=>{
    console.log("create_workspace--->",req.body);
        const workspaceDetails = new WorkspaceDetails({
                _id                    : new mongoose.Types.ObjectId(),
                nameOfCafe             : req.body.CafeName,
                address                : req.body.Address,
                landmark               : req.body.Landmark,
                area                   : req.body.Area,
                city                   : req.body.State,
                state                  : req.body.City,
                country                : req.body.Country,
                pincode                : req.body.Pin,
                lat                    : req.body.lat,
                long                   : req.body.long,
                numberOfSeats          : req.body.numberOfSeats,
                Name                   : req.body.Name,
                Mobile                 : req.body.Mobile,
                Email                  : req.body.Email ,
                facilities             : req.body.facilities ,
                Cost                   : req.body.Cost ,
                openingtime            : req.body.openingtime ,
                closingtime            : req.body.closingtime ,
                createdBy              : "ddd" ,
                createAt               : new  Date(),
                // updatedBy              : "ddd",
                lastUpdateAt           : new Date(),
                logo                   : req.body.logo,
                banner                 : req.body.banner,
                workspaceImages        : req.body.workspaceImages,
                cafeAdmin              : "user_id",
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
    WorkspaceDetails.updateOne(
            { _id:req.params.id},  
            {
                $set:{
                id                     : new mongoose.Types.ObjectId(),
                nameOfCafe             : req.body.CafeName,
                address                : req.body.Address,
                landmark               : req.body.Landmark,
                area                   : req.body.Area,
                city                   : req.body.State,
                state                  : req.body.City,
                country                : req.body.Country,
                pincode                : req.body.Pin,
                lat                    : req.body.lat,
                long                   : req.body.long,
                numberOfSeats          : req.body.numberOfSeats,
                Name                   : req.body.Name,
                Mobile                 : req.body.Mobile,
                Email                  : req.body.Email ,
                facilities             : req.body.facilities ,
                createdBy              : "ddd" ,
                createAt               : new  Date(),
                // updatedBy              : "ddd",
                lastUpdateAt           : new Date(),
                logo                   : req.body.logo,
                banner                 : req.body.banner,
                workspaceImages        : req.body.workspaceImages,
                cafeAdmin              : "user_id",
                isOpen                 : true,
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Workspace Details Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Workspace Report Not Found"
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
