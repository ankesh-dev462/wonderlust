const Listing=require("../models/listings.js");

module.exports.index=async(req,res)=>{
    let result=await Listing.find({});
        res.render("./listings/index",{result});
}

module.exports.renderNewForm=async(req,res)=>{
    res.render("./listings/new");
}
module.exports.search=async(req,res)=>{
    let {search}=req.query;
    let listing=await Listing.findOne({country:search});
    if(!listing){
        req.flash("error","Your search is unavailable! We are Sorry.");
        res.redirect("/listings");
    }
   else{
    res.redirect(`/listings/${listing._id}`);
   }
}
module.exports.privacy=(req,res)=>{
    res.render("./listings/privacy");
}
module.exports.terms=(req,res)=>{
    res.render("./listings/terms");
}
module.exports.createListings=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=new Listing(req.body.listings);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
   await newListing.save();
   req.flash("success","New listing Created");
   res.redirect("/listings");
}

module.exports.showListings=async(req,res,next)=>{
     let id=req.params.id;
     let result=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
     if(!result){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
     }
        res.render("./listings/show",{result});
}

module.exports.renderEditForm=async(req,res)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
 res.render("./listings/edit",{listing});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
     
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listings});
    if(typeof req.file !="undefined"){
     let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
     req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let id=req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}