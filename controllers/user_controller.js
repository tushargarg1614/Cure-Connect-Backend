let userModel=require('../models/userModel');
let jwt=require('jsonwebtoken');
let bcrypt = require('bcrypt');
let nodeMailer=require('nodemailer');



let userSignup=async(req,res)=>{

    let {password,email}=req.body;
    let saltRound=10;
    try{
   let hashed =await bcrypt.hash(password,saltRound);
    let user=new userModel({...req.body,status:1,password:hashed});
    
       let savedUser= await user.save();
       
       let transporter = nodeMailer.createTransport({
       service: 'gmail',
       auth: {
       user: 'tushargarg50797@gmail.com', 
       pass: process.env.NODEMAILER_PWD 

  }
 
});

       let mailOptions = {
       from: `"CureConnect" <tushargarg50797@gmail.com>`, 
       to: email, 
       subject: 'cure connect signup succesfull', 
       text: `Welcome to CureConnect! We're excited to have you on board.

Your account has been successfully created, and you can now access all the features to connect, share, and manage medicine donations effectively.

Here’s a quick overview to get started:
- Update your profile to ensure accurate information.
- Browse and donate medicines to those in need.
- Track donations and requests in your dashboard.

If you have any questions or need assistance, feel free to reach out to our support team at support@cureconnect.com.

Thank you for joining our community!

Best regards,
The CureConnect Team`, 
       
   };
   transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});
       res.json({status:true,msg:'you are signed up succesfully!',obj:savedUser})
    }
    catch(err){
        res.json({status:false,error:err.message});
    }


}
let userLogin=async(req,res)=>{
   let {email,password}=req.body;
   try{
   let user= await userModel.find({email:email});
   if(user.length!=0){
    let match;
    if(user[0].userType=='admin'){
        match= user[0].password===password
        console.log(`pwd from user =${password} and from db= ${user[0].password}`)
         console.log("if= ",match);
    }else {
          console.log("else= ",match);
         match= await bcrypt.compare(password,user[0].password);
    }
    
     if(user[0].status===0){
        res.json({status:false,error:'you have been blocked By The Admin!'});
        return;
      }else if(!match){
         
        res.json({status:false,error:'incorrect password!'});
        return;
      }
   
    let token=jwt.sign({email:user[0].email,role:user[0].userType},process.env.JWT_SECRET,{expiresIn:'20m'});

    console.log("token sent from node");
   res.json({status:true,msg:'you logged in successfully',obj:user[0],token:token});

   console.log('status =',user[0].status);
   }
//    else if(user.length!=0&&user[0].status==0){
//         res.json({status:false,error:'you have been blocked By The Admin!'});
//    }
   else res.json({status:false,error:'incorrect email address or password!'})
   }catch(err){
    res.json({status:false,error:err.message})
   }
}
let allUsers=async(req,res)=>{
    try{
        let users =await  userModel.find();
        res.json({status:true,obj:users});
    }catch(err){
       res.json({status:false,error:err.message});
    }
}

let updateStatus=async(req,res)=>{
    let {id,status}=req.body;
    try{
        await userModel.updateOne({_id:id},{$set:{status:status}});
        let users=await userModel.find();
        // console.log(users);
         res.json({status:true,obj:users});
    }
    catch(err){
         res.json({status:false,error:err.message});
    }
}

let sendMail=async(req,res)=>{

    let {from,subject,msg}=req.body;
    console.log(from +" "+subject+" "+msg);
try{
const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "tushargarg50797@gmail.com",
    pass: process.env.NODEMAILER_PWD,
  },
});

  const info = await transporter.sendMail({
    from: `"cure-connect contact form" <tushargarg@gmail.com> `,
    to: "tushargarg@gmail.com",
    subject: subject,
    text: `from: ${from} \n\n ${msg}`,
     replyTo: from 

  });
  console.log("Message sent:", info.messageId);
  res.json({status:true,msg:'message sent to CureConnect team!'})
}
catch(err){
    res.json({status:false,error:err.message})
}

  

  

}




module.exports={userSignup,userLogin,allUsers,updateStatus,sendMail};