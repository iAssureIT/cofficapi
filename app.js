	const express 						= require ('express');
	const app 							= express();
	const morgan 						= require('morgan');// morgan call next function if problem occure
	const bodyParser 					= require('body-parser');// this package use to formate json data 
	const mongoose 						= require ('mongoose');
    var nodeMailer                      = require('nodemailer');
    var moment                          = require('moment');
    const globalVariable                = require('./nodemon.js');

	global.JWT_KEY = globalVariable.JWT_KEY;	
	
	/*mongoose.connect('mongodb://localhost/'+dbname,{*/
  /* mongoose.connect('mongodb://localhost/onlineExamSystem',{*/
     mongoose.connect('mongodb://localhost/'+globalVariable.dbname,{
        useNewUrlParser: true
    })
    mongoose.promise = global.Promise;

    app.use(morgan("dev"));
    app.use('/uploads', express.static('uploads'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
            return res.status(200).json({});
        }
        next();
    });

    
    const WorkspaceDetailsurl 	       = require("./api/coffic/routes/workspaceDetails");
    const SubscriptionPlanurl          = require("./api/coffic/routes/subscriptionPlan");
    const ProjectSettingsurl           = require("./api/coffic/routes/projectSettings");
    const WorkAmenitiessurl            = require("./api/coffic/routes/workAmenities");
    const CafeMenuUrl                  = require("./api/coffic/routes/CafeMenu");
    const SubscriptionOrderUrl         = require("./api/coffic/routes/subscriptionOrder");
    const MenuOrdersurl                = require("./api/coffic/routes/menuOrders");
    const SeatBookingurl               = require("./api/coffic/routes/seatBooking");
    const SubscriptionOrder            = require("./api/coffic/routes/subscriptionOrder");

    const UsersUrl                     = require("./api/coreAdmin/routes/users");
    const Companysettings              = require("./api/coreAdmin/routes/companysettings");
    const NotificationTemp             = require("./api/coreAdmin/routes/masternotifications");
    const paymentgatewayurl             = require("./api/coreAdmin/routes/paymentgateway");

    const Reports                       = require("./api/coffic/routes/reports");

    


	app.use("/api/workspaceDetails",WorkspaceDetailsurl);
    app.use("/api/subscriptionplan",SubscriptionPlanurl);
    app.use("/api/workAmenities",WorkAmenitiessurl);
    app.use("/api/projectSettings",ProjectSettingsurl);
    app.use("/api/cafeMenu",CafeMenuUrl);
    app.use("/api/subscriptionOrder",SubscriptionOrderUrl);

    app.use("/api/paymentgateway",paymentgatewayurl);




    app.use("/api/users",UsersUrl);
    app.use("/api/companysettings",Companysettings);
    app.use("/api/masternotifications",NotificationTemp);

    // app.use("/api/signupmobile",MobileAppsignupurl);
    app.use("/api/menuorders",MenuOrdersurl);
    app.use("/api/seatbooking",SeatBookingurl);
    app.use("/api/subscriptionorder",SubscriptionOrder);

    app.use("/api/report",Reports);


	// app.post('/send-email', (req, res)=> {
	// 	console.log('send mail');
	// 	let transporter = nodeMailer.createTransport({
	// 		service : 'gmail',
	// 		host: 'smtp.gmail.com',
	// 		port: 587,
	// 		auth: {
	// 			user: 'Appstore@coffic.com',
    //             pass: 'Coffic@123'
    //             // user: 'testtprm321@gmail.com',
    //             // pass: 'tprm1234'

	// 		}
	// 	});
	// 	console.log('after transport');
	// 	let mailOptions = {
			
	// 		from   : '"Coffic" <Appstore@coffic.com>', // sender address
	// 		to     : req.body.email, // list of receivers
	// 		subject: req.body.subject, // Subject line
	// 		text   : req.body.text, // plain text body
    //         html   : req.body.mail // html body
            
    //         // from   : '"Coffic" <testtprm321@gmail.com>', // sender address
    //         // to     : req.body.email, // list of receivers
    //         // subject: req.body.subject, // Subject line
    //         // text   : req.body.text, // plain text body
    //         // html   : req.body.mail // html body
	// 	};
	// 	console.log('after mailoption');
	// 	//name email mobilenumber message
	// 	// console.log("mailOptions",mailOptions);
		
	// 	transporter.sendMail(mailOptions, (error, info) => {
	// 		console.log('in mail');
	// 		if (error) {
				
	// 			console.log("send mail error",error);
	// 			return "Failed";
	// 		}
	// 		if(info){
	// 			console.log('in info');
	// 			// return "Success";
	// 			res.status(200).json({ 
					
	// 				message: "Success",
	// 				// return "Success",

	// 			});
	// 		}
	
	// 		res.render('index');
	// 	});
    // });
    
    app.post('/send-email', (req, res)=> {
		console.log('send mail');
		let transporter = nodeMailer.createTransport({
			
			host: 'smtp.gmail.com',
			port: 587,
			auth: {
				user: 'testtprm321@gmail.com',
				pass: 'tprm1234'
			}
		});
		console.log('after transport');
		let mailOptions = {
			
			from   : '"TGK" <testtprm321@gmail.com>', // sender address
			to     : req.body.email, // list of receivers
			subject: req.body.subject, // Subject line
			text   : req.body.text, // plain text body
			html   : req.body.mail // html body
		};
		console.log('after mailoption');
		//name email mobilenumber message
		// console.log("mailOptions",mailOptions);
		
		transporter.sendMail(mailOptions, (error, info) => {
			console.log('in mail');
			if (error) {
				
				console.log("send mail error",error);
				return "Failed";
			}
			if(info){
				console.log('in info');
				// return "Success";
				res.status(200).json({ 
					
					message: "Success",
					// return "Success",

				});
			}
	
			res.render('index');
		});
	});



    app.use((req, res, next) => {
        const error = new Error("Not found");
        error.status = 404;
        next(error);
    });

    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
                error: {
                message: error.message
                }
            });
    });

    module.exports = app;




	//============  Make Changes Below  =================
	// Routes which should handle requests
	
	/*const workspaceDetailsurl 	= require("./api/vendorApi/routes/workspaceDetails");
	app.use("/api/workspaceDetails",workspaceDetailsurl);

	const subscriptionsurl 	= require("./api/vendorApi/routes/subscription");
	app.use("/api/subscription",subscriptionsurl);

	const seatBookingurl 	= require("./api/vendorApi/routes/seatBooking");
	app.use("/api/seatBooking",seatBookingurl);
    
    const ordersurl 	= require("./api/vendorApi/routes/orders");
	app.use("/api/orders",ordersurl);

	const subscriptionPlanurl 	= require("./api/vendorApi/routes/subscriptionPlan");
	app.use("/api/subscriptionPlan",subscriptionPlanurl);*/


	/*ROUTES FOR ADMIN*/

	




