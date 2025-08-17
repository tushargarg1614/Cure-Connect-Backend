let path=require('path');
const donorModel = require('../models/donorModel');
let availedMedModel=require('../models/availedMedModel')
let cloudinary=require('cloudinary').v2
const jwt= require('jsonwebtoken')
require('dotenv').config();


cloudinary.config({
  cloud_name: 'dei6dn3k1', 
  api_key: '291342881824211', 
  api_secret: process.env.CLOUDINARY_API_SEC
})

let saveDonorDetail=async(req,res)=>{
     let profPic="";
     let adhaarPic="";
    //  console.log(req.body);
    //  console.log(req.files);

     if(req.files&&req.files.profilePic){
        profPic=req.files.profilePic.name;
        let profPicPath=path.join(__dirname,'..','uploads','profilePic',profPic);
        await req.files.profilePic.mv(profPicPath);
         await cloudinary.uploader.upload(profPicPath).then((pic)=>profPic=pic.secure_url)
     }else profPic='nopic.jpg';

      if(req.files&&req.files.adhaarPic){
        adhaarPic=req.files.adhaarPic.name;
        let adhaarPicPath=path.join(__dirname,'..','uploads','aadharPic',adhaarPic);
        await req.files.adhaarPic.mv(adhaarPicPath);
         await cloudinary.uploader.upload(adhaarPicPath).then((pic)=>adhaarPic=pic.secure_url)
     }else adhaarPic='nopic.jpg';

     let newDonor= new donorModel({
        ...req.body,
        profilePic:profPic,
        adhaarPic:adhaarPic
     })
     try{
     let donor= await newDonor.save()
        res.json({status:true,msg:'donor saved succesfully',obj:donor});
      }
      catch(err){
      res.json({status:false,error:err.message});
      }
}
let updateDonorDetail=async(req,res)=>{

  let email=req.body.email;
  let dataToUpdate={...req.body}
   let profPic="";
     let adhaarPic="";
    //  console.log(req.body);
    //  console.log(req.files);
    
    // console.log(req.files.profilePic);
    if(req.files&&req.files.profilePic){
        profPic=req.files.profilePic.name;
        let profPicPath=path.join(__dirname,'..','uploads','profilePic',profPic);
        await req.files.profilePic.mv(profPicPath);
         await cloudinary.uploader.upload(profPicPath).then((pic)=>profPic=pic.secure_url)
        dataToUpdate.profilePic=profPic;
     }

      if(req.files&&req.files.adhaarPic){
        adhaarPic=req.files.adhaarPic.name;
        let adhaarPicPath=path.join(__dirname,'..','uploads','aadharPic',adhaarPic);
        await req.files.adhaarPic.mv(adhaarPicPath);
         await cloudinary.uploader.upload(adhaarPicPath).then((pic)=>adhaarPic=pic.secure_url)
         dataToUpdate.adhaarPic=adhaarPic;
     }

  try{
     let updated= await  donorModel.updateOne({email:email},{$set:dataToUpdate});
      res.json({status:true,msg:'your details updated succesfully!',obj:updated})
  }catch(err){
    res.json({status:false,error:err.message});
  }
  
}

let availMed=async(req,res)=>{
let newMed= new availedMedModel(req.body);
await newMed.save()
.then((med)=>{
  res.json({status:true,msg:"medicine availed successfully",obj:med});
})
.catch((err)=>{
res.json({status:false,error:err.message});
})
}

let getAvailedMed=async(req,res)=>{
  let email=req.body.email;
  try{
  let allMed= await availedMedModel.find({email:email});
  // console.log(allMed);
  res.json({status:true,msg:'medicines found!',obj:allMed})
  } catch(err){
    res.json({status:false,error:err.message});
  }

}
let deleteMed=async(req,res)=>{
  try{
      await availedMedModel.deleteOne({_id:req.body.id});
      let allMed=await availedMedModel.find({email:req.body.email});
      res.json({status:true,msg:"med deleted successfuly!",obj:allMed})
  }
  catch(err){
    res.json({status:false,error:err.message});
  }
}
let updateMed=async(req,res)=>{
    let{email,medicine}=req.body;
  try{
    let updated = await availedMedModel.findOneAndUpdate({email,medicine},{$set:req.body});
    res.json({status:true,msg:'medicine updated successfully',obj:updated});
  }catch(err){
    res.json({status:false,error:err.message});
  }
}
let allDonors=async(req,res)=>{
    try{
        let users =await  donorModel.find();
        res.json({status:true,obj:users});
    }catch(err){
       res.json({status:false,error:err.message});
    }
}
let tokenDecode=async(req,res)=>{
  console.log('reached to tokendecode fun')
    try{
    let Token=req.headers['authorization'].split(' ')[1];
    let decoded=jwt.verify(Token,process.env.JWT_SECRET);
    console.log(decoded.email);
    let info= await donorModel.find({email:decoded.email})
    res.json({status:true,email:decoded.email,obj:info});
    }catch(err){
       res.json({status:false,error:err.message})
    }

}


module.exports={saveDonorDetail,updateDonorDetail,availMed,getAvailedMed,allDonors,updateMed,deleteMed,tokenDecode};