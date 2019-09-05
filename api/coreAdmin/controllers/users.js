const mongoose		= require("mongoose");
const bcrypt		= require("bcrypt");
const jwt			= require("jsonwebtoken");
const plivo 		= require('plivo');
const User 			= require('../models/users');
var request 		= require('request-promise');
const WorkspaceDetails = require('../../coffic/models/workspaceDetails');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// exports.user_signupadmin = (req,res,next)=>{

// 	console.log('req',req)
// 	User.find()
// 		.exec()
// 		.then(user =>{				
// 				bcrypt.hash(req.body.pwd,10,(err,hash)=>{
// 					if(err){
// 						return res.status(500).json({
// 							error:err
// 						});
// 					}else{
// 						const OTP = getRandomInt(1000,9999);
// 						const user = new User({
// 							_id: new mongoose.Types.ObjectId(),
// 							createdAt		: new Date,
// 							services		: {
// 								password	:{
// 											bcrypt:hash
// 											},
// 							},
// 							mobileNumber  	: req.body.mobileNumber,
// 							emails			: [
// 									{
// 										address  : req.body.emailId,
// 										verified : true 
// 									}
// 							],
// 							profile		:{
// 										firstName     : req.body.firstName,
// 										lastName      : req.body.lastName,
// 										fullName      : req.body.firstName+' '+req.body.lastName,
// 										emailId       : req.body.emailId,
// 										mobileNumber  : req.body.mobileNumber,
// 										status		  : req.body.status
// 							},
// 							roles 		   : (req.body.roles),
							
// 			            });	
// 						user.save()
// 						.then(newUser =>{
// 							if(newUser){
// 								console.log('New USER = ',newUser);
// 								// console.log('Plivo Client = ',mobileNumber);
// 								const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
// 								const sourceMobile = "+919923393733";
// 								var text = "Dear User, "+'\n'+"To verify your account on Coffic, Enter this verification code : \n"+OTP; 
				
// 								client.messages.create(
// 									src=sourceMobile,
// 									dst=req.body.mobileNumber,
// 									text=text
// 								).then((result)=> {
// 									console.log("src = ",src," | DST = ", dst, " | result = ", result);
// 									// return res.status(200).json("OTP "+OTP+" Sent Successfully ");
// 									return res.status(200).json({
// 										"message" : 'NEW-USER-CREATED',
// 										"user_id" : newUser._id,
// 										"otp"     : OTP,
// 									});			
// 								})
// 								.catch(otpError=>{
// 									return res.status(501).json({
// 										message: "Some Error Occurred in OTP Send Function",
// 										error: otpError
// 									});        
// 								});       
// 							}
							
// 						})	
// 							.catch(err =>{
// 								console.log(err);
// 								res.status(500).json({
// 									error: err
// 								});
// 							});
// 					}			
// 				});
			
// 		})
// 		.catch(err =>{
// 			console.log(err);
// 			res.status(500).json({
// 				error: err
// 			});
// 		});
// };

exports.user_checkUser = (req,res,next)=>{
	var emailData = req.body.emailId;
	
	User.findOne({'profile.emailId':emailData})
	.exec()
	.then(user=>{
		if(user){
			return res.status(200).json({
				message: 'Email Id already exists'
			});
		}else{
			return res.status(200).json({
				message: 'New User'
			});
		}
	})
	.catch(err=>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	})
}

