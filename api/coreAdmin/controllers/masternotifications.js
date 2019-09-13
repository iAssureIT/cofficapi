const mongoose = require("mongoose");

const Masternotifications = require("../models/masternotifications");
var nodeMailer                      = require('nodemailer');
const User          = require('../models/users');


exports.create_template = (req, res, next) => {
    console.log('req=>',req)
    const masterNotifications = new Masternotifications({
        _id             : mongoose.Types.ObjectId(),      
        templateType    : req.body.templateType,
        templateName    : req.body.templateName,
        subject         : req.body.subject,
        content         : req.body.content,
    });
    
    masterNotifications.save(
        function(err){
            if(err){
                console.log(err);
                return  res.status(500).json({
                    error: err
                });          
            }
            res.status(200).json({ 
                message: 'New Notification Template created!',
                data: masterNotifications
            });
        }
    );

};
// Handle delete contact
exports.delete_template = function (req, res) {
    Masternotifications.deleteOne({
        _id: req.params.notificationmasterID
    }, function (err) {
        if(err){
            return res.json({
                error: err
            });
        }
        res.json({
            status: "success",
            message: 'Master notification deleted'
        });
    });
};
exports.detail_fetch = (req,res,next)=>{
    Masternotifications.findOne({_id:req.params.notificationmasterID})
        .exec()
        .then(data=>{
            if(data){
                res.status(200).json(data);
            }else{
                res.status(404).json('Master Notification not found');
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.get_list = (req,res,next)=>{
    Masternotifications.find()
       
        .exec()
        .then(data=>{
            res.status(200).json(data);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.update_notifications = (req,res,next)=>{
    // var roleData = req.body.role;
    Masternotifications.updateOne(
            { _id:req.params.notificationmasterID},  
            {
                $set:{
                    "templateType"    : req.body.templateType,
                    "templateName"    : req.body.templateName,
                    "subject"         : req.body.subject,
                    "content"         : req.body.content,				
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				console.log('data =========>>>',data);
                res.status(200).json("Master notifications Updated");
            }else{
                res.status(401).json("Master notifications Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
// Handle update contact info

// exports.update = function (req, res) {
//     Masternotifications.findById(req.params.notificationID, function (err, masternotifications) {
//             if (err){
//                 res.send(err);
   
//             masternotifications.templateType = req.body.templateType;
//             masternotifications.templateName = req.body.templateName;
//             masternotifications.subject      = req.body.subject;
//             masternotifications.content      = req.body.content;
            
//     // save the contact and check for errors
//     masternotifications.save(function (err) {
//                 if (err)
//                     res.json(err);
//                 res.json({
//                     message: 'master notifications Info updated',
//                     data: masternotifications
//                 });
//             });
//         }
//         });
//     };


//send Mail Notification -Rushikesh Salunkhe
exports.send_notifications = (req,res,next)=>{
    // console.log('req',req.body);
    const senderEmail = 'appstore@coffic.com';
    const senderEmailPwd = 'Coffic@123';

    let transporter = nodeMailer.createTransport({                
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: senderEmail,
            pass: senderEmailPwd
        }
    });
    main();
    async function main(){
        var userProfile = {};
        if(req.body.toUserId === "admin"){
            toEmail = "appstore@coffic.com"; 
            toMobileNumber = ""
        }else{
            // getProfileByUserId();
            userProfile = await getProfileByUserId(req.body.toUserId);
            if(userProfile && userProfile!== null & userProfile!==""){
                // console.log("userProfile=====>",userProfile);
                toEmail         = userProfile.emails[0].address;
                toMobileNumber  = userProfile.profile.mobileNumber;
                 
                // console.log("toEmail=====>",toEmail);

            }
        }
        // console.log("after mail=====>");
        // getTemplateDetails();
        const templateDetailsEmail = await getTemplateDetailsEmail(req.body.templateName, req.body.variables);
        const templateDetailsSMS = await getTemplateDetailsSMS(req.body.templateName, req.body.variables);
        // console.log("toEmail=====>",toEmail);
        // console.log("templateDetails = ",templateDetails);

        var mailOptions = {                
            from        : '"Coffic Admin" <'+senderEmail+'>', // sender address
            to          : toEmail , // list of receiver
            subject     : templateDetailsEmail.subject, // Subject line
            html        : templateDetailsEmail.content, // html body
        };
        console.log("mailOptions=====>",mailOptions);
        var SMSOptions = {                
           
            to          : toMobileNumber , // list of receiver
           
            html        : templateDetailsEmail.content, // html body
        };
        console.log("SMSOptions=====>",SMSOptions);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {                    
                console.log("send mail error",error);
                res.status(500).json({              
                    message: "Send Email Failed",
                });
            }
            if(info){
                res.status(200).json({              
                    message: "Mail Sent Successfully",
                });
            }
            res.render('index');
        });

        const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
		// const client = new plivo.Client('MANJFLZDG4MDEWNDBIND', 'NGExNzQ3ZjFmZDM4ZmVmMjBjNmY4ZjM0M2VmMWIw'); 
		const sourceMobile = "+919923393733";
		var text = SMSOptions.html
        console.log("text======>",text);
        console.log("SMSOptions.toMobileNumber======>",SMSOptions.toMobileNumber);
		
		client.messages.create(
			src=sourceMobile,
			dst=SMSOptions.toMobileNumber,
			text=text
		).then((result)=> {
			// console.log("src = ",src," | DST = ", dst, " | result = ", result);
			// return res.status(200).json("OTP "+OTP+" Sent Successfully ");
			return res.status(200).json({
				"message" : 'SMS-SEND-SUCCESSFULLY',
				
			});			
		})
		.catch(otpError=>{
			return res.status(501).json({
				message: "Some Error Occurred in SMS Send Function",
				error: otpError
			});        
		}); 

    }
    
}


//get getEmailByUserId - Rushikesh Salunkhe
function getProfileByUserId(toUserId){
    return new Promise(function(resolve,reject){
        // console.log("getProfileByUserId",toUserId);
    User
    .findOne({"_id":toUserId})
    .exec()
        .then(data=>{
            // console.log('data',data);
            resolve(data);          
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

        });
}

function getTemplateDetailsEmail(templateName,variables){
    console.log("Inside getTemplateDetails templateName = ",templateName);
    console.log("Inside getTemplateDetails variables = ",variables);
    return new Promise(function(resolve,reject){
        console.log("2. Inside promise = ",templateName);

        Masternotifications
        .findOne({"templateName":templateName, "templateType":'Email'})
        .exec()
        .then(NotificationData=>{
                    console.log('serverside NotificationData: ', NotificationData);
                    if(NotificationData){
                        var content = NotificationData.content;
                        var wordsplit = [];
                        if(content.indexOf('[') > -1 ){
                            wordsplit = content.split('[');
                        }

                        var tokens = [];
                        var n = 0;
                        for(i=0;i<wordsplit.length;i++){
                            if(wordsplit[i].indexOf(']') > -1 ){
                                tokensArr = wordsplit[i].split(']');
                                tokens[n] = tokensArr[0];
                                n++;
                            }
                        }
                        var numOfVar = Object.keys(variables).length;

                        for(i=0; i<numOfVar; i++){
                            // var tokVar = tokens[i].substr(1,tokens[i].length-2);
                            content = content.replace(tokens[i],variables[tokens[i]]);
                        }
                        content = content.split("[").join("'");
                        content = content.split("]").join("'");
                        console.log("content = ",content);
                        var tData={
                            content:content,
                            subject:NotificationData.subject
                        }
                        resolve(tData);          
                    }//NotificationData
                    
            })
            .catch(err =>{
                console.log(err);
                err.status(500).json({
                    error: err
                });
            });
        }); 
    }
    function getTemplateDetailsSMS(templateName,variables){
        console.log("Inside getTemplateDetails templateName = ",templateName);
        console.log("Inside getTemplateDetails variables = ",variables);
        return new Promise(function(resolve,reject){
            console.log("2. Inside promise = ",templateName);
    
            Masternotifications
            .findOne({"templateName":templateName, "templateType":'SMS'})
            .exec()
            .then(NotificationData=>{
                        console.log('serverside NotificationData: ', NotificationData);
                        if(NotificationData){
                            var content = NotificationData.content;
                            var wordsplit = [];
                            if(content.indexOf('[') > -1 ){
                                wordsplit = content.split('[');
                            }
    
                            var tokens = [];
                            var n = 0;
                            for(i=0;i<wordsplit.length;i++){
                                if(wordsplit[i].indexOf(']') > -1 ){
                                    tokensArr = wordsplit[i].split(']');
                                    tokens[n] = tokensArr[0];
                                    n++;
                                }
                            }
                            var numOfVar = Object.keys(variables).length;
    
                            for(i=0; i<numOfVar; i++){
                                // var tokVar = tokens[i].substr(1,tokens[i].length-2);
                                content = content.replace(tokens[i],variables[tokens[i]]);
                            }
                            content = content.split("[").join("'");
                            content = content.split("]").join("'");
                            console.log("content = ",content);
                            var tData={
                                content:content,
                                subject:NotificationData.subject
                            }
                            resolve(tData);          
                        }//NotificationData
                        
                })
                .catch(err =>{
                    console.log(err);
                    err.status(500).json({
                        error: err
                    });
                });
            }); 
        }