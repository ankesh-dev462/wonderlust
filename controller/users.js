 const Review=require("../models/review.js");
const Listing=require("../models/listings.js");
const User=require("../models/user.js");
module.exports.signup=async(req,res)=>{
 try{
       let{username,email,password}=req.body;
    const newUser=new User({email,username});
    let registerUser=await User.register(newUser,password);
    req.login(registerUser,(err)=>{
      if(err){
         return next(err);
      }
    
    req.flash("success","Welcome to wonderlust");
    res.redirect("/listings");
    })
 }
 catch(er){
    req.flash("error",er.message);
    res.redirect("/signup");
 }

}

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup");
}

module.exports.renderLoginForm=(req,res)=>{
        res.render("users/login");
}

module.exports.login=async(req,res)=>{
   req.flash("success","Welcome to wonderlust!");
   let redirectUrl=res.locals.redirectUrl || "/listings"
   res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
   req.logout((err)=>{
      if(err){
         return next(err);
      }
      req.flash("success","you are logged out!");
      res.redirect("/listings");
   })
}