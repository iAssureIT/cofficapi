const mongoose			= require("mongoose");
const ObjectID  		= require("mongodb").ObjectID;
var   request           =require ('request-promise');
var   moment            = require('moment');
const WorkspaceDetails  = require('../models/workspaceDetails');
const SeatBooking 		= require("../models/seatBooking");
const MenuOrder			= require("../models/menuOrders");
const User              = require('../../coreAdmin/models/users');
const globaleVaiable    = require('../../../nodemon.js');
const SubscriptionOrder	= require("../models/subscriptionOrder.js");
const SubscriptionPlan  = require("../models//subscriptionPlan.js");

exports.dailyBeverage_Report=(req,res,next)=>{
	MenuOrder.aggregate([
							{
								$match : {
										"workSpace_id" 		: req.params.workspace_id,
										"date"				: new Date(req.params.date)
								}
							},
							{
								$group : { 
										"_id"	: "$item",
										"count" : {"$sum" : 1}
									}
							},
							{
								$project:{
									"beverage"  : "$_id",
									"count"		: 1,
									"_id"		: 0,
								}
							}
			])
			.sort({ "createdAt": -1 })
			.skip(parseInt(req.params.startLimit))
			.limit(parseInt(req.params.endLimit))
			.exec()
			.then(data=>{
			 	res.status(200).json(data);
			 })
			 .catch(err=>{
			 	res.status(200).json({error:err});
			 });
}
exports.dailyOrder_Report=(req,res,next)=>{
	console.log("inside....");
	var Da = req.params.date;
	var todayDate = new Date(Da);
	console.log("todayDate",todayDate);
	MenuOrder.find({
		            "workSpace_id" : req.params.workspace_id,
	                "date": {$eq:new Date(todayDate)}})
			 // .select("user_id,item,orderedAt,isDelivered")
			 .exec()
			 .then(data=>{
			 	if(data.length > 0){
			 		getData();
			 		async function getData(){
			 			var i = 0;
			 			var returnData = [];
			 			for(i = 0 ; i < data.length ; i++){
			 				var userInfo = await getuserDetails(data[i].user_id);
			 				console.log("userInfo",userInfo);
			 				returnData.push({
			 					"UserName" 		: userInfo.profile.fullName,
			 					"Item"	   		: data[i].item,
			 					"OrderedAt"		: data[i].orderedAt,
			 					"isDelivered"	: data[i].isDelivered,
			 				});
			 			}
			 			if(i >= data.length){
			 				res.status(200).json(returnData);
			 			}
			 		}
			 	}else{
			 		res.status(200).json("Data not Found");
			 	}
			 	// res.status(200).json(data);
			 })
			 .catch(err=>{
			 	res.status(200).json({error:err});
			 });
}

