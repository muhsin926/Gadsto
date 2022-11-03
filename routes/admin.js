const express = require('express')
const router = express.Router()
const adminController = require ('../controller/admin-controller')
const app = express();

// get routes
router.get('/',adminController.login)
router.get('/user-manage',adminController.userManage)
router.get('/product-manage',adminController.productManage)
router.get('/addProduct',adminController.createProduct)
router.get('/category-manage',adminController. categoryMange)


// post routes
router.post('/admin-login',adminController.adminDologin)
router.post('/addProduct',adminController.addProdcut)
router.post('/deleteProduct/:id',adminController.deleteProduct)
router.post('/blockUser/:id',adminController.blockUser)
router.post('/unBlockUser/:id',adminController.unBlockUser)
router.post('/editProduct/:id',adminController.editProduct)
router.post('/updateProduct/:id', adminController.updateProduct)
router.post('/addCategory',adminController.addCategory)
router.post('/deleteCategory/:id',adminController.deleteCategory)

// app.route('/addProduct')
//         .get(adminController.createProduct)
//         .post(adminController.addProdcut)

module.exports=router