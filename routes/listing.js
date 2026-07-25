const express=require("express");
const router=express.Router();
const {isLoggedIn}=require("../views/middleware.js");
const {isOwner}=require("../views/middleware.js");
const listingController=require("../controller/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Listing=require("../models/listings.js");
const {storage}=require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({storage});

 const {listingSchema, reviewSchema}=require("../schema.js");
const { findById } = require("../models/review.js");
const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }
    else{
        next();
    }
}
//index route
router.get("/",wrapAsync(listingController.index));
router.get("/search",(listingController.search));
router.get("/privacy",(listingController.privacy));
router.get("/terms",(listingController.terms));
//create route
router.route("/new")
.get(isLoggedIn,listingController.renderNewForm)
 .post(upload.single("listings[image]"),validateListing,wrapAsync(listingController.createListings))
 
//search

//edit and update route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

router.route("/:id")
.patch(isLoggedIn,isOwner,upload.single("listings[image]"),validateListing,wrapAsync(listingController.updateListing))
//show route
.get(wrapAsync(listingController.showListings))
//delete route 
.delete(isLoggedIn,wrapAsync(listingController.destroyListing))

module.exports=router;