	const express 						= require ('express');
	const app 							= express();
	const morgan 						= require('morgan');// morgan call next function if problem occure
	const bodyParser 					= require('body-parser');// this package use to formate json data 
	const mongoose 						= require ('mongoose');

    const dbname = "qacoffic";
	global.JWT_KEY = "secret";	
	
	mongoose.connect('mongodb://localhost/'+dbname,{
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

    
    const workspaceDetailsurl 	       = require("./api/cofficAdmin/routes/workspaceDetails");
    const subscriptionsurl      	   = require("./api/cofficAdmin/routes/workspaceDetails");



	app.use("/api/workspaceDetails",workspaceDetailsurl);
	app.use("/api/subscription",subscriptionsurl);



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

	


