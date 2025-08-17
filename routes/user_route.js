let express=require('express');
let router=express.Router();
let userObj=require('../controllers/user_controller')

router.post('/userSignup',userObj.userSignup);
router.post('/userLogin',userObj.userLogin);
router.post('/allUsers',userObj.allUsers);
router.post('/updateStatus',userObj.updateStatus);
router.post('/sendMail',userObj.sendMail);


module.exports=router;