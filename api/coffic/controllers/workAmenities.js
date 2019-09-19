const mongoose	= require("mongoose");

const WorkAmenities = require('../models/workAmenities');

exports.submit_amenity = (req,res,next)=>{ 
    // WorkAmenities.findOne({"amenityName":req.body.amenityName})
    //         .exec()
    //         .then(dataexist=>{
    //             if(dataexist){
    //                 res.status(200).json("Record Exists");
    //             }else{
    //                     const workAmenities = new WorkAmenities({
    //                                             _id                      : new mongoose.Types.ObjectId(),
    //                                             amenityName              :  req.body.amenityName,
    //                                             icon                     :  req.body.icon,                                               
    //                                     });
    //                     workAmenities.save()
    //                             .then(data=>{
    //                                 res.status(200).json("Successful");
    //                             })
    //                             .catch(err =>{
    //                                 console.log(err);
    //                                 res.status(500).json({
    //                                     error: err
    //                                 });
    //                             });

    //                 }
    //         })
    //         .catch()


            const workAmenities = new WorkAmenities({
                                                _id                      : new mongoose.Types.ObjectId(),
                                                amenityName              :  req.body.amenityName,
                                                icon                     :  req.body.icon,                                               
                                        });
                        workAmenities.save()
                                .then(data=>{
                                    res.status(200).json("Successful");
                                })
                                .catch(err =>{
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });

};

exports.get_amenityList = (req,res,next)=>{
        WorkAmenities.find()
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


exports.get_amenitySingle = (req,res,next)=>{
        WorkAmenities.findOne({"_id":req.params.id})
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


exports.updateamenitySingle = (req,res,next)=>{
    WorkAmenities.findOne({"_id":req.params.id})
                    .then(data=>{ 
                        if(data){
                            WorkAmenities.updateOne({"_id":data._id},
                                        {$set:{
                                            amenityName  :  req.body.amenityName,
                                             icon        :  req.body.icon,
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

exports.deleteamenitySingle = (req,res,next)=>{
        WorkAmenities.deleteOne({"_id":req.params.id})
                        .then(data=>{  
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




