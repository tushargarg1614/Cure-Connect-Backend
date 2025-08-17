let express=require('express');
let router=express.Router();
let donorObj=require('../controllers/donor_controller')
let validateToken=require('../middlewares/validateToken')

router.post('/save',validateToken,donorObj.saveDonorDetail);
router.post('/updateDonor',validateToken,donorObj.updateDonorDetail);
router.post('/availMed',validateToken,donorObj.availMed);
router.post('/getAvailedMed',validateToken,donorObj.getAvailedMed);
router.post('/deleteMed',validateToken,donorObj.deleteMed);
router.post('/updateMed',validateToken,donorObj.updateMed);
router.post('/tokenDecode',validateToken,donorObj.tokenDecode);
router.post('/allDonors',validateToken,donorObj.allDonors);


module.exports=router;
