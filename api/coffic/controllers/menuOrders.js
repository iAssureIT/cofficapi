const mongoose	= require("mongoose");
const ObjectID  = require("mongodb").ObjectID;
const Menuorders = require('../models/menuOrders');
const WorkspaceDetails = require('../models/workspaceDetails');

exports.update_isDelivered = (req,res,next)=>{
       Menuorders.updateOne(
            { _id:req.body.ordersID},  
            {
                $set:{
                    isDelivered                :  req.body.checked,
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Orders Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Orders  Not Found"
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

exports.create_orders = (req,res,next)=>{
           const menuorders = new Menuorders({
                _id                      : new mongoose.Types.ObjectId(),
                workSpace_id             :  req.body.workSpace_id,
                user_id                  :  req.body.user_id,
                date                     :  req.body.date,
                item                     :  req.body.item,
                price                    :  req.body.price,
                isDelivered              :  req.body.isDelivered,
                orderedAt                :  req.body.orderedAt,
        });
        menuorders.save()
                        .then(data=>{
                            res.status(200).json("Order Details Submitted Successfully");
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
    });
}


exports.detail_userorders = (req,res,next)=>{
    Menuorders.find({"user_id":String(req.params.user_id)})
        .sort({ date: -1 })
        .exec()
        .then(data=>{
            
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
                            "item"              : data[i].item,
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

exports.list_orders = (req,res,next)=>{
    Menuorders.find({})
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



exports.update_orders = (req,res,next)=>{
       Menuorders.updateOne(
            { _id:req.body.ordersID},  
            {
                $set:{
                    _id                    : new mongoose.Types.ObjectId(),
                workSpace_id               :  req.body.workSpace_id,
                user_id                    :  req.body.user_id,
                date                       :  req.body.date,
                item                       :  req.body.item,
                price                      :  req.body.price,
                isDelivered                :  req.body.isDelivered,
                orderedAt                  :  req.body.orderedAt,
                }
            }
        )
        .exec()
        .then(data=>{
            if(data.nModified == 1){
                res.status(200).json({
                    "message": "Orders Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "Orders  Not Found"
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

exports.delete_orders = (req,res,next)=>{
    Menuorders.deleteOne({_id:req.params.ordersID})
        .exec()
        .then(data=>{
            res.status(200).json("orders  deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
