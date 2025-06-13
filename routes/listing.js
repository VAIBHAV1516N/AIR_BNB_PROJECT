const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema} =require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



//INDEX ROUTE
router.get("/",wrapAsync(listingController.index));


//NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);



// SHOW ROUTE
router.get("/:id",wrapAsync(listingController.showListing));

//CREATE ROUTE
router.post("/", isLoggedIn, upload.single('listing[image]') ,validateListing, wrapAsync(listingController.createListing));
// router.post("/", , (req, res)=>{
//     res.send(req.file);
// });

//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner ,wrapAsync(listingController.editListing));

//UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));


//DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner ,wrapAsync(listingController.deleteListing));


module.exports = router;