exports.user_signupadmin = (req,res,next)=>{
	console.log('req',req)
	User
	.findOne({'emails.address': req.body.emailId})
	.exec()
	.then(user=>{
		console.log("user",user)
		if(user){
			return res.status(200).json({
				"message" : 'USER_ALREADY_EXIST',
				
			
			});	
		}else{
			bcrypt.hash(req.body.pwd,10,(err,hash)=>{
					if(err){
						return res.status(500).json({
							error:err
						});
					}else{
						const OTP = getRandomInt(1000,9999);
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							createdAt		: new Date,
							services		: {
								password	:{
											bcrypt:hash
											},
							},
							mobileNumber  	: req.body.mobileNumber,
							emails			: [
									{
										address  : req.body.emailId,
										verified : true 
									}
							],
							profile		:{
										firstName     : req.body.firstName,
										lastName      : req.body.lastName,
										fullName      : req.body.firstName+' '+req.body.lastName,
										emailId       : req.body.emailId,
										mobileNumber  : req.body.mobileNumber,
										status		  : req.body.status
							},
							roles 		   : (req.body.roles),
							
			            });	
						user.save()
						.then(newUser =>{
							if(newUser){
					
								console.log('New USER = ',newUser);
								request({
									
									"method"    : "POST",
									"url"       : "http://localhost:5012/send-email",
									"body"      : 	{

														"email"     : newUser.emailId,
														"subject"   : 'Verify your Account',
														"text"      : "WOW Its done",
														// "mail"      : "Hello"+newUser.profile.firstName+','+'\n'+"Your account verifcation code is"+OTP,
														"mail"      : 'Dear '+newUser.firstName+','+'\n'+"\n <br><br>Your account verification code is "+"<b>"+newUser.emailOTP+"</b>"+'\n'+'\n'+' </b><br><br>\nRegards,<br>Team Coffic',

													},
									"json"      : true,
									"headers"   : {
													"User-Agent": "Test App"
												}
								})
							
								.then((sentemail)=>{
									// console.log("call to api");
									res.header("Access-Control-Allow-Origin","*");
						
									res.status(200).json({message:"Mail Sent successfully"});
								})
								.catch((err) =>{
									console.log("call to api",err);
									res.status(500).json({
										error: err
									});
								});    
								
								
								console.log('Plivo Client = ',newUser.mobileNumber);

								const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz'); // iAssureIT
								// const client = new plivo.Client('MANJFLZDG4MDEWNDBIND', 'NGExNzQ3ZjFmZDM4ZmVmMjBjNmY4ZjM0M2VmMWIw');   // Vowels LLP
								const sourceMobile = "+919923393733";
								var text = 'Dear Vendor ,'+"\nYour account has been created successfully on Coffic. Your Login details are as follows:\nEmail ID  :"+newUser.profile.emailId+"Default Password:test123"+'\n'+'\n'+'\nRegards,\nTeam Coffic';
								
								client.messages.create(
									src=sourceMobile,
									dst=req.body.mobileNumber,

									text=text
								).then((result)=> {
									// console.log("src = ",src," | DST = ", dst, " | result = ", result);
									// return res.status(200).json("OTP "+OTP+" Sent Successfully ");
									return res.status(200).json({
										"message" : 'OTP-SEND-SUCCESSFULLY',
										"otp"     : newUser.emailOTP,
									});			
								})
								.catch(otpError=>{
									return res.status(501).json({
										message: "Some Error Occurred in OTP Send Function",
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
				});

		}
	})

		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.user_otpverification = (req,res,next)=>{

	console.log('req',req)
	
	var newUser = {
					
		emailOTP		: req.body.emailOTP,
		mobileOTP		: req.body.mobileOTP,
		firstName		: req.body.firstName,
		emailId       	: req.body.emailId,
		mobileNumber  	: req.body.mobileNumber,
		
	};	
	
	if(newUser){
					
		console.log('New USER = ',newUser);
		request({
			
			"method"    : "POST",
			"url"       : "http://localhost:5012/send-email",
			"body"      : 	{
								"email"     : newUser.emailId,
								"subject"   : 'Verify your Account',
								"text"      : "WOW Its done",
								// "mail"      : "Hello"+newUser.profile.firstName+','+'\n'+"Your account verifcation code is"+OTP,
								"mail"      : 'Dear '+newUser.firstName+','+'\n'+"\n <br><br>Your account verification code is "+"<b>"+newUser.emailOTP+"</b>"+'\n'+'\n'+' </b><br><br>\nRegards,<br>Team Coffic',
							},
			"json"      : true,
			"headers"   : {
							"User-Agent": "Test App"
						}
		})
	
		.then((sentemail)=>{
			// console.log("call to api");
			res.header("Access-Control-Allow-Origin","*");

			res.status(200).json({message:"Mail Sent successfully"});
		})
		.catch((err) =>{
			console.log("call to api",err);
			res.status(500).json({
				error: err
			});
		});    
		
		
		console.log('Plivo Client = ',newUser.mobileNumber);
		const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
		// const client = new plivo.Client('MANJFLZDG4MDEWNDBIND', 'NGExNzQ3ZjFmZDM4ZmVmMjBjNmY4ZjM0M2VmMWIw');   // Vowels LLP

		const sourceMobile = "+919923393733";
		var text = "Dear "+newUser.firstName+','+'\n'+"Your account verification code is "+newUser.mobileOTP+"\nRegards,\nTeam Coffic"
		
		client.messages.create(
			src=sourceMobile,
			dst=req.body.mobileNumber,
			text=text
		).then((result)=> {
			// console.log("src = ",src," | DST = ", dst, " | result = ", result);
			// return res.status(200).json("OTP "+OTP+" Sent Successfully ");
			return res.status(200).json({
				"message" : 'OTP-SEND-SUCCESSFULLY',
				"otp"     : newUser.emailOTP,
			});			
		})
		.catch(otpError=>{
			return res.status(501).json({
				message: "Some Error Occurred in OTP Send Function",
				error: otpError
			});        
		}); 
	}
	
	};


exports.user_signupmobile = (req,res,next)=>{
	var emailIddata = req.body.emailId;
    
    console.log('emailIddata ',req.body.emailId);
	User.findOne({'profile.emailId':emailIddata})
	.exec()
	.then(user =>{		
		if(user){
			return res.status(200).json({
				message: 'Email Id already exists'
			});
		}else{		
			bcrypt.hash(req.body.pwd,10,(err,hash)=>{
				if(err){
					return res.status(500).json({
						error:err
					});
				}else{
					// const OTP = getRandomInt(1000,9999);
					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						createdAt		: new Date,
						services		: {
							password	:{
										bcrypt:hash
										},
						},
						mobileNumber  	: req.body.mobileNumber,
						emails			: [
								{
									address  : req.body.emailId,
									verified : true 
								}
						],
						profile		:{
									firstName     : req.body.firstName,
									lastName      : req.body.lastName,
									fullName      : req.body.firstName+' '+req.body.lastName,
									emailId       : req.body.emailId,
									mobileNumber  : req.body.mobileNumber,
									status		  : req.body.status,
								

						},
						roles 		   : (req.body.roles),
						
					});	
					
					user.save()
					.then(newUser =>{
						if(newUser){
							return res.status(200).json({
										"message" : 'NEW-USER-CREATED',
										"user_id" : newUser._id,
										
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
			});
		}
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});

};
exports.user_createVendor = (req,res,next)=>{
	User.find()
		.exec()
		.then(user =>{				
				bcrypt.hash(req.body.pwd,10,(err,hash)=>{
					if(err){
						return res.status(500).json({
							error:err
						});
					}else{
						const OTP = getRandomInt(1000,9999);
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							createdAt		: new Date,
							services		: {
								password	:{
											bcrypt:hash
											},
							},
							mobileNumber  	: req.body.mobileNumber,
							emails			: [
									{
										address  : req.body.emailId,
										verified : true 
									}
							],
							profile		:{
										firstName     : req.body.firstName,
										lastName      : req.body.lastName,
										fullName      : req.body.firstName+' '+req.body.lastName,
										emailId       : req.body.emailId,
										mobileNumber  : req.body.mobileNumber,
										status		  : req.body.status,
										
							},
							roles 		   : (req.body.roles),
							
			            });	
						user.save()

						.then(newUser =>{
							if(newUser){
								console.log('New USER = ',newUser);
								// console.log('Plivo Client = ',mobileNumber);
								const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
								// const client = new plivo.Client('MANJFLZDG4MDEWNDBIND', 'NGExNzQ3ZjFmZDM4ZmVmMjBjNmY4ZjM0M2VmMWIw');   // Vowels LLP

								const sourceMobile = "+919923393733";
								var text = "Dear User, "+'\n'+"To verify your account on Coffic, Enter this verification code : \n"+OTP; 
				
								client.messages.create(
									src=sourceMobile,
									dst=req.body.mobileNumber,
									text=text
								).then((result)=> {
									console.log("src = ",src," | DST = ", dst, " | result = ", result);
									// return res.status(200).json("OTP "+OTP+" Sent Successfully ");
									return res.status(200).json({
										"message" : 'NEW-USER-CREATED',
										"user_id" : newUser._id,
										"otp"     : OTP,
									});			

								})
								.catch(otpError=>{
									return res.status(501).json({
										message: "Some Error Occurred in OTP Send Function",
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
				});
			
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};


exports.confirmOTP = (req,res,next)=>{
	User.findOne({'mobileNumber':req.body.mobileNumber})
		.exec()
		.then((user)=>{
	console.log("in confirm otp---->",user.profile.otp,req.body.mobileotp,req.body.emailotp);

			if(user){
				var userOtp = user.profile.otp;
				var emailOTP = user.profile.emailOTP;
				if(userOtp==req.body.mobileotp && emailOTP== req.body.emailotp){
					return res.status(200).json({"message" : 'Matched'});
				}else{
					return res.status(500).json({"message" : 'Not Matched'});
				}

			}

		})
		.catch()

};


exports.users_verify_mobileOTP = (req,res,next)=>{
	console.log("req.body.mobile-Number",req.body.mobileNumber);
	
	User.find({'mobileNumber':req.body.mobileNumber})
		.limit(1)
		.exec()
		.then(user =>{
		
			if(user.length > 0){

				bcrypt.hash(req.body.pwd,10,(err,hash)=>{
					if(err){
						return res.status(500).json({
							error:err
						});
					}else{

						const OTP = getRandomInt(1000,9999);
						const emailOTP = getRandomInt(100000,999999);
						User.updateOne(
							{ _id: user[0]._id},  
							{
								$set:{
									"otp" : OTP,
									"emailOTP": emailOTP
								}
							})
						.exec()
						.then( data =>{
							if(data){
								console.log('USER AFTER OTP GENERATED = ',data);
		                        const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
		                        const sourceMobile = "+919923393733";
		                        var text = "Dear User, "+'\n'+"To verify your account on Coffic, Enter this verification code : \n"+"Mobile OTP : " +OTP+ "Email OTP: " +emailOTP; 
		                        client.messages.create(
									src=sourceMobile,
									dst=req.body.mobileNumber,
									text=text
								).then((result)=> {
									console.log("src = ",src," | DST = ", dst, " | result = ", result);
		                            return res.status(200).json({
		                                "message" : 'MOBILE-NUMBER-EXISTS',
		                                "user_id" : user[0]._id,
		                                "otp"     : OTP,
		                                "emailOTP" :emailOTP,
		                                "count"   : user.length,
		                            });			
		                        })
		                        
								.catch(otpError=>{
									return res.status(500).json({
		                                messge: "Some issue happened in OTP Send Function",
										error: otpError
									});        
								});       
							}
						})
						.catch(err =>{
							console.log(err);
							res.status(500).json({
		                        message : "Some problem occured in User Update for OTP",
								error: err
							});
						});		

				}});



			}else{
				bcrypt.hash(req.body.pwd,10,(err,hash)=>{
					if(err){
						return res.status(500).json({
							error:err
						});
					}else{
		                const OTP = getRandomInt(1000,9999);
		                const emailOTP = getRandomInt(100000,999999);
		                const user = new User({
		                    _id: new mongoose.Types.ObjectId(),
									createdAt		: new Date,
									services		: {
										password	:{
													bcrypt:hash
													},
									},
									// countryCode 	: req.body.countryCode,
									mobileNumber  	: req.body.mobileNumber,
									emails			: [
											{
												address  : req.body.emailId,
												verified : true 
											}
									],
									profile		:{
												firstName     : req.body.firstName,
												lastName      : req.body.lastName,
												fullName      : req.body.firstName+' '+req.body.lastName,
												emailId       : req.body.emailId,
												mobileNumber  : req.body.mobileNumber,
												// countryCode   : req.body.countryCode,
												status		  : req.body.status,
												otp 		  : OTP,
												emailOTP      : emailOTP,
									},
									roles 		   : [req.body.roles],
		                    status  : req.body.status,
		                });
		                user.save()
		                .then(newUser =>{
		                    if(newUser){
		                        console.log('New USER ======> ',newUser);
		                        // console.log('Plivo Client = ',mobileNumber);
		                        const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
		                        const sourceMobile = "+919923393733";
		                        var text = "Dear User, "+'\n'+"To verify your account on Coffic, Enter this verification code : \n"+OTP; 
		        
		                        client.messages.create(
		                            src=sourceMobile,
		                            dst=req.body.mobileNumber,
		                            text=text
		                        ).then((result)=> {
		                            console.log("src = ",src," | DST = ", dst, " | result = ", result);
		                            // return res.status(200).json("OTP "+OTP+" Sent Successfully ");
		                            return res.status(200).json({
		                                "message" : 'NEW-USER-CREATED',
		                                "user_id" : newUser._id,
		                                "otp"     : OTP,
		                                "emailOTP" : emailOTP, 
		                            });			
		                        })
		                        .catch(otpError=>{
		                            return res.status(501).json({
		                                message: "Some Error Occurred in OTP Send Function",
		                                error: otpError
		                            });        
		                        });       
		                    }
		                    
		                })	
						

				}});


			}






		})
		.catch(err =>{
			console.log(err);
			res.status(200).json({
				message:"MOBILE-NUMBER-NOT-FOUND", 
				error: err,
			});
		});
};




exports.update_user_resetpassword = (req,res,next)=>{
	// bcrypt.hash(req.body.pwd,10,(err,hash)=>{
    // User.updateOne(
    //         { _id:req.body.userID},  
    //         {
    //             $set:{
				
	// 				services		: {
	// 									password:{
	// 											bcrypt:hash
	// 											},
	// 				},

					
	// 				}			
				
    //         }
    //     )
    //     .exec()
    //     .then(data=>{
    //         console.log('data ',data);
    //         if(data.nModified == 1){
	// 			// console.log('data =========>>>',data);
    //             res.status(200).json("Password  Updated");
    //         }else{
    //             res.status(401).json("Password  Not Found");
    //         }
    //     })
    //     .catch(err =>{
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
	// 	});
	// });

	console.log('req.body=====> ',req.body);

	User.findOne({"profile.emailId" : req.body.emailId })
		.exec()
		
		.then(user=>{
				console.log('user ',user);

		if(user){

				bcrypt.hash(req.body.pwd,10,(err,hash)=>{
					User.updateOne(
						{_id:user._id}, 
						{
							$set:{
								services: {
											password: 	{
															bcrypt:hash
														},
								},
							}
						}
					)
			.exec()
			.then(data=>{
				console.log('data ',data);
				if(data.nModified == 1){
					res.status(200).json("Password Updated");
				}else{
					res.status(401).json("Password Not Found");
				}
			})
			.catch(err =>{
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
			});
		}else{
			res.status(404).json("User Not Found");
		}
	})
	.catch(err=>{
	// console.log('update user status error ',err);
	res.status(500).json({
	error:err
	});
});

}

// exports.users_password = (req,res,next)=>{
// 	console.log("req.body.mobNumber",req.body.mobNumber);
// 	User.findOne({mobileNumber:req.body.mobNumber}).count()
// 	// User.find({mobileNumber:req.body.mobNumber}).count()

// 		.exec()
// 		.then(count =>{
// 			if(count > 0){

			


// 				res.status(409).json({
// 					message: 'MOBILE-NUMBER-EXISTS'
// 				});
// 			}else{
// 				res.status(505).json({
// 					error: "MOBILE-NUMBER-NOT-FOUND"
// 				});
// 			}
		
// 		})
// 		.catch(err =>{
// 			console.log(err);
// 			res.status(500).json({
// 				message:"MOBILE-NUMBER-NOT-FOUND500", 
// 				error: err,
// 			});
// 		});
// };




// exports.user_login = (req,res,next)=>{
// 	User.findOne({emails:{$elemMatch:{address:req.body.email}}})
// 		.exec()
// 		.then(user => {
			
// 			if(user){
// 				console.log("PWD===>",user);
// 			var pwd = user.services.password.bcrypt;
// 			}
// 			if(pwd){
// 				console.log("PWD===>");
// 				bcrypt.compare(req.body.pwd,pwd,(err,result)=>{
// 					if(err){
// 						return res.status(401).json({
// 							message: 'Auth failed'
// 						});		
// 					}
// 					if(result){
// 						const token = jwt.sign({
// 							email 	: req.body.email,
// 							userId	:  user._id,
// 						},global.JWT_KEY,
// 						{
// 							expiresIn: "1h"
// 						}
// 						);
// 						res.header("Access-Control-Allow-Origin","*");

// 						return res.status(200).json({
// 							message: 'Auth successful',
// 							token: token
// 						});	
// 					}
// 					return res.status(401).json({
// 						message: 'Auth failed'
// 					});
// 				})
// 			}
// 		})
// 		.catch(err =>{
// 			console.log(err);
// 			res.status(500).json({
// 				error: err
// 			});
// 		});
// };
exports.user_loginwithadmin = (req,res,next)=>{
    console.log('login',req.body);
    User.findOne({emails:{$elemMatch:{address:req.body.email}},roles: "Admin",emailId:req.body.emailId})
        .exec()
        .then(user => {
            if(user){
                var pwd = user.services.password.bcrypt;
                if(pwd){
					console.log('PWD');
                    bcrypt.compare(req.body.password,pwd,(err,result)=>{
                        if(err){
                            console.log('password err ',err);
                            return res.status(401).json({
                                message: 'Bcrypt Auth failed'
                            });     
                        }
                        if(result){
                            console.log('result ',result);
                            const token = jwt.sign({
                                email   : req.body.email,
                                // userId   : mongoose.Types.ObjectId(user._id) ,
                                userId  : user._id ,
                            },global.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                            );
                            console.log('login faild');
                            res.header("Access-Control-Allow-Origin","*");
                            return res.status(200).json({
                                message             : 'Auth successful',
                                token               : token,
                                user_ID             : user._id,
								// userFullName       	: user.profile.fullName,
								useremailId			: user.profile.emailId,						
								roles 				: user.roles,
                                // userProfileImg      : user.profile.userProfile,
                            }); 
                        }
                        console.log({message:"Neither err nor result"});
                        return res.status(401).json({
                            message: 'Error and Result Auth failed'
                        });
                    })
                }else{
                    res.status(409).status({message:"Password not found"}); 
                }
            }else{
				res.status(200).json({
					message: 'User not found'
				});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.user_loginwithvendor = (req,res,next)=>{
    console.log('login',req.body);
    User.findOne({emails:{$elemMatch:{address:req.body.email}},roles: "vendor",emailId:req.body.emailId})
        .exec()
        .then(user => {
            if(user){
                var pwd = user.services.password.bcrypt;
                if(pwd){
					console.log('PWD');
                    bcrypt.compare(req.body.password,pwd,(err,result)=>{
                        if(err){
                            console.log('password err ',err);
                            return res.status(401).json({
                                message: 'Bcrypt Auth failed'
                            });     
                        }
                        if(result){
                            console.log('result ',result);
                            const token = jwt.sign({
                                email   : req.body.email,
                                // userId   : mongoose.Types.ObjectId(user._id) ,
                                userId  : user._id ,
                            },global.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                            );
                            console.log('login faild');
                            res.header("Access-Control-Allow-Origin","*");
                            return res.status(200).json({
                                message             : 'Auth successful',
                                token               : token,
                                user_ID             : user._id,
								// userFullName       	: user.profile.fullName,
								useremailId			: user.profile.emailId,						
								roles 				: user.roles,
                                // userProfileImg      : user.profile.userProfile,
                            }); 
                        }
                        console.log({message:"Neither err nor result"});
                        return res.status(401).json({
                            message: 'Error and Result Auth failed'
                        });
                    })
                }else{
                    res.status(409).status({message:"Password not found"}); 
                }
            }else{
				res.status(200).json({
					message: 'User not found'
				});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.user_loginwithuser = (req,res,next)=>{
    console.log('login',req.body);
    User.findOne({emails:{$elemMatch:{address:req.body.email}},roles: "user",emailId:req.body.emailId})
        .exec()
        .then(user => {
			
            if(user){
				
                var pwd = user.services.password.bcrypt;
                if(pwd){
					console.log('PWD');
                    bcrypt.compare(req.body.password,pwd,(err,result)=>{
                        if(err){
                            console.log('password err ',err);
                            return res.status(401).json({
                                message: 'Bcrypt Auth failed'
                            });     
                        }
                        
                        if(result){
                            console.log('result ',result);
                            const token = jwt.sign({
                                email   : req.body.email,
                                // userId   : mongoose.Types.ObjectId(user._id) ,
                                userId  : user._id ,
                            },global.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                            );
                            console.log('login faild');
                            res.header("Access-Control-Allow-Origin","*");
                            return res.status(200).json({
                                message             : 'Auth successful',
                                token               : token,
                                user_ID             : user._id,
								userFullName       	: user.profile.fullName,
								useremailId			: user.profile.emailId,						
								roles 				: user.roles,
                                // userProfileImg      : user.profile.userProfile,
                            }); 
                        }
                        console.log({message:"Neither err nor result"});
                        return res.status(401).json({
                            message: 'Error and Result Auth failed'
                        });
                    })
                }else{
                    res.status(409).status({message:"Password not found"}); 
                }
            }else{
				res.status(200).json({
					message: 'User not found'
				});
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.users_list = (req,res,next)=>{
	User.find({roles : {$ne : "admin"} })
		.exec()
		.then(users =>{
			console.log('users ',users);
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	
}
exports.id_cafeAdmin = (req,res,next)=>{
	WorkspaceDetails.findOne({"cafeAdmin":req.params.user_id })
		.exec()
		.then(users =>{
			console.log('users ',users);
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	
}
exports.users_directlist = (req,res,next)=>{
	User.find({roles : {$ne : "admin"} })
	.select("_id username roles createdAt profile.firstName profile.lastName profile.mobNumber profile.fullname profile.emailId profile.status")
		
	   .exec()
	   .then(users =>{
			console.log("List of Users", users);
		   var userdataarr = [];
		   users.map((data, index)=>{
			// console.log('data =======================>>>>>>>>>>>>',data);

			// console.log("data_id", data._id);
			   	userdataarr.push({
				   id            : data._id,
				   createdAt	 : data.createdAt,
				   username 	 : data.username,
				   mobNumber     : data.profile.mobNumber,
				   
				   firstName     : data.profile.firstName,
				   lastName      : data.profile.lastName,
				   fullName      : data.profile.name,
				   emailId       : data.profile.emailId,
				   status	     : data.profile.status,
				   roles 		 : data.roles
			   
				});	
		   })
		//    console.log('userdataarr ',userdataarrs);
		   if(userdataarr.length == users.length){
			res.status(200).json(userdataarr);
		   }
		   
	   })
	   .catch(err =>{
		   console.log(err);
		   res.status(500).json({
			   error: err
		   });
	   });
   
}
exports.users_fetch = (req,res,next)=>{
	User.find({roles : {$ne : "admin"} })
		.sort( { createdAt: -1 } ).skip(req.body.startRange).limit(req.body.limitRange)
		.select("_id username createdAt profile roles officeLocation")
		.exec()
		.then(users =>{			
			console.log("fetch users = ",users);
			var userdataarr = []
			users.map((data, index)=>{
				userdataarr.push({
					_id 		: data._id,
					createdAt	: data.createdAt,
					username	: data.username,					
					mobileNumber  : data.profile.mobileNumber,				
					firstName   : data.profile.firstName,
					lastName    : data.profile.lastName,
					fullName        : data.profile.fullName,
					emailId         : data.profile.emailId,
					status	        : data.profile.status,
					roles 	        : (data.roles).toString(),
					officeLocation 	: data.officeLocation,
				});	
			})
			console.log('userdataarr = ',userdataarr);
			res.status(200).json(userdataarr);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	
}

exports.user_details = (req, res, next)=>{
	var id = req.params.userID;
	User.findOne({_id:id})
		// .select("profile")
		.exec()
		.then(users =>{
			console.log(users.profile.fullName);
			res.status(200).json(users);
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}
// Handle delete contact
exports.delete_user = function (req, res,next) {
    User.deleteOne({
        _id: req.params.userID
    }, function (err) {
        if(err){
            return res.json({
                error: err
            });
        }
        res.json({
            status: "success",
            message: 'Users deleted'
        });
    });
};

exports.deleteall_user = function (req, res,next) {
    User.deleteMany({
       
    }, function (err) {
        if(err){
            return res.json({
                error: err
            });
        }
        res.json({
            status: "success",
            message: 'All Users deleted'
        });
    });
};



// exports.user_delete = (req,res,next)=>{
// 	User.findOne({_id:req.params.userID})
// 		.exec()
// 		.then(data=>{
// 			if(data){
// 				if(data.profile.status == 'Inactive'){
// 					User.deleteOne({_id:req.params.userID})
// 						.exec()
// 						.then(data=>{
// 							res.status(200).json("User Deleted");
// 						})
// 						.catch(err =>{
// 							console.log('user error ',err);
// 							res.status(500).json({
// 								error: err
// 							});
// 						});
// 				}else{
// 					res.status(200).json("Inactive users can only be Deleted");
// 				}
// 			}else{
// 				res.status(404).json("User Not found");
// 			}
// 		})
// 		.catch(err =>{
// 			console.log('user error ',err);
// 			res.status(500).json({
// 				error: err
// 			});
// 		});
// }

// exports.user_update = (req,res,next)=>{
	
// 	User.findOne({_id:req.body.userID})
// 		.exec()
// 		.then(user=>{
// 			if(user){
// 				console.log('user ======+>',user);
// 				User.updateOne(
// 					{_id:req.body.userID},
// 					{
// 						$set:{
// 							"profile.firstname"     : req.body.firstname,
// 							"profile.lastname"      : req.body.lastname,
// 							"profile.fullName"      : req.body.firstname+' '+req.body.lastname,
// 							"profile.mobNumber"     : req.body.mobNumber,
// 							"profile.status"		  : req.body.status,
// 						},
// 					}
// 				)
// 				.exec()
// 				.then(data=>{
// 					res.status(200).json("User Updated");
// 				})
// 				.catch(err =>{
// 					console.log('user error ',err);
// 					res.status(500).json({
// 						error: err
// 					});
// 				});
// 			}else{
// 				res.status(404).json("User Not Found");
// 			}
// 		})
// 		.catch(err=>{
// 			console.log('update user error ',err);
// 			res.status(500).json({
// 				error:err
// 			});
// 		});
// }



exports.update_user = (req,res,next)=>{
	// var roleData = req.body.role;
	console.log("req.params.userID",req.params.userID);
	console.log("req.BODY+++=======+>",req.body);

    User.updateOne(
            { _id:req.params.userID},  
            {
                $set:{
				
					"profile.firstName"     : req.body.firstName,
					"profile.lastName"      : req.body.lastName,
					"profile.fullName"      : req.body.firstName+' '+req.body.lastName,
					"profile.emailId"       : req.body.emailId,
					"profile.mobileNumber"  : req.body.mobileNumber,
					"mobileNumber"          : req.body.mobileNumber,
					
					"emails[0].address  "  	: req.body.emailId,
					// "roles" 				: (req.body.roles),

					// "officeLocation" 		: req.body.officeLocation,

			
                }
            }
        )
        .exec()
        .then(data=>{
            console.log('data ',data);
            if(data.nModified == 1){
				console.log('data =========>>>',data);
                res.status(200).json("User Updated");
            }else{
                res.status(401).json("User Not Found");
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_change_role = (req,res,next)=>{
	User.findOne({_id:req.params.userID})
		.exec()
		.then(user=>{
			if(user){
				if(req.params.rolestatus == 'assign'){
					User.updateOne(
						{_id:req.body.userID},
						{
							$push:{
								roles : req.body.role
							}
						}
					)
					.exec()
					.then(data=>{
						res.status(200).json("Role Assigned");
					})
					.catch(err =>{
						console.log('user error ',err);
						res.status(500).json({
							error: err
						});
					});
				}else if(req.params.rolestatus == 'remove'){
					User.updateOne(
						{_id:req.body.userID},
						{
							$pull:{
								roles : req.body.role
							}
						}
					)
					.exec()
					.then(data=>{
						res.status(200).json("Role Removed");
					})
					.catch(err =>{
						console.log('user error ',err);
						res.status(500).json({
							error: err
						});
					});
				}
				console.log('user ',user);
			}else{
				res.status(404).json("User Not Found");
			}
		})
		.catch(err=>{
			console.log('update user error ',err);
			res.status(500).json({
				error:err
			});
		});
}

//=============================




exports.account_status= (req,res,next)=>{

	User.updateOne(
		{'_id': req.body.userID },
		{
			$set:{
				"profile.status": req.body.status ,
			} //End of set
		}
	)
	.exec()
	.then( data =>{
		
		return res.status(200).json({
			"message" : 'Status-Updated',
		});		
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

exports.account_role_add= (req,res,next)=>{
	
	User.findOne({roles: req.body.roles})
		.exec()
		.then(data =>{
			if(data){
				return res.status(200).json({
					message: 'Role is already exists'
				});
			}else{
				User.updateOne(
					{'_id': req.body.userID },
					{
						$push:{
							"roles": req.body.roles ,
						} //End of set
					}
				)
	
				.exec()
				.then( data =>{
					if(data){
					return res.status(200).json({
						"message" : 'Roles-Updated',
						// "data"    : data
					});		
					}else{
						return res.status(404).json({
							"message" : 'Roles-Not-Updated',
						
						});	
					}
				})
			}
        })
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}


exports.account_role_remove= (req,res,next)=>{

	User.updateOne(
		{'_id': req.body.userID },
		{
			$pull:{
				"roles": req.body.roles ,
			} //End of set
		}
	)
	
	.exec()
	.then( data =>{
		if(data){
		return res.status(200).json({
			"message" : 'Roles-Deleted',
			"data"    : data
		});		
		}else{
			return res.status(200).json({
				"message" : 'Roles-Not-Deleted',
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


exports.user_search = (req,res,next)=>{
	// console.log("req.body.searchText",req.body.searchText);

	User.find(
		{$or:[
			{"profile.fullName"		:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.firstName"	:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.lastName"		:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.emailId"		:	{ "$regex": req.body.searchText, $options: "i"}},
			{"profile.mobileNumber"	:	{ "$regex": req.body.searchText, $options: "i"}},
			// {"roles"				:	{ "$regex": { $in: [req.body.searchText] }, $options: "i"}},
			{"roles"				:	{ $in: [req.body.searchText] }},
			{"profile.status"		:	{ "$regex": req.body.searchText, $options: "i"}},
		]},
		
	)
	.exec()
	.then( data =>{
		console.log('data ',data);
		if(data.length > 0){
			return res.status(200).json({
				"message" : 'Search-Successfull',
					"data": data
			});		
		}else{
			return res.status(404).json({
				"message" : 'No-Data-Available',		
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

exports.search_user_office = (req,res,next)=>{
	// console.log("req.body.searchText",req.body.searchText);

	User.find(
		{$or:[
			{"officeLocation"		:	{ "$regex": req.body.searchText, $options: "i"}},
			
		]},
		
	)
	.exec()
	.then( data =>{
		console.log('data ',data);
		if(data.length > 0){
			return res.status(200).json({
				"message" : 'Search-Successfull',
					"data": data
			});		
		}else{
			return res.status(404).json({
				"message" : 'No-Data-Available',		
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


exports.users_count = (req,res,next)=>{
	User.find().count()
	// .countDocuments()
	.exec()
	.then( data =>{
		console.log('data ',data);
		if(data){
			return res.status(200).json({
				"message" : 'Count',
				"data": data
			});		
		}else{
			return res.status(404).json({
				"message" : 'No-Data-Available',		
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



// =====================  Forgot Password ==============

exports.user_otpverification_forgotpassword = (req,res,next)=>{
	User.findOne({'mobileNumber':req.body.mobileNumber,'profile.emailId': req.body.emailId})
		.limit(1)
		.exec()
		.then(user =>{
	if(user){	
	
			var forgotuserotp = {
							
				emailOTP		: req.body.emailOTP,
				mobileOTP		: req.body.mobileOTP,
				emailId       	: req.body.emailId,
				mobileNumber  	: req.body.mobileNumber,
				
			};	
	
	
					
		console.log('New USER = ',forgotuserotp);
		request({
			
			"method"    : "POST",
			"url"       : "http://localhost:5012/send-email",
			"body"      : 	{
								"email"     : forgotuserotp.emailId,
								"subject"   : 'Verify your Account',
								"text"      : "WOW Its done",
								// "mail"      : "Hello"+forgotuserotp.profile.firstName+','+'\n'+"Your account verifcation code is"+OTP,
								"mail"      : 'Dear User,'+'\n'+"\n <br><br>Your account verification code is "+"<b>"+forgotuserotp.emailOTP+"</b>"+'\n'+'\n'+' </b><br><br>\nRegards,<br>Team Coffic',
							},
			"json"      : true,
			"headers"   : {
							"forgotuserotp-Agent": "Test App"
						}
		})
	
		.then((sentemail)=>{
			// console.log("call to api");
			res.header("Access-Control-Allow-Origin","*");

			res.status(200).json({message:"Mail Sent successfully"});
		})
		.catch((err) =>{
			console.log("call to api",err);
			res.status(500).json({
				message:"EMAIL-ID-NOT-FOUND", 
				error: err
			});
		});    
		
		
		// console.log('Plivo Client = ',forgotuserotp.mobileNumber);
		const client = new plivo.Client('MAMZU2MWNHNGYWY2I2MZ', 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz');
		// const client = new plivo.Client('MANJFLZDG4MDEWNDBIND', 'NGExNzQ3ZjFmZDM4ZmVmMjBjNmY4ZjM0M2VmMWIw'); 
		const sourceMobile = "+919923393733";
		var text = "Dear User,"+'\n'+"Your account verification code is "+forgotuserotp.mobileOTP+"\nRegards,\nTeam Coffic"
		
		client.messages.create(
			src=sourceMobile,
			dst=req.body.mobileNumber,
			text=text
		).then((result)=> {
			// console.log("src = ",src," | DST = ", dst, " | result = ", result);
			// return res.status(200).json("OTP "+OTP+" Sent Successfully ");
			return res.status(200).json({
				"message" : 'OTP-SEND-SUCCESSFULLY',
				"otp"     : forgotuserotp.emailOTP,
			});			
		})
		.catch(otpError=>{
			return res.status(501).json({
				message: "Some Error Occurred in OTP Send Function",
				error: otpError
			});        
		}); 
			}else{
				res.status(200).json({
					message:"MOBILE-NUMBER-OR-EMAILID-NOT-FOUND", 
					error: err,
				});
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(200).json({
				message:"MOBILE-NUMBER-OR-EMAILID-NOT-FOUND", 
				error: err,
			});
		});
	};


exports.forgot_pwd = (req,res,next)=>{

	User.findOne({emails:{$elemMatch:{address:req.body.emailId}}})
        .exec()
        .then(user => {
            if(user){
            	bcrypt.hash(req.body.pwd,10,(err,hash)=>{
				    User.updateOne(
				            { _id:user._id},  
				            {
				                $set:{								
									services		: {
														password:{
																bcrypt:hash
																},
									},									
									}			
								
				            }
				        )
				        .exec()
				        .then(data=>{
				            // console.log('data ',data);
				            if(data.nModified == 1){
								// console.log('data =========>>>',data);
				                res.status(200).json("Password  Updated");
				            }else{
				                res.status(401).json("Password  Not Found");
				            }
				        })
				        .catch(err =>{
				            console.log(err);
				            res.status(500).json({
				                error: err
				            });
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
