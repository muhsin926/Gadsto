const express = require('express')
const router = express.Router();
const userController = require('../controller/user-controller')
const userSession = require('../middileware/sessionControl')
const authControll = require('../controller/auth-controll')


router
    .route('/')
    .get(userController.home)
    .patch(userSession.userSession, userController.addToWishlist)


router
    .route('/login')
    .get(authControll.login)
    .post(authControll.dologin)


router
    .route('/signup')
    .get(authControll.signup)
    .post(authControll.dosignup)


router
    .route('/logoutUser')
    .get(userController.logoutUser)


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


router
    .route('/my-profile')
    .get(userSession.userSession, userController.myProfile)
    .post(userController.editUser)


router
    .route('/address-manage')
    .get(userSession.userSession, userController.addressManage)
    .post(userController.newAddress)
    .delete(userController.deleteAddress)


router  
    .route('/edit-address')
    .get(userController.editAddress)


router
    .route('/order-view')
    .get(userController.orderView)
    .patch(userController.cancelOrder)


router
    .route('/product-view')
    .get(userController.productView)
    .post( userSession.userSession, userController.addToCart)


router
    .route('/wishlist')
    .get(userSession.userSession, userController.wishList)
    .post(userController.wishToCart)
    .delete( userController.removeWishlist )


router
    .route('/shoping-cart/')
    .get(userSession.userSession, userController.shopingCart )
    .patch( userController.changeProductQuantity )
    .delete( userController.deleteCartProduct )
    
router
    .route('/checkout')
    .get(userSession.userSession, userController.checkout)
    .post(userController.addAddress)
    .patch(userController.checkout)

router
    .route('/check-coupon')
    .post(userController.checkCoupon)

router
    .route('/payment-verify')
    .get( userController.orderConfirm)
    .post(userController.paymentVerification)

router
    .route('/order-success')
    .get(userController.orderSuccess)

    
module.exports=router;