const mongoose	= require("mongoose");
const ObjectID  = require("mongodb").ObjectID;

const SeatBooking 		=	require("../models/seatBooking");
const MenuOrder			=   require("../models/menuOrders");
const User              =   require('../../coreAdmin/models/users');

function getMenuOrder(data){
    return new Promise(function(resolve,reject){
        MenuOrder.aggregate(
        				[
        					{
        						$match : {
        							"workSpace_id" : data.workSpace_id,
        							"date"			: data.date
        						}
        					},
        					{
        						$group : {
        							_id 		: null,
	        						"amount"	: {"$sum" : "$price"}
        						}
        					}
        				]
        		)
                .exec()
                .then(menuOrder=>{
                	if(menuOrder.length > 0){
	                    resolve(menuOrder[0].amount);
                	}else{
                		resolve(0);
                	}
                })
                .catch(err=>{
                    reject(err);
                  });
            });
}

function getuserDetails(user_id){
	console.log("user_id",user_id);
    return new Promise(function(resolve,reject){
        User.findOne({"_id": new ObjectID(user_id)})
                        .exec()
                        .then(data=>{
                        	console.log("data ",data);
                            resolve(data);
                        })
                        .catch(err=>{
                            reject(err);
                  });
            });
}

exports.vendor_monthly = (req,res,next)=>{
	// SeatBooking .find({"workSpace_id": req.params.workspace_ID}
	SeatBooking .aggregate(
							[
								{
									$match : {
										"workSpace_id"  : req.params.workspace_ID,
										"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate}
									}
								},
								{
									$group : {
										"_id"			: { 
																"date" 			: "$date",
																"workSpace_id"	: "$workSpace_id",
																"user_id"		: "$user_id"
														  },
										"count"			: { "$sum" : 1},
									}
								},
								{
									$project : {
										"workSpace_id"	: "$_id.workSpace_id",
										"date"			: "$_id.date",
										"user_id"		: "$_id.user_id",
										"checkIn"		: "$count",
										"_id"			: 0
									}
								},
								{
									$group : {
												"_id"		: {
																"workSpace_id"	: "$workSpace_id",
																"date"			: "$date",
																// "check-Ins"		: "$check-Ins",
															  },
												"check-Ins"	: { "$sum" : "$checkIn"}
									}
								},
								{
									$project : {
													"workSpace_id"	: "$_id.workSpace_id",
													"date"			: "$_id.date",
													"check_Ins"		: "$check-Ins",
													"_id"			: 0,
												}				
								}
							]
				)
				.exec()
				.then(seatBooking=>{
					getData();
					async function getData(){
						var returnData = [];
						for(j = 0 ; j < seatBooking.length;j++){
							var amount = await getMenuOrder(seatBooking[j]);
							returnData.push({
								"workSpace_id" 		: seatBooking[j].workSpace_id,
								"date"				: seatBooking[j].date,
								"check-Ins"			: seatBooking[j].check_Ins,
								"amount"			: amount,
							});
						}
						if( j >= seatBooking.length){
							res.status(200).json(returnData);		
						}
					}
					// res.status(200).json(seatBooking);
				})
				.catch(err=>{
					res.status(200).json({error:err});
				});

}

// exports.vendor_monthly = (req,res,next)=>{
// 	// SeatBooking .find({"workSpace_id": req.params.workspace_ID}
// 	SeatBooking .aggregate(
// 							[
// 								{
// 									$match : {
// 										"workSpace_id"  : req.params.workspace_ID,
// 									}
// 								},
// 								{
// 									$group : {
// 										"_id"			: { 
// 																"date" 			: "$date",
// 																"workSpace_id"	: "$workSpace_id",
// 																"user_id"		: "$user_id"
// 														  },
// 									}
// 								},
// 								{
// 									$project : {
// 										"workSpace_id"	: "$_id.workSpace_id",
// 										"date"			: "$_id.date",
// 										"user_id"		: "$_id.user_id",
// 										"checkIn"		: "$count",
// 										"_id"			: 0
// 									}
// 								},
// 								{
// 									$group : {
// 												"_id"		: {
// 																"workSpace_id"	: "$workSpace_id",
// 																"date"			: "$date",
// 																// "check-Ins"		: "$check-Ins",
// 															  },
// 												"check-Ins"	: { "$sum" : "$checkIn"}
// 									}
// 								},
// 								{
// 									$project : {
// 													"workSpace_id"	: "$_id.workSpace_id",
// 													"date"			: "$_id.date",
// 													"check_Ins"		: "$check-Ins",
// 													"_id"			: 0,
// 												}				
// 								}
// 							]
// 				)
// 				.exec()
// 				.then(seatBooking=>{
// 					getData();
// 					async function getData(){
// 						var returnData = [];
// 						for(j = 0 ; j < seatBooking.length;j++){
// 							var amount = await getMenuOrder(seatBooking[j]);
// 							returnData.push({
// 								"workSpace_id" 		: seatBooking[j].workSpace_id,
// 								"date"				: seatBooking[j].date,
// 								"check-Ins"			: seatBooking[j].check_Ins,
// 								"amount"			: amount,
// 							});
// 						}
// 						if( j >= seatBooking.length){
// 							res.status(200).json(returnData);		
// 						}
// 					}
// 					// res.status(200).json(seatBooking);
// 				})
// 				.catch(err=>{
// 					res.status(200).json({error:err});
// 				});

// }
exports.vendor_dailycheckins = (req,res,next)=>{
	SeatBooking .aggregate(
							[
								{
									$match : {
										"workSpace_id"  : req.params.workspace_ID,

									}
								},
								
								{
									$project : {
													"workSpace_id"	: "$_id.workSpace_id",
													"checkInTime"	: "$checkInTime",
													"checkOutTime"	: "$checkOutTime",
													"user_id"		: "$user_id"
												}				
								}
							]
				)
				.exec()
				.then(seatBooking=>{
					console.log("seatbooking",seatBooking);
					getData();
					async function getData(){
						var returnData = [];
						for(i = 0 ; i < seatBooking.length;i++){
							var userdata = await getuserDetails(seatBooking[i].user_id);
							console.log("userdata..............",userdata);
							returnData.push({
								"workSpace_id" 		: seatBooking[i].workSpace_id,
								"checkInTime"		: seatBooking[i].checkInTime,
								"checkOutTime"		: seatBooking[i].checkOutTime,
								"userName"          : userdata.profile.fullName,
							});
						}
						if( i >= seatBooking.length){
							res.status(200).json(returnData);		
				     	}

					}
					// res.status(200).json(seatBooking);
				})
				.catch(err=>{
					res.status(200).json({error:err});
				});

}
