const express = require('express')
const mongoose = require('./configuration/connection')
const path = require('path')
const session =require('express-session')
const fielUpload = require('express-fileupload')
const multer = require('multer')
const multerStorage = require('./middileware/multer')
const cors = require('cors')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const app = express();

//view engin setup
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}))
app.use(cors())

// Cash controller
app.use( (req,res,next) =>{
    res.header('Cache-Control','private ,no-cache, no-store, must-revalidate')
    next()
  })

// Multer (file upload setup)
app.use(multer({dest: "public/images", storage: multerStorage}).single("image"))

//session setup
app.use(session({
    secret:"key",
    resave:false,
    saveUninitialized:true,
   }));

// Main routes
app.use('/admin', adminRouter)
app.use('/', userRouter)

// Page Not Found 404
app.use('*',(req,res)=>{
  res.redirect('/pageNotFound')
})


//server create
app.listen(4000, console.log('server runnig on http://localhost:4000'))

