let express=require('express');
let app=express();
let userRouter=require('./routes/user_route');
let donorRouter=require('./routes/donor_route');
let needyRouter=require('./routes/needy_route');
let mongoose=require('mongoose');
let fileUpload=require('express-fileupload');
let cors =require('cors');
require('dotenv').config();


app.listen("2007",()=>{
    console.log('listning at port 2007')
})

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(fileUpload());
app.use(cors());

let conStr=`mongodb+srv://tushargarg50797:${process.env.ATLAS_PWD}@cluster0.ouhq4np.mongodb.net/CureConnectDB?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(conStr).then(()=>{
  console.log('db connected successfully!')
   
})
.catch((err)=>{console.log(err.message)})

app.use('/donor',donorRouter);
app.use('/needy',needyRouter);
app.use('/user',userRouter);
app.get('/',(req,res)=>{
res.send('wellcome to / route');
})
