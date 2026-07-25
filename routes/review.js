const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, isReviewAuthor}=require("../views/middleware.js");
 const {listingSchema, reviewSchema}=require("../schema.js");
 const Review=require("../models/review.js");
 const expressError=require("../utils/expressError.js")
 const Listing=require("../models/listings.js");
 const reviewController=require("../controller/reviews.js");
const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }
    else{
        next();
    }
}
//reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
//deletion
router.delete("/:review_id",isLoggedIn,wrapAsync(reviewController.destroyReview));
module.exports=router;