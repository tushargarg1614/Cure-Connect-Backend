let express=require('express');
let router=express.Router();
let needyObj=require('../controllers/needy_controller')
let isValid=require('../middlewares/validateToken');
router.post('/extract',isValid,needyObj.extract_data_from_adhaar);
router.post('/save',isValid,needyObj.saveNeedy);
router.get('/getMeds',isValid,needyObj.getMeds);
router.get('/find-meds',isValid,needyObj.findMeds);
router.post('/tokenDecode',isValid,needyObj.tokenDecode);
router.post('/allNeedies',isValid,needyObj.allNeedies);




module.exports=router;