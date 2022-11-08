const express = require('express')
const router = express.Router()
const adminController = require('../controller/admin-controller')
const authControl = require('../middileware/sessionControl')
// const app = express();

// get routes
router.get('/', adminController.login)
router.get('/user-manage', authControl.sessionControl, adminController.userManage)
router.get('/product-manage', authControl.sessionControl, adminController.productManage)
router.get('/category-manage', authControl.sessionControl, adminController.categoryMange)
router.get('/banner-manage', authControl.sessionControl, adminController.bannerManage)
router.get('/adminLogout', adminController.adminLogout)


// post routes
router.post('/admin-login', adminController.adminDologin)
router.post('/deleteProduct/:id', adminController.deleteProduct)
router.post('/blockUser/:id', adminController.blockUser)
router.post('/unBlockUser/:id', adminController.unBlockUser)
router.get('/editProduct/:id', adminController.editProduct)
router.post('/updateProduct/:id', adminController.updateProduct)
router.post('/addCategory', adminController.addCategory)
router.post('/deleteCategory/:id', adminController.deleteCategory)
router.post('/newBanner', adminController.newBanner)
router.post('/deleteBanner/:id', adminController.deleteBanner)

// Router Chain
router
    .route('/addProduct')
    .get(authControl.sessionControl, adminController.createProduct)
    .post(adminController.addProdcut)

router
    .route('/editBanner/:id')
    .get(authControl.sessionControl, adminController.editBanner)
    
module.exports = router