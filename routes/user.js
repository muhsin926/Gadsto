const express = require('express')
const router = express.Router();
const userController = require('../controller/user-controller')
const userSession = require('../middileware/sessionControl')
const authControll = require('../controller/auth-controll')


// Get routes
router.get('/', userController.home)
router.get('/logoutUser',userController.logoutUser)
router.get('/myProfile', userSession.userSession, userController.myProfile)
router.get('/productView/:id', userController.productView)
router.get('/checkout', userSession.userSession, userController.checkout)
router.get('/wishList',userSession.userSession, userController.wishList)
router.get('/addToWishlist/:productId',userSession.userSession, userController.addToWishlist)
router.get('/remove-from-wishlist/:porductId', userController.removeWishlist)
router.post('/order-conform', userController.orderConfirm)
router.get('/order-view',userController.orderView)
router.get('/pageNotFound',userController.pageNotFound)
router.get('/address-manage',userSession.userSession, userController.addressManage)
router.get('/delelte-address/:id',userController.deleteAddress)
router.get('/edit-address/:indexof',userController.editAddress)
// post routes


router.post('/editUser',userController.editUser)
router.post('/addToCart/:id',userSession.userSession, userController.addToCart)
router.post('/add-address',userController.addAddress)
router.post('/change-address',userController.checkout)
router.post('/verity-payment',userController.paymentVerification)
router.get('/order-success',userController.orderSuccess)

router
    .route('/signup')
    .get(userController.signup)
    .post(authControll.dosignup)

router
    .route('/login')
    .get(userController.login)
    .post(userController.dologin)

router
    .route('/address-manage')
    .post(userController.newAddress)

router
    .route('/shoping-cart/')
    .get(userSession.userSession, userController.shopingCart )
    .patch( userController.changeProductQuantity )
    .delete( userController.deleteCartProduct )
    
router
    .route('/check-coupen')
    .post(userController.checkCoupen)

router
    .route('/wishlist')
    .get(userSession.userSession, userController.wishList)
    .post(userController.wishToCart)
    .delete( userController.removeWishlist )

router
    .route('/otp')
    .post(authControll.veryfy)
    .get(authControll.resendOTP)

router
    .route('/shop')
    .get(userController.shop )

router
    .route('/contact')
    .get(userController.contact)

    
module.exports=router;