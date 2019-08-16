const mongoose	= require("mongoose");

const Menuorders = require('../models/menuOrders');

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

exports.detail_orders = (req,res,next)=>{
    Menuorders.findOne({propertyID:req.params.ordersID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Order Details not found');
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
    console.log('list');
    Menuorders.find({})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Order Details not found');
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
