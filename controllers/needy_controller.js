let path = require('path');
var cloudinary = require("cloudinary").v2;
const { GoogleGenerativeAI } = require("@google/generative-ai");
var needyModal=require('../models/needyModel');
var donorModel=require('../models/donorModel');
const availedMedModel = require('../models/availedMedModel');
const jwt= require('jsonwebtoken')
// require('dotenv').config();

cloudinary.config({
  cloud_name: 'dei6dn3k1', 
  api_key: '291342881824211', 
  api_secret: process.env.CLOUDINARY_API_SEC
})


const genAI = new GoogleGenerativeAI(process.env.GENAI_API);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function RajeshBansalKaChirag(imgurl)
{
const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format if its front side of aadhar then output should be {adhaar_number:'', name:'', gender:'', dob: 'yyyy-mm-dd'}.if its backside of aadhar then it should be {address:''} only. Dont give output as string."   
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())
            
            const cleaned = result.response.text().replace(/```json|```/g, '').trim();
            console.log(cleaned)
            const jsonData = JSON.parse(cleaned);
            console.log(jsonData);

    return jsonData

}


let extract_data_from_adhaar = async (req, res) => {
  try {
    // let frontImgUrl="";
    let aadharUrl="";
    let aadhar="";
    if(req.files.frontImage){
      aadhar=req.files.frontImage;
    }else aadhar=req.files.backImage;
        // let frontimg = req.files.frontImage;
    // let mimetype = frontimg.mimetype;
    let imgPath = path.join(__dirname, '..', 'uploads', 'aadhar', aadhar.name);

    await aadhar.mv(imgPath); // Save file
    await cloudinary.uploader.upload(imgPath).then((pic)=>{
         aadharUrl=pic.secure_url;
        })
        let jsonRes=await RajeshBansalKaChirag(aadharUrl);
        console.log(jsonRes);
        res.json({status:true,msg:"data extracted!",obj:jsonRes});
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.json({ status: false, error: err.response?.data || err.message });
  }
};

let saveNeedy=async(req,res)=>{
 let newNeedy= new needyModal(req.body);
 try{
  let needy=await newNeedy.save();
    res.json({status:true,msg:"details saved successfully",obj:needy})
 }catch(err){
        res.json({status:false,error:err.message});
 }
}

let updateNeedy=async(req,res)=>{
  let email=req.body.emailid;
  try{
    let updated= await needyModal.updateOne({emailid:email},{$set:req.body});
    res.json({status:true,msg:'user updated!',obj:updated});
    
  }catch(err){
    res.json({status:false,error:err.message});
  }
}

// let getMeds=async(req,res)=>{
//   try{
//    let cities=await availedMedModel.aggregate([{
//     $lookup:{
//       from:'donors',
//       localField:'email',
//       foreignField:'email',
//       as:'donorInfo'
//     }
//    },
//    {
//       $unwind:"$donorInfo",
//     },
//     {
//       $group:{
//         _id:'$donorInfo.curcity'
//       }
//     },
//     {
//       $project:{
//         _id:0,
//         city:"$_id"
//       }
//     }
//   ])
//   res.json({status:true,msg:'cities fetched',obj:cities});
// }
// catch(err){
//   res.json({status:false,error:err.message});
// }

  
// }

let getMeds=async(req,res)=>{
  try{
    let allMeds= await availedMedModel.aggregate([
      {
        $lookup:{
          from:'donors',
          localField:'email',
          foreignField:'email',
          as:'donorInfo'
        }
      },
      {
        $unwind:'$donorInfo'
      }
    ])
    res.json(allMeds);
  }catch(err){
    res.status(500).json(err.message)
  }

    
}

let findMeds=async(req,res)=>{
  let { city, medName }=req.query;
  console.log("city and med name :",city,medName);
  try{
  let emails=await donorModel.distinct('email',{curcity:city});
  if(emails.length==0){
    console.log("no donor from this city")
    return res.json([]);
  }else console.log('cities:',emails);
  let meds = await availedMedModel.aggregate([
  {
    $match: {
      email: { $in: emails },
      medicine: { $regex: `^${medName.trim()}$`, $options: "i" }
    }
  },
  {
    $lookup: {
      from: "donors", 
      localField: "email",
      foreignField: "email",
      as: "donorInfo"
    }
  },
  {
    $unwind: "$donorInfo" 
  }
]);
  console.log('meds sent:',meds);
  res.json(meds)
}
catch(err){
  console.log('err sent');
 res.status(500).json({ error: "Server error", details: err.message });

  
}

}
let tokenDecode=async(req,res)=>{
  console.log('reached to tokendecode fun')
    try{
    let Token=req.headers['authorization'].split(' ')[1];
    let decoded=jwt.verify(Token,process.env.JWT_SECRET);
    console.log(decoded.email);
    let info= await needyModal.find({emailid:decoded.email})
    res.json({status:true,email:decoded.email,obj:info});
    }catch(err){
       res.json({status:false,error:err.message})
    }

}

let allNeedies=async(req,res)=>{
    try{
        let users =await  needyModal.find();
        res.json({status:true,obj:users});
    }catch(err){
       res.json({status:false,error:err.message});
    }
}

module.exports = { extract_data_from_adhaar,saveNeedy,updateNeedy,getMeds,allNeedies,findMeds,tokenDecode};
