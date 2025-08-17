let mongoose=require('mongoose');
let schema=new mongoose.Schema({
    email: {type:String,unique:true,required:true},
    password: String,
    userType: String,
    status:Number
})

let userModel=mongoose.model('users',schema);
module.exports=userModel;