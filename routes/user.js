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
router.get('/checkout', userSession.userSession, userController.checkout)
router.get('/shoping-cart-delete-product/:productId', userController.deleteCartProduct)
router.get('/wishList',userSession.userSession, userController.wishList)
router.get('/addToWishlist/:productId',userSession.userSession, userController.addToWishlist)
router.get('/remove-from-wishlist/:porductId', userController.removeWishlist)
router.post('/order-conform/:addressId', userController.orderConform)
router.get('/order-view',userController.orderView)
router.get('/pageNotFound',userController.pageNotFound)
// post routes
router.post('/signup',userController.dosignup)
router.post('/login',userController.dologin)
router.post('/editUser',userController.editUser)
router.post('/addToCart/:id',userSession.userSession, userController.addToCart)

router
    .route('/address')
    .post(userController.newAddress)

router
    .route('/shoping-cart/')
    .get(userSession.userSession, userController.shopingCart)



module.exports=router;