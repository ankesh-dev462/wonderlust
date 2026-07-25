const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");
main().then(()=>{
    console.log("database connnected");
}).catch((err)=>{
    console.log(err);
})

 async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"6a5d1660b6e950142229548c"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialize");
}
initDB();