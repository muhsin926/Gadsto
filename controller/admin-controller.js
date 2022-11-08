const { dologin } = require("./user-controller")
const userModel = require('../model/signupModel')
const productModel = require('../model/productModel')
const categoryModel = require('../model/categoryModel')
const bannerModel = require('../model/bannerModel')
const bcrypt = require('bcrypt')
const session = require("express-session")

module.exports = {

    // Admin Login Page
    login: (req, res) => {
        if (req.session.adminLogin) {
            res.render('admin/index')
        } else { res.render("admin/login") }
    },

    // Admin Submit Login
    adminDologin: async (req, res) => {
        const { email, password } = req.body;
        const admin = await userModel.findOne({ $and: [{ email: email }, { type: 'admin' }] })
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
                req.session.adminLogin = true
                res.render("admin/index")
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/admin')
        }
    },

    // User Manage
    userManage: async (req, res) => {
        allUsers = await userModel.find({ type: { $ne: 'admin' } })
        res.render('admin/user-management', { allUsers },)
    },

     //block User
     blockUser: async (req, res) => {
        const id = req.params.id;
        await userModel.findByIdAndUpdate({ _id: id }, { $set: { type: "Blocked" } })
            .then(() => {
                res.redirect('/admin/user-manage')
            })
    },

    // Unblock User
    unBlockUser: async (req, res) => {
        const id = req.params.id
        await userModel.findByIdAndUpdate({ _id: id }, { $set: { type: "User" } })
            .then(() => {
                res.redirect('/admin/user-manage')
            })
    },

    //Products Management
    productManage: async (req, res) => {
        allProducts = await productModel.find({ delete: { $ne: true } })
        res.render('admin/product-manage', { allProducts })
    },

    // Render Add Product Page 
    createProduct: async (req, res) => {
        const categories = await categoryModel.find({ delete: { $ne: true } })
        res.render('admin/addproduct', { categories })
    },

    // Add Product
    addProdcut: async (req, res) => {
        const { category, name, description, price, stock } = (req.body)
        const image = (req.file);
        const newProduct = productModel({
            category,
            name,
            description,
            price,
            stock,
            image: image.filename
        })
        await newProduct.save()
        res.redirect('/admin/product-manage')
    },

    //Delete product
    deleteProduct: async (req, res) => {
        const id = req.params.id;
        await productModel.findByIdAndUpdate({ _id: id }, { $set: { delete: true } })
            .then(() => {
                res.redirect('/admin/product-manage')
            })

    },

     //Edit Product
     editProduct: async (req, res) => {
        const id = req.params.id
        const categories = await categoryModel.find({ delete: { $ne: true } })
        const product = await productModel.findOne({ _id: id })
        if (product) {
            res.render('admin/editproduct', { product , categories })
        } 
    },

    //update product
    updateProduct: async (req, res) => {
        const id = req.params.id
        const image = req.file
        const { category, name, description, price, stock } = req.body
        const product = await productModel.findByIdAndUpdate({ _id: id },{$set:{
                    category,
                    name,
                    description,
                    price,
                    stock,
                    image: image.filename
                }
            })
        await product.save()
            .then(() => {
                res.redirect('/admin/product-manage')
            })

    },


    //category Management
    categoryMange: async (req, res) => {
        const categories = await categoryModel.find({ delete: { $ne: true } })
        res.render('admin/category', { categories })
    },

    //new Category
    addCategory: async (req, res) => {
        const { category } = req.body
        const newCategory = await categoryModel({ category })
        await newCategory.save()
            .then(() => {
                res.redirect('/admin/category-manage')
            })

    },

    //delete category
    deleteCategory: async (req, res) => {
        const id = req.params.id
        const deleteCategory = await categoryModel.findByIdAndUpdate({ _id: id }, { $set: { delete: true } })
        await deleteCategory.save()
            .then(() => {
                res.redirect('/admin/category-manage')
            })
    },

    //Banner Management
    bannerManage: async(req,res) => {
        const allBanner = await bannerModel.find( {delete:{$ne:true}} )
        const categories = await categoryModel.find( {delete:{$ne:true}} )
        res.render('admin/banner-manage', {allBanner,categories} )
    },

    //Create a new banner
    newBanner: async (req,res) =>{
        const {category,title,text} = req.body
        const image = req.file
        const newBanner = await bannerModel({
            category,
            title,
            text,
            imageUrl:image.filename
        })
        await newBanner.save()
        .then(()=>{
            res.redirect('/admin/banner-manage')
        })
    },

    // Delete Banner 
    deleteBanner: async (req,res) => {
        const id = req.params.id
        const deleteBanner = await bannerModel.findOneAndUpdate({_id:id},{$set: {delete:true} })
        deleteBanner.save()
        .then(()=>{
            res.redirect('/admin/banner-manage')
        })
    },

    // Edit Banner
    editBanner: async (req,res) => {
        const id = req.params.id
        const banner = await bannerModel.findOne({_id:id})
        const categories = await categoryModel.find( {delete:{$ne:true}} )
        res.render('admin/editBanner', {banner, categories})
    },

    // Update Banner
    updateBanner: async (req,res) => {
        const id = req.params.id 
        const { category,title,text} = req.body
        const image = req.file
        const banner = await bannerModel.findByIdAndUpdate({_id:id},{$set:{
                category,
                title,
                text,
                imageUrl:image.filename
        }});
        banner.save()
        .then(()=>{
            res.redirect('/admin/banner-manage', )
        })
    },

    //Admin Logout
    adminLogout: (req,res) => {
        req.session.destroy()
        res.redirect('/admin')
    }

}