const mongoose=require("mongoose");
const schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;
console.log(passportLocalMongoose);
console.log(typeof passportLocalMongoose);
const userschema=new schema({
    email:{
        type:String,
        required:true
    }
});
userschema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userschema);