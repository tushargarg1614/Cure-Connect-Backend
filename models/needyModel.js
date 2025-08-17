let mongoose=require('mongoose');
let schema=new mongoose.Schema({
    emailid:{type:String,unique:true},
    contact:Number,
    name: String,
    dob: Date,
    gender: String,
    address: String
})

let needyModel=mongoose.model('needies',schema);

module.exports=needyModel;