/*Bank Report*/
exports.bankreport=(req,res,next)=>{
	WorkspaceDetails.find()
					.sort({ "createdAt": -1 })
					.skip(parseInt(req.params.startLimit))
					.limit(parseInt(req.params.endLimit))
					.exec()
					.then(data=>{
						getData();
						async function getData(){
							var returnData  = [];
							var i 			= 0;
							var amountToPay 		= 0;
							for(i = 0 ; i < data.length ; i++){
								var amount 	= await getMenuDetails(data[i]._id,req.params.startDate,req.params.endDate);
								amountToPay	+= amount.totalAmount; 
								returnData.push({
									"partyName"		: data[i].nameOfCafe,
									"accountNumber"	: data[i].bankDetails.AccountNumber,
									"bankName"		: data[i].bankDetails.bankName,
									"IFSCCode"		: data[i].bankDetails.ifscCode,
									"branch"		: data[i].bankDetails.branchName,
									"amountToPay"	: amount.totalAmount,
								});
							}
							if(i >= data.length){
								returnData.push({
									"partyName"		: "Total",
									"accountNumber"	: "Num of Transactions",
									"bankName"		: ":"+(i+1),
									"IFSCCode"		: " ",
									"branch"		: " ",
									"amountToPay"	: amountToPay,
								});	
								res.status(200).json(returnData);
							}
						}
					})
					.catch(err=>{
						res.status(200).json({error:err});
					});
};
function getUserCount(role){
	// console.log("role ",role);
	return new Promise(function(resolve,reject){
		var query = { "roles" : {$in:[role]}};
		console.log("query ",query);
		User.find({ "roles" : {$in:[role]}})
			.exec()
			.then(data=>{
				console.log("count ",data.length);
				resolve(data.length);
			})
			.catch(err=>{
				reject(err);
			})
	});
}
function getActiveVendor(){
	return new Promise(function(resolve,reject){
		User.countDocuments({ "roles" : {$in:["vendor"]},"profile.status":"Active"})
			.exec()
			.then(data=>{
				resolve(data);
			})
			.catch(err=>{
				reject(err);
			})
	});	
}
function getSubUser(){
	return new Promise(function(resolve,reject){
		SubscriptionOrder.countDocuments({"status" : "paid"})
			.exec()
			.then(data=>{
				// console.log("data ",data);
				resolve(data);
			})
			.catch(err=>{
				reject(err);
			})
	});	
}
function getEarning(startDate,endDate){
	return new Promise(function(resolve,reject){
		MenuOrder.aggregate([
					{
						$match :{
							"date"			: {$gte : startDate, $lte : endDate},
							"isDelivered"	: true
						}
					},
					{
						$group:{
							"_id" 	: null,
							"count"	: {"$sum" : 1},
							"total"	: {"$sum":"$price"}
						}
					}
				])
				 .exec()
				 .then(data=>{
				 	if(data.length > 0 ){
					 	resolve({ 
					 			"totalAmt" 		: data[0].total,
					 			"totalCount"	: data[0].count
					 		});
				 	}else{
				 		resolve({ 
					 			"totalAmt" 		: 0,
					 			"totalCount"	: 0
					 		});
				 	}
				 })
				 .catch(err=>{
				 	reject(err)
				 });
	});	
}
exports.dashboardBlock = (req,res,next)=>{	
	getData();
	async function getData(){
		var year  			= new Date().getFullYear();
		var month 			= new Date().getMonth()+1;
		var yearStartDate   = new Date(year+"-01-01");
		var monthStartDate   = new Date(year+"-"+month+"-01");
		var userInfo 		= await getUserCount("user");
		console.log("userInfo ",userInfo);
		var vendorInfo		= await getUserCount("vendor");
		var activeVendor 	= await getActiveVendor();
		var subUser 		= await getSubUser();
		console.log("subUser ",subUser);
		var earningYTD		= await getEarning(yearStartDate,new Date());
		var earningMTD		= await getEarning(monthStartDate,new Date());
		var twelveMonthGrossEarning = [];
		var i = 0;
		var y = year - 1;
		var m = month + 1;
		if(month === 13){
			y = year-1;	
			m = 1;
		}
		for(i = 1 ; i <= 12 ; i++ ){
			var firstDay = new Date(y, m-1, 2);
			var lastDay = new Date(y, m , 1);
			var grossEarning = await getEarning(firstDay,lastDay);
			twelveMonthGrossEarning.push({
												"monthYear"	: firstDay.toLocaleString('default', { month: 'short' }),
												"earning"  	: grossEarning.totalAmt
										});
			m = m + 1;
			if(m === 13){
				m = 1;
				y = y + 1;
			}
		}
		var subscrptionData = await subscription(yearStartDate,new Date());
		res.status(200).json({
			"totalUsers" 				: userInfo,
			"subUsers"					: subUser,
			"totalVendor"				: vendorInfo,
			"activeVendor"				: activeVendor,
			"earningYTD"				: earningYTD.totalAmt,
			"earningMTD"				: earningMTD.totalAmt,
			"menuYTD"					: earningYTD.totalCount,
			"menuMTD"					: earningMTD.totalCount,
			"twelveMonthGrossEarning" 	: twelveMonthGrossEarning,
			"subscrptionData"			: subscrptionData
		});
	};
};
function getMenuDetails(vendor_ID,startDate,endDate){
	console.log('vendor_ID',vendor_ID);
	return new Promise(function(resolve,reject){
		MenuOrder.aggregate([
								{
									$match : {
										"workSpace_id" 		: String(vendor_ID),
										"orderedAt"			: {$gte : new Date(startDate), $lte : new Date(endDate)},
										"isDelivered"		: true
									}
								},
								{
									$group:{
										"_id" 	: null,
										"count"	: {"$sum" : 1},
										"total"	: {"$sum":"$price"}
									}
								}
				])
				 .exec()
				 .then(data=>{
				 	if(data.length > 0){
				 		resolve({
				 			"numTransaction" : data[0].count,
				 			"totalAmount"	 : data[0].total
				 		});
				 	}else{
				 		resolve({
				 			"numTransaction" : 0,
				 			"totalAmount"	 : 0
				 		});
				 	}
				 })
				 .catch(err=>{
				 	reject(err)
				 });
	});
}
/*Settlement Summary Report*/
exports.settlementSummary = (req,res,next)=>{
	WorkspaceDetails.find()
					.sort({ "createdAt": -1 })
					.skip(parseInt(req.params.startLimit))
					.limit(parseInt(req.params.endLimit))
					.exec()
					.then(vendor=>{
						if(vendor.length > 0){
							getData();
							async function getData(){
								var returnData 		= [];
								var i 				= 0;
								var numTransaction 	= 0;
								var totalAmount		= 0;
								var deduction 		= 0;
								var payableAmount	= 0;
								for(i = 0; i < vendor.length; i++){
									var menuDetails 	 = await getMenuDetails(vendor[i]._id,req.params.startDate,req.params.endDate);
									numTransaction		+= menuDetails.numTransaction;
									totalAmount			+= menuDetails.totalAmount;
									deduction 			+= menuDetails.totalAmount >= 3000 ? "-10%" : 0;
									payableAmount 		+= menuDetails.totalAmount >= 3000 ? (menuDetails.totalAmount - (menuDetails.totalAmount * 0.1)) : menuDetails.totalAmount;  
									returnData.push({
										"vendorId" 			: i+1,
										"vendorName"		: vendor[i].nameOfCafe,
										"numTransaction"	: menuDetails.numTransaction,
										"totalAmt"			: menuDetails.totalAmount,
										"deduction"			: menuDetails.totalAmount >= 3000 ? "-10%" : 0 ,
										"payableAmount"		: menuDetails.totalAmount >= 3000 ? (menuDetails.totalAmount - (menuDetails.totalAmount * 0.1)) : menuDetails.totalAmount,
										"status"			: "UnPaid",
										"action"			: "Pay"
									});
								}	
								if(i >= vendor.length){
									returnData.push({
										"vendorId" 			: " ",
										"vendorName"		: "Total",
										"numTransaction"	: numTransaction,
										"totalAmt"			: totalAmount,
										"deduction"			: deduction,
										"payableAmount"		: payableAmount,
										"status"			: "UnPaid",
										"action"			: ""
									});
									res.status(200).json(returnData);
								}
							}
						}else{
							res.status(200).json({message:"Data not found"});
						}
					})
					.catch(err=>{
						res.status(200).json({error:err});
					});
};
exports.settlementDetail = (req,res,next)=>{
	MenuOrder.find()
			.sort({ "createdAt": -1 })
			.skip(parseInt(req.params.startLimit))
			.limit(parseInt(req.params.endLimit))
			.exec()
			.then(menu=>{
			 	if(menu.length > 0){
			 		getData();
			 		async function getData(){
			 			var returnData 	= [];
			 			var i 			= 0;
			 			var quantity 	= 0;
			 			var itemAmount	= 0;
			 			var gst 		= 0;
			 			var totalAmount	= 0;
			 			for(i = 0 ; i < menu.length; i++){
			 				quantity	+= 1;
			 				itemAmount	+= menu[i].price;
			 				gst 		+= 2.00;
			 				totalAmount += menu[i].price+2.00;
			 				var userInfor = await getuserDetails(menu[i].user_id);
			 				returnData.push({
			 					"dateTime"		: menu[i].orderedAt,
			 					"userName"		: userInfor.profile.fullName,
			 					"menuItem"		: menu[i].item,
			 					"quantity"		: 1,
			 					"itemAmount" 	: menu[i].price,
			 					"gst"			: 2.00,
			 					"totalAmount"	: menu[i].price+2.00
			 				});
			 			}
			 			if(i >= menu.length){
			 				returnData.push({
			 					"dateTime"		: "Total",
			 					"userName"		: "Transaction",
			 					"menuItem"		: "",
			 					"quantity"		: quantity,
			 					"itemAmount" 	: itemAmount,
			 					"gst"			: gst,
			 					"totalAmount"	: totalAmount
			 				});
			 				res.status(200).json(returnData);
			 			}
			 		}
			 	}else{
			 		res.status(200).json({message:"Data not found"});
			 	}
			 })
			 .catch(err=>{
			 	res.status(200).json({error:err})
			 });
}
function getuserDetails(user_id){
    return new Promise(function(resolve,reject){
        User.findOne({"_id": new ObjectID(user_id)})
                        .exec()
                        .then(data=>{
                            resolve(data);
                        })
                        .catch(err=>{
                            reject(err);
                  });
            });
}
function getworkSpaceDetails(workSpace_id){
    return new Promise(function(resolve,reject){
        WorkspaceDetails.findOne({"_id": new ObjectID(workSpace_id)})
                        .exec()
                        .then(data=>{
                            resolve(data);
                        })
                        .catch(err=>{
                            reject(err);
                        });
        // resolve(workspaceId);
    });
}
function getMenuOrder1(workSpace_id){
	console.log("workSpace_id",workSpace_id);
    return new Promise(function(resolve,reject){
        MenuOrder.find({"workSpace_id": new ObjectID(workSpace_id)})
                        .exec()
                        .then(data=>{
                        	console.log("data ....",data);
                            resolve(data);
                        })
                        .catch(err=>{
                            reject(err);
                  });
            });
}
function availableSeats(workSpace_id){
    return new Promise(function(resolve,reject){
        request({
            "method" : "GET",
            "url"    : "http://localhost:"+globaleVaiable.PORT+"/api/seatbooking/get/availableSeats/"+workSpace_id,
            // "body"   : "",
            "json"   : true,
            "header" : {
                            "User-Agent" : "Test Agent",
                        }
        })
        .then(data=>{
            resolve(data);
        })
        .catch(err=>{
            console.log("err ",err);
            reject(err);
        })
    });
}
function getMenuOrder(data){
    return new Promise(function(resolve,reject){
        MenuOrder.aggregate(
        				[
        					{
        						$match : {
        							"workSpace_id" 	: String(data.workSpace_id),
        							"date"			: new Date(data.date),
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
				.sort({ "createdAt": -1 })
				.skip(parseInt(req.params.startLimit))
				.limit(parseInt(req.params.endLimit))
				.exec()
				.then(seatBooking=>{
					console.log('seatBooking ',seatBooking);
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
};
exports.vendor_dailycheckins = (req,res,next)=>{
	SeatBooking .aggregate(
							[
								{
									$match : {
										"workSpace_id"  : req.params.workspace_ID,
										"date"			: req.params.date

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
				.sort({ "createdAt": -1 })
				.skip(parseInt(req.params.startLimit))
				.limit(parseInt(req.params.endLimit))
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
						console.log("returndata",returnData);
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
//Subscription Details
function countPlan(plan_ID,startDate,endDate){
	return new Promise(function(resolve,reject){
		SubscriptionOrder.countDocuments({
									"plan_ID"   : String(plan_ID),
									"createdAt"		: {$gte : startDate, $lte : endDate}
						})
						 .exec()
						 .then(data=>{
						 	resolve(data);
						 })
						 .catch(err=>{
						 	reject(err);
						 })
	});
}
function subscription(startDate,endDate){
	return new Promise(function(resolve,reject){
		SubscriptionPlan.find()
						.exec()
						.then(subDetails=>{
							if(subDetails.length > 0 ){
								getData();
								async function getData(){
									var returnData = [];
									var i = 0;
									for(i = 0 ; i < subDetails.length ; i++){
										var count = await countPlan(subDetails[i]._id,startDate,endDate);
										returnData.push({
											"packageName" : subDetails[i].planName,
											"count"		  : count
										});
									}
									if(i >= subDetails.length){
										resolve(returnData);
									}
								}
							}else{
								resolve({message : "Data not found"});
							}
						})
						.catch(err=>{
							reject({error:err});
						});
	});
}
//Sales Transactions
function getPlanDetails(plan_id){
	return new Promise(function(resolve,reject){
		SubscriptionPlan
		.findOne({"_id": plan_id})
						.exec()
						.then(planData=>{
							if(planData){
								resolve(planData);
							}else{
								resolve({
									"planName" 		: "-",
									"maxCheckIns"	: 0,
									"price"			: 0
								});
							}
						})
						.catch(err=>{
							reject(err);
						})
	});
}
function getSettingDetails(user_ID,startDate,endDate){
	return new Promise(function(resolve,reject){
		SeatBooking.countDocuments({
									"user_id"   : user_ID,
									"date"		: {$gte : startDate, $lte : endDate}
					})
					.exec()
					.then(cnt=>{
						resolve(cnt);
					})
					.catch(err=>{
						reject(err);
					});
	});
}
exports.salesTransaction = (req,res,next)=>{
	var query = {};
	//need to work on type of user
	if(req.params.plan_ID != "all"){
		if(req.params.typeUser == "Active"){
			query = {
					"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate},
					"plan_id"		: req.params.plan_ID,
					"status" 		: "paid"
				};	
		}else{
			query = {
						"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate},
						"plan_id"		: req.params.plan_ID,
						"status" 		: "inactive"
					};
		}
	}else{
		if(req.params.typeUser == "Active"){
			query = {
					"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate},
					"status" 		: "paid"
				};	
		}else{
			query = {
						"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate},
						"status" 		: "inactive"
					};
		}

	}
	if(query){
		SubscriptionOrder 	
		.find()
		.sort({ "createdAt": -1 })
				.skip(parseInt(req.params.startLimit))
				.limit(parseInt(req.params.endLimit))
							.exec()
							.then(subOrder=>{
								if(subOrder.length > 0){
									getData();
									async function getData(){
										var i = 0;
										var returnData = [];
										for(i = 0 ; i < subOrder.length; i++){
											var userDetails		= await getuserDetails(subOrder[i].user_id);
											var planDetails 	= await getPlanDetails(subOrder[i].plan_id);
											var seatingDetails	= await getSettingDetails(subOrder[i].user_id,req.params.startDate,req.params.endDate);
											returnData.push({
												"userName" 			: userDetails.profile.fullName,
												"packageName"		: planDetails.planName,
												"amount"			: planDetails.price,
												"totalChkIn"		: planDetails.maxCheckIns,
												"checkInLeft"		: (planDetails.maxCheckIns - seatingDetails),
												"packageStartDate"	: subOrder[i].startDate,
												"packageEndDate"	: subOrder[i].endDate,

											});
										}
										if(i >= subOrder.length){
											res.status(200).json(returnData);
										}
									}
								}else{
									res.status(200).json({message:"Data not found"});
								}
							})
							.catch(err=>{
								res.status.json({error:err})
							})
	}
}
exports.checkInOut=(req,res,next)=>{
	var query = {};
	switch(req.params.type){
		case "checkIn" :
			query = {
						$match : {
							"workSpace_id"  : req.params.workSpace_id,
							"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate},
							"checkOutTime"  : null
						}
					};
			// res.status(200).json({"CheckIn List":query});
			break;
		case "checkOut" :
			query = {
						$match : {
							"workSpace_id"  : req.params.workSpace_id,
							"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate},
							"checkOutTime"  : {$ne : null}
						}
					};
			// res.status(200).json({"CheckOut List":query});
			break;
		case "both" :
			query = {
						$match : {
							"workSpace_id"  : req.params.workSpace_id,
							"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate}
						}
					};
			// res.status(200).json({"CheckIn-Out List" : query});
			break;
		default :
			res.status(200).json("Invalid type");
			break;
	}
	if(query){
		SeatBooking .aggregate(
							[
								query,
								
								{
									$project : {
													"workSpace_id"	: "$workSpace_id",
													"checkInTime"	: "$checkInTime",
													"checkOutTime"	: "$checkOutTime",
													"user_id"		: "$user_id"
												}				
								}
							]
				)
				.sort({ "createdAt": -1 })
				.skip(parseInt(req.params.startLimit))
				.limit(parseInt(req.params.endLimit))
				.exec()
				.then(seatBooking=>{
					console.log("seatBooking......>",seatBooking);
					getData();
					async function getData(){
						var returnData=[];
						for(var i=0;i<seatBooking.length;i++){
							var reportdata=await getuserDetails(seatBooking[i].user_id);
							var menucount=await getMenuOrder1(seatBooking[i].workSpace_id);
							console.log("menucount",menucount);
							returnData.push({
								"workSpace_id" 		: seatBooking[i].workSpace_id,
 								"checkInTime"		: seatBooking[i].checkInTime,
 								"checkOutTime"		: seatBooking[i].checkOutTime == null ?"Ongoing":seatBooking[i].checkOutTime,
 								"userName"          : reportdata.profile.fullName,
 								"menuOrder"         : menucount.length,

							});
						}
						if( i >= seatBooking.length){
							res.status(200).json(returnData);
					  }
					}

				})
				.catch(err=>{
					res.status(200).json({error:err});
				})

	 }else{

	 }	
}
exports.cafewiseSeatBooking=(req,res,next)=>{
	WorkspaceDetails
	.find()
	.sort({ "createdAt": -1 })
	.skip(parseInt(req.params.startLimit))
	.limit(parseInt(req.params.endLimit))
	.exec()
	.then(workspacedata=>{
		console.log("workspacedata",workspacedata);
		console.log("workspacedata.length",workspacedata.length);
		getData();
		async function getData(){
		var returnData=[];
		for(i=0;i<workspacedata.length;i++){
	     	var seatdata =await availableSeats(workspacedata[i]._id);
		// console.log("seatdata",seatdata);
		    returnData.push({
			    "_id"		       : workspacedata[i]._id ? workspacedata[i]._id : "-",
			    "branch"		   : workspacedata[i].address,
				"cafeName"         : workspacedata[i].nameOfCafe,
				"city"             : workspacedata[i].city,
				"totalSeats"       : workspacedata[i].numberOfSeats,
				"occupiedSeats"    : seatdata.bookedSeats,
				"availableSeats"   : seatdata.availableSeats,
			    "length"		   : workspacedata.length,
			    "i"		   		   : i, 
				});

		       }
		       if( i >= workspacedata.length){
							res.status(200).json(returnData);
			}
		}

	})
	.catch(err=>{
		res.status(200).json({error:err})
	})
}

 

/*
cafewise_old

SeatBooking .aggregate(
							[
								{
									$match : {
										
										"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate},

									}
								},
								
								{
									$project : {
													"workSpace_id"	: "$workSpace_id",
												}				
								}
							]
				)
				.exec()
				.then(seatBooking=>{
					console.log("seatBooking......>",seatBooking);
					getData();
					async function getData(){
						var returnData=[];
						for(var i=0;i<seatBooking.length;i++){
							var workspacedata =await getworkSpaceDetails(seatBooking[i].workSpace_id);
							var seatdata      =await availableSeats(seatBooking[i].workSpace_id);
							console.log("seatdata",seatdata);
							returnData.push({
								"workSpace_id" 		: seatBooking[i].workSpace_id,
								"branch"			: workspacedata.address,
 								"Cafe Name"         : workspacedata.nameOfCafe,
 								"City"              : workspacedata.city,
 								"Total Seats"       : workspacedata.numberOfSeats,
 								"Occupied Seats"    : seatdata.bookedSeats,
 								"Available Seats"   : seatdata.availableSeats,

							});
						}
						if( i >= seatBooking.length){
							res.status(200).json(returnData);
					  }
					}

				})
				.catch(err=>{
					res.status(200).json({error:err});
				})
 


*/



// exports.checkInOut = (req,res,next)=>{
// 	var  = {};
// 	if(workSpace_id != "all"){
// 		SeatBooking.aggregate  {
// 					"workSpace_id" : req.params.workSpace_id,
// 					"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate}
// 				};
// 	}else{
// 		 SeatBooking {
		
// 							"date" 			: {$gte : req.params.startDate, $lte : req.params.endDate}
// 		};
// 	}
// 	SeatBooking.find()
// 			   .exec()
// 			   .then(data=>{
// 			   	console.log("data......",data);
// 			   		if(data.length > 0){
// 			   			getData();
// 			   			async function getData(){
// 			   				var returnData = [];
// 			   				for(i = 0 ; i < data.length ; i++){
// 			   					var reportsdata = await getuserDetails(seatBooking[i].user_id);
// 			   					returnData.push({
// 				   					"workSpace_id" 		: seatBooking[i].workSpace_id,
// 									"checkInTime"		: seatBooking[i].checkInTime,
// 									"checkOutTime"		: seatBooking[i].checkOutTime,
// 									"userName"          : userdata.profile.fullName,

// 			   					})
			   	

// 			   				}
// 			   			}
// 			   		}else{
// 			   			res.status(200).json({message: "DAta not found"})
// 			   		}
// 			   })
// 			   .catch()

// }
