const express 	= require("express");
const router 	= express.Router();


const workAmenitiesController = require('../controllers/workAmenities');


router.post('/submitAmenity', workAmenitiesController.submit_amenity);
router.post('/updateAmenity/:id',workAmenitiesController.updateamenitySingle);
router.delete('/deleteAmenity/:id',workAmenitiesController.deleteamenitySingle);
router.get('/getAmenityList',workAmenitiesController.get_amenityList);
router.get('/getAmenity/:id',workAmenitiesController.get_amenitySingle);

 

module.exports = router;
