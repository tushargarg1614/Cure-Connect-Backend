let mongoose=require('mongoose');
let schema=new mongoose.Schema({
    email:{type:String,unique:true},
    name: String,
    age: Number,
    gender: String,
    curaddress: String,
    curcity: String,
    contact: Number,
    qualification: String,
    occupation: String,
    adhaarPic: String,
    profilePic: String,
    
})

let donorModel=mongoose.model('donors',schema);

module.exports=donorModel;