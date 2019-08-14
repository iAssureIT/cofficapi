const express 	= require("express");
const router 	= express.Router();


const workAmenitiesController = require('../controllers/workAmenities');


router.post('/post', workAmenitiesController.submit_amenity);

router.patch('/patch/update/:id',workAmenitiesController.updateamenitySingle);

router.delete('/delete/:id',workAmenitiesController.deleteamenitySingle);

router.get('/get/List',workAmenitiesController.get_amenityList);

router.get('/get/:id',workAmenitiesController.get_amenitySingle);

 

module.exports = router;
