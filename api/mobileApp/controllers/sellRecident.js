const mongoose	= require("mongoose");

const SellRecidential = require('../models/sellRecident');

exports.create_sellRecidential = (req,res,next)=>{
	SellRecidential.find()
		            .exec()
		            .then(data =>{
                        var propertyID = data.length + 101;
                        const sellRecidential = new SellRecidential({
                                _id                     : new mongoose.Types.ObjectId(),
                                propertyID              : propertyID,
                                propertyholder          : req.body.propertyholder,
                                propertypurpose         : req.body.propertypurpose,
                                propertytype            : req.body.propertytype,
                                propertyloc             : req.body.propertyloc,
                                floor                   : req.body.floor,
                                totalfloor              : req.body.totalfloor,
                               

                        });
                        sellRecidential.save()
                                        .then(data=>{
                                            res.status(200).json("Sell Recidential Added");
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

exports.detail_sellRecidential = (req,res,next)=>{
    SellRecidential.findOne({propertyID:req.params.SellRecidentialID})
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

exports.list_sellRecidential = (req,res,next)=>{
    console.log('list');
    SellRecidential.find({})
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



exports.update_sellRecidential = (req,res,next)=>{
    var info = req.params.info;
    var action = req.params.action;
    console.log('update cs ',info, ' ,',action,' ,',req.body.propertyID);
    console.log("I am in update1");
    switch(action){
        case 'add' :
            switch(info){
                case 'locations':
                     console.log("I am in switch");
                     console.log("I am in req.body.locations",req.body);

                     SellRecidential.updateOne(

                        { propertyID : req.body.propertyID},  
                        {
                            $push:{
                                propertylocation        : 
                                                        {
                                                            pincode             : req.body.pincode,
                                                            area                : req.body.area,
                                                            subarea             : req.body.subarea,
                                                            socity              : req.body.socity,
                                                            housebuilding       : req.body.housebuilding,
                                                            landmark            : req.body.landmark,
                                                        
                                                        },
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data.nModified == 1){
                            res.status(200).json("Property location Details added");
                        }else{
                            res.status(404).json("Property location Not found");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });  
                    break;              
                case 'propertyDetail' :
                console.log("I am in req.body.propertyID",req.body.propertyID);

                    SellRecidential.updateOne(
                        { propertyID : req.body.propertyID},  
                        {
                            $push:{
                                propertyDetails         :   {
                                                                furnishedstatus     :  req.body.furnishedstatus,
                                                                bedrooms            :  req.body.bedrooms,
                                                                balconies           :  req.body.balconies,
                                                                bathrooms           :  req.body.bathrooms,
                                                                ageofproperty       :  req.body.ageofproperty,
                                                                facing              :  req.body.facing,
                                                            
                                                                superArea           :  req.body.subarea,
                                                                builtupArea         :  req.body.builtupArea,
                                                                
                                                            }
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data.nModified == 1){
                            res.status(200).json("Property Details Details added");
                        }else{
                            res.status(404).json("Property Details Not found");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });  
                    break;
                       
                case 'transactionType' :
                console.log("I am in switch bank");
                console.log("propertyID===>",req.body.propertyID);

                    SellRecidential.updateOne(

                        { propertyID : req.body.propertyID},  
                        {
                            $push:{
                                financial               :   {

                                                                expectedrate        : req.body.expectedrate,
                                                                totalprice          : req.body.totalprice,
                                                                includecharges      : req.body.includecharges,
                                                                maintenancecharges  : req.body.maintenancecharges,
                                                                maintenanceper      : req.body.maintenanceper,
                                                                availableFrom       : req.body.availableFrom,
                                                                description         : req.body.description,
                                                            },
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data.nModified == 1){
                            res.status(200).json("Transaction Type Details added");
                        }else{
                            res.status(404).json("Transaction Type Not found");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });  
                    break;
                default :
                    res.status(404).json('This Information is not captured yet.')
            };
            break;  
            
            case 'Amanities' :
            console.log("I am in req.body.propertyID",req.body.propertyID);

                SellRecidential.updateOne(
                    { propertyID : req.body.propertyID},  
                    {
                        $push:{
                            Amanities                  : {
                                                              aminities         : req.body.aminities,
                                
                                                        },
                        }
                    }
                )
                .exec()
                .then(data=>{
                    console.log('data ',data);
                    if(data.nModified == 1){
                        res.status(200).json("Amanities Details added");
                    }else{
                        res.status(404).json("Amanities Not found");
                    }
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });  
                break;
                case 'Planvisit' :
                console.log("I am in req.body.propertyID",req.body.propertyID);

                    SellRecidential.updateOne(
                        { propertyID : req.body.propertyID},  
                        {
                            $push:{
                                Planvisit       : {
                                                    contactperson         : req.body.contactperson,
                                                    contactpersonmob      : req.body.contactpersonmob,
                                                    availability          : req.body.availability,
                                                    startfrom             : req.body.startfrom,
                                                    todate                : req.body.todate,
                                                    
                                                },
                            }
                        }
                    )
                    .exec()
                    .then(data=>{
                        console.log('data ',data);
                        if(data.nModified == 1){
                            res.status(200).json("Plan visit added");
                        }else{
                            res.status(404).json("Plan visit Not found");
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });  
                    break;
       
    }
}

exports.delete_SellRecidential = (req,res,next)=>{
    SellRecidential.deleteOne({_id:req.params.aellRecidentialID})
        .exec()
        .then(data=>{
            res.status(200).json("Sell Recidential deleted");
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
