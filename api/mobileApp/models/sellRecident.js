const mongoose = require('mongoose');

const sellRecidentialSchema = mongoose.Schema({
	_id			            : mongoose.Schema.Types.ObjectId,
    propertyID              : Number,
    propertyholder          : String,
    propertypurpose         : String,
    propertytype            : String,
    propertyloc             : String,
    floor                   : String,
    totalfloor              : String,
 
    propertylocation        : 
                                {
                                    pincode             : String,
                                    area                : String,
                                    subarea             : String,
                                    socity              : String,
                                    housebuilding       : String,
                                    landmark            : String,
                                 

                                    // nameofproject       : String,
                                    // developername       : String,
                                    // locality            : String,
                                    
                                    // floorplans          : String,

                                
                                },
                            
    propertyDetails         :   {
                                    furnishedstatus     : String,
                                    bedrooms            : String,
                                    balconies           : String,
                                    bathrooms           : String,
                                    ageofproperty       : String,
                                    facing              : String,
                                 
                                    superArea           : String,
                                    builtupArea         : String,
                                    

                                    // carpateArea         : String,
                                   
                                },
                            
    // transactionType         : {
    //                                 newProperty         : String,
    //                                 resell              : String,
    //                                 underConstruction   : String,
    //                                 readytomove         : String,
    //                                 ageofConstruction   : String,
                                    
    //                             },
    Amenities               : {
                                    amenities         : Array,
                                    
                                },
    financial               : {

                                    expectedrate        : String,
                                    totalprice          : String,
                                    includecharges      : Array,
                                    maintenancecharges  : String,
                                    maintenanceper      : String,
                                    availableFrom       : String,
                                    description         : String,
                                },
    
    avalibilityplanvisit       : {
                                    contactperson         : String,
                                    contactpersonmob      : String,
                                    availability          : String,
                                    starttime             : String,
                                    endtime               : String,
                                    
                                },

                                
    

    // photos                      : [{

    //                                 exteriorview         : String,
    //                                 livingRoom           : String,
    //                                 bedrooms             : String,
    //                                 bathrooms            : String,
    //                                 kitchen              : String,
    //                                 floorplan            : String,
    //                                 masterplan           : String,
    //                                 locationmap          : String,
    //                                 other                : {
    //                                                             postingpropertyonmob : String,
    //                                                             responceonwhatsapp   : String,

    //                                                         },
                                  
    //                             }]

});

module.exports = mongoose.model('sellRecidential',sellRecidentialSchema);
