
const plivo = require('plivo');
const User 		= require('../models/users');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.generate_otp = (req,res,next)=>{

	let client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
	let sourceMobile = "+919923393733";
	let OTP = getRandomInt(1000,9999);
	
	console.log("OTP Generated = ",OTP);

    var text = "Hello "+','+'\n'+"To verify your account on TGK, Enter this verification code : "+OTP; 


	// var roleData = req.body.role;
	User.updateOne(
            { _id:req.body._id},  
            {
                $set:{
                    "otp" : OTP,
                }
            }
        )
        .exec()
        .then( data =>{
            console.log('data ',data);
            if(data){
                console.log('data =========>>>',data);

                client.messages.create(
                    src=sourceMobile,
                    dst=req.body.mobile,
                    text=text
                    
                ).then((result)=> {
                    console.log("src+++++>>>>>",src);
                    console.log("dst+++++>>>>>",dst);
                    console.log("RESULT+++++>>>>>",result);
                   
                    console.log("RESULT+++++>>>>>",result);
                    return res.status(200).json("OTP "+OTP+" Sent Successfully ");
                })
                .catch(otpError=>{
                    return res.status(500).json({
                        error: otpError
                    });        
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


