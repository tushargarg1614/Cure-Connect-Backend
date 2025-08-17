let mongoose=require('mongoose');
let schema=new mongoose.Schema({
    email:{type:String,required:true},
    medicine:String,
    company: String,
    expiry: Date,
    packing: String,
    qty: Number,
    info: String,
    
})

let availedMedModel=mongoose.model('availedMeds',schema);

module.exports=availedMedModel;