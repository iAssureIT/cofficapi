const mongoose	= require("mongoose");

const Orders = require('../models/orders');

exports.create_orders = (req,res,next)=>{

           const orders = new Orders({
                _id                      : new mongoose.Types.ObjectId(),
                workSpace_id             :  req.body.workSpace_id,
                user_id                  :  req.body.user_id,
                date                     :  req.body.date,
                item                     :  req.body.item,
                price                    :  req.body.price,
                isDelivered              :  req.body.isDelivered,
                orderedAt                :  req.body.orderedAt,
        });


        orders.save()
                        .then(data=>{
                            res.status(200).json("order Details Submitted Successfully");
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
};

exports.detail_orders = (req,res,next)=>{
    Orders.findOne({propertyID:req.params.ordersID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('order Details not found');
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
    Orders.find({})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('order Details not found');
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
       Orders .updateOne(
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
                    "message": "orders Updated Successfully."
                });
            }else{
                res.status(401).json({
                    "message": "orders  Not Found"
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
    Orders.deleteOne({_id:req.params.ordersID})
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
