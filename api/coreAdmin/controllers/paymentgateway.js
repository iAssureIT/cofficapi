const mongoose	= require("mongoose");
var request = require('request-promise');
const QuickWalletMasters        = require('../models/paymentgateway');

var http = require("http");
var request = require('request-promise');

exports.fetch_details = (req,res,next)=>{
    QuickWalletMasters.find()
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

exports.makepayment = (req, res, next) => {
   
	QuickWalletMasters.find({})
		.exec()
		.then(data =>{
			
            const quickWalletMasters = new QuickWalletMasters({
                _id             : mongoose.Types.ObjectId(),      
                "partnerid"      : req.body.partnerid,
                "mobile"         : req.body.mobile,
                "amount"         : req.body.amount,
                "secret"         : req.body.secret
                
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
                        message: 'New payment created!',
                        // data: projectsetting
                    });
                }
            );
    
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


// exports.makepayment = (req,res,next) =>{
//     var mobileNumber    = req.body.mobileNumber;
//     var packageTotal    = req.body.packageTotal;
//     var orderId         = req.body.orderId;
//     var baseUrl         = req.body.baseUrl
   
//     QuickWalletMasters  .findOne({})
//                         .exec()
//                         .then(QWCredential =>{
//                             if(QWCredential){
                            
//                                 var quickWalletInput = {
//                                     "partnerid"      : 426,
//                                     "mobile"         : "8087679825",
//                                     "secret"         : "PMEqFMSxagQsGkgqRgqxBkGmEhAQqYAtc",
//                                     "amount"         : 1,
//                                     "redirecturl"    : 'http://192.168.0.2:5012/'+'/packagePayment-response/'+ 1 ,
//                                     // "redirecturl"    : baseUrl+'/packagePayment-response/'+req.body.OrderId ,
//                                     // "redirecturl"    : 'http://localhost:3000/packagePayment-response/'+req.body.OrderId ,
//                                 };
//                                 var url = API+"/api/partner/"+quickWalletInput.partnerid+"/requestpayment";
                               
//                                 request({
//                                     "method"    :"POST",
//                                     "url"       : url,
//                                     "body"      : quickWalletInput,
//                                     "json"      : true,
//                                     "headers"   :   {
//                                                         "User-Agent": "Integration Test",
//                                                         "Authorization": "Bearer " + "secret",
//                                                     }
//                                 })
//                                 .then(payresponse=>{
//                                   console.log("im in pay response ==",payresponse);
//                                     if(payresponse.status == 'success'){
//                                         var paymentUrl = payresponse.data.url;
//                                         // res.header("Access-Control-Allow-Origin","*");
//                                         res.status(200).json(paymentUrl);
//                                     }else{
//                                         res.status(200).json(false);
//                                     }
//                                 })
//                                 .catch(err =>{
//                                     console.log(err);
//                                     res.status(500).json({
//                                         error: err
//                                     });
//                                 });
//                                 // res.status(200).json({quickWalletInput});
//                             }else{
//                                 res.status(200).json({message:"Qucikwalletmaster data not found"});
//                             }
//                         })
//                         .catch(err =>{
//                             console.log(err);
//                             res.status(500).json({
//                                 error: err
//                             });
//                         });

// }

