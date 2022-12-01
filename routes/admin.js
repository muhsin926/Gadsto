const express = require('express')
const { adminDologin } = require('../controller/admin-controller')
const router = express.Router()
const adminController = require('../controller/admin-controller')
const authControl = require('../middileware/sessionControl')
const { route } = require('./user')


// Router Chain

router
    .route('/')
    .get(adminController.login)

router
    .route('/user-manage')
    .get(authControl.sessionControl, adminController.userManage)
    .post(adminController.blockUser)
    .patch(adminController.unBlockUser)

router
    .route('/addProduct')
    .get(authControl.sessionControl, adminController.createProduct)
    .post(adminController.addProdcut)
    
    router
    .route('/product-manage')
    .get(authControl.sessionControl, adminController.productManage)
    .post(adminController.editProduct)
    .delete( adminController.deleteProduct)

router
    .route('edit-product')
    .get(adminController.editProduct)
    .post(adminController.updateProduct)


router
    .route('/category-manage')
    .get( authControl.sessionControl, adminController.categoryMange)
    .post(adminController.addCategory)
    .delete(adminController.deleteCategory)

router
    .route('/banner-manage')
    .get(authControl.sessionControl, adminController.bannerManage)
    .post(adminController.newBanner)
    .delete(adminController.deleteBanner)

router
    .route('/editBanner/:id')
    .get(authControl.sessionControl, adminController.editBanner)

router
    .route('/order-manage')
    .get(authControl.sessionControl,adminController.orderManage)
    .post(adminController.changeStatus)
    
router
    .route('/coupen-manage')
    .get(authControl.sessionControl, adminController.coupenManage)
    .post(adminController.addCoupen)

router
    .route('/invoice/:orderId')
    .get(adminController.printBill)

router
    .route('/sales-report')
    .get(adminController.salesReport)

router
    .route('/admin-session')
    .get(adminController.adminLogout)
    .post(adminController.adminDologin)


module.exports = router