const express = require('express')
const router = express.Router();
const userController = require('../controller/user-controller')
const userSession = require('../middileware/admin')


// Get routes
router.get('/', userController.home)
router.get('/signup',userController.signup)
router.get('/login',userController.login)
router.get('/logoutUser',userController.logoutUser)
router.get('/myProfile', userSession.userSession, userController.myProfile)

// post routes
router.post('/signup',userController.dosignup)
router.post('/login',userController.dologin)



module.exports=router;