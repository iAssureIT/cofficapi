const mongoose	= require("mongoose");
var request = require('request-promise');
const QuickWalletMasters        = require('../models/paymentgateway');

var http = require("http");
var request = require('request-promise');

// exports.fetch_details = (req,res,next)=>{
//     QuickWalletMasters.find({})
//                     .exec()
//                     .then(data =>{
//                         res.status(200).json(data);
//                     })
//                     .catch(err =>{
//                         console.log(err);
//                         res.status(500).json({
//                             error: err
//                         });
//                     });
   
// }

exports.fetch_details = (req,res,next)=>{
    QuickWalletMasters.find({status: "active"})
                    .exec()
                    .then(data =>{
                        res.status(200).json(data);
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
   
}

// exports.update_paymentdetails = (req,res,next)=>{
//     // var roleData = req.body.role;
//     Companysettings.updateOne(
//         { _id:req.body.uid},  
//         {
//             $set:{
//                 "partnerid"      : req.body.partnerid,
//                 "mobile"         : req.body.mobile,
//                 "amount"         : req.body.amount,
//                 "secret"         : req.body.secret,
//                 "url"            : req.body.url,
//                 "status"         : req.body.status,
            
//             }
//         }
//         )
//         .exec()
//         .then(data=>{
//             console.log('data ',data);
//             if(data.nModified == 1){
//                 res.status(200).json("Payment details Updated ");
//             }else{
//                 res.status(404).json("Payment details Not Updated");
//             }
//         })
//         .catch(err =>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// }




exports.configure_insert = (req, res, next) => {   
        const quickWalletMasters = new QuickWalletMasters({
            _id              : mongoose.Types.ObjectId(),      
            "partnerid"      : req.body.partnerid,
            "mobile"         : req.body.mobile,
            "amount"         : req.body.amount,
            "secret"         : req.body.secret,
            "url"            : req.body.url,
            "status"         : req.body.status,
        });        
        quickWalletMasters.save(
            function(err){                    
                if(err){
                    console.log(err);
                    return  res.status(500).json({
                        error: err
                    });          
                }
                res.status(200).json({ 
                    message: 'New configure inserted!',
                });
            }
        );    
};
