const Listing=require("../models/listings.js");
const Review = require("../models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be Logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!res.locals.currUser && listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You Don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
     let {id,revieweId}=req.params;
    let review=await Review.findById(revieweId);
    console.log(review.author);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}