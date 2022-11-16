const express = require('express')
const router = express.Router();
const userController = require('../controller/user-controller')
const userSession = require('../middileware/sessionControl')


// Get routes
router.get('/', userController.home)
router.get('/signup',userController.signup)
router.get('/login',userController.login)
router.get('/logoutUser',userController.logoutUser)
router.get('/myProfile', userSession.userSession, userController.myProfile)
router.get('/productView/:id', userController.productView)
router.get('/shoping-cart', userSession.userSession, userController.shopingCart)
router.get('/change-product-quantity/:cartId/:productId/:count', userController.changeProductQuantity)
router.get('/place-order', userController.placeOrder)

// post routes
router.post('/signup',userController.dosignup)
router.post('/login',userController.dologin)
router.post('/editUser',userController.editUser)
router.post('/addToCart/:id',userController.addToCart)



module.exports=router;