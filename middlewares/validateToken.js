let jwt=require('jsonwebtoken');

let isValid=(req,res,next)=>{
  let token=req.headers['authorization'].split(' ')[1];
  try{
  let decodedToken=jwt.verify(token,process.env.JWT_SECRET);
  console.log(decodedToken);
  next();
  }catch(err){
    res.json({error:"token expired! please login again"});
  }
}
module.exports=isValid;

// let jwt = require('jsonwebtoken');

// let isValid = (req, res, next) => {
//   try {
//     let token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.status(401).json({ error: "Token missing" });

//     // Decode without verify
//     let decoded = jwt.decode(token, { complete: true });
//     console.log("Decoded token: ", decoded);

//     let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Verified token:", decodedToken);
//     next();
//   } catch (err) {
//     console.log("JWT error: ", err);
//     res.status(401).json({ error: "Token expired! Please login again" });
//   }
// };
// module.exports = isValid;
