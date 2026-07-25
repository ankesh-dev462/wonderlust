if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
const express=require("express");
const app=express();
const methodOverride=require("method-override");
//session
var session = require('express-session')
const MongoStore = require('connect-mongo').default;


//flash
var flash = require('connect-flash');
//joi packege for schema validation
app.use(methodOverride("_method"));
//cookie-parser
var cookieParser = require('cookie-parser')
app.use(cookieParser("secretcode"));
const dbUrl=process.env.ATLASDB_URL;
app.use(express.urlencoded({extended:true}));
const expressError=require("./utils/expressError.js");
const wrapAsync=require("./utils/wrapAsync.js");
//passport
const passport=require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User=require("./models/user.js");
//ejs mate 
const ejsmate=require("ejs-mate");
app.engine("ejs",ejsmate);
const path=require("path");
app.use(express.static(path.join(__dirname,"/public")));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
 const {listingSchema, reviewSchema}=require("./schema.js");
const Listing=require("./models/listings.js");
const Review=require("./models/review.js");

  const store= MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600 // time period in seconds
  })

  store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
  })
  const sessionOptions={
    store,
    secret: process.env.SECRET,
     resave: false,
     saveUninitialized: true,
     cookie:{
        expires:Date.now()*7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
     }
}


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const users=require("./routes/user.js");

//database connection
const mongoose=require("mongoose");
main().then(()=>{
    console.log("database connnected");
}).catch((err)=>{
    console.log(err);
})

 async function main(){
    await mongoose.connect(dbUrl);
}
const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }
    else{
        next();
    }
}
const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        throw new expressError(400,error);
    }
    else{
        next();
    }
}
app.use("/listings",listings);
app.use("/listings/:id/review",reviews);
app.use("/",users);

app.listen("8080",()=>{
    console.log("server started");
})

app.all("/*splat", (req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.use((err,req,res,next)=>{
   let {status=500,message="Something went Wrong"}=err;
   res.render("./listings/error",{err});
});

