const mongoose	= require("mongoose");

const CafeMenu = require('../models/CafeMenu');

exports.fetchMenu = (res,req,next)=>{
    CafeMenu.find({workspaceID : req.params.workspace_ID})
            .exec()
            .then(data=>{
                res.status(200).json(data);
            })
            .catch(err=>{
                res.status(200).json({error:err})
            })
};
exports.submit_cafeItem = (req,res,next)=>{ 
    CafeMenu.findOne({"itemName":req.body.itemName})
            .exec()
            .then(dataexist=>{
                if(dataexist){
                    res.status(200).json("Record Exists");
                }else{
                        const cafeMenu = new CafeMenu({
                                                _id                      : new mongoose.Types.ObjectId(),
                                                itemName                 :  req.body.itemName,
                                                cost                     :  req.body.cost,
                                                workspaceID              :  req.body.workspaceID,
                                               
                                        });
                        cafeMenu.save()
                                .then(data=>{
                                    res.status(200).json("Item Details Submitted Successfully");
                                })
                                .catch(err =>{
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });

                    }
            })
            .catch()

};

exports.get_cafeItemList = (req,res,next)=>{
        CafeMenu.find()
        .sort({"createdAt":-1})
                        .then(data=>{
                            res.status(200).json(data);
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};


exports.get_cafeItemSingle = (req,res,next)=>{
        CafeMenu.findOne({"_id":req.params.id})
        .sort({"createdAt":-1})
                        .then(data=>{                           
                            res.status(200).json(data);
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};


exports.updateItemSingle = (req,res,next)=>{
    CafeMenu.findOne({"_id":req.params.id})
                    .then(data=>{ 
                        if(data){
                            CafeMenu.updateOne({"_id":data._id},
                                                    {$set:{
                                                        itemName  :  req.body.itemName,
                                                         cost     :  req.body.cost,
                                                    }
                                                })
                                    .exec()
                                    .then(data=>{
                                        if(data){
                                            if(data.nModified==1){
                                                res.status(200).json("Item Details Updated Successfully");
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

exports.deleteItemSingle = (req,res,next)=>{
        CafeMenu.deleteOne({"_id":req.params.id})
                        .then(data=>{  
                            console.log("data delete---->",data);
                            if(data.deletedCount==1){
                                res.status(200).json('Deleted Successfully');
                            }                         
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};




