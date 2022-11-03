const express = require('express')
const mongoose = require('./configuration/connection')
const bodyParser = require('body-parser')
const path = require('path')
const session =require('express-session')
const fielUpload = require('express-fileupload')
const multer = require('multer')

const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const app = express();

//view engin setup
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use("images",express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended:true}))

// Cash controller
app.use( (req,res,next) =>{
    res.header('Cache-Control','private ,no-cache, no-store, must-revalidate')
    next()
  })

  // Multer (file upload setup)
const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, "public/images");
  },
  filename: (req,file,cb) => {
    cb(null,file.fieldname + Date.now() + path.extname(file.originalname))
    
  },
});
// const upload = multer({ storage: storage})
app.use(multer({dest: "public/images", storage: storage}).single("image"))



//session setup
app.use(session({
    secret:"key",
    resave:false,
    saveUninitialized:true,
   }));

// Main routes
app.use('/', userRouter)
app.use('/admin', adminRouter)


//server create
app.listen(4000, console.log('server runnig on http://localhost:4000'))

