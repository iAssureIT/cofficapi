const mongoose	= require("mongoose");

const ProjectSettings = require('../models/projectSettings');

exports.create_projectSettings = (req,res,next)=>{

        const projectSettings = new ProjectSettings({
                _id                     : new mongoose.Types.ObjectId(),
                user_id                 :  req.body.user_id,
                key                     :  req.body.key,
                secret                  :  req.body.secret,
                bucket                  :  req.body.bucket,
                region                  :  req.body.region,
                type                    :  req.body.type,
                
        });
        projectSettings.save()
                        .then(data=>{
                            console.log('data', data);
                            res.status(200).json("Submitted Successfully");
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};

exports.detail_projectSettings = (req,res,next)=>{
    ProjectSettings.findOne({propertyID:req.params.subscriptionlID})
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

exports.list_ProjectSettings = (req,res,next)=>{
    console.log('list');
    ProjectSettings.find()
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
