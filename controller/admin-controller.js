const { dologin } = require("./user-controller")
const userModel = require('../model/signupModel')
const productModel = require('../model/productModel')
const categoryModel = require('../model/categoryModel')
const bcrypt = require('bcrypt')
const session = require("express-session")

module.exports = {

    // Admin login page
    login: (req, res) => {
        if (req.session.adminLogin) {
            res.render('admin/index')
        } else { res.render("admin/login") }
    },

    // Admin submit
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

    // User manage
    userManage: async (req, res) => {
        allUsers = await userModel.find({ type: { $ne: 'admin' } })

        res.render('admin/user-management', { allUsers },)
    },

    //Products Management
    productManage: async (req, res) => {
        allProducts = await productModel.find({ delete: { $ne: true } })
        res.render('admin/product-manage', { allProducts })
    },

    //product management
    createProduct: async (req, res) => {
        const categories = await categoryModel.find({ delete: { $ne: true } })
        res.render('admin/addproduct', { categories })
    },

    // Add product
    addProdcut: async (req, res) => {
        console.log(req.body)
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
    //category Management
    categoryMange: async (req, res) => {
        const categories = await categoryModel.find({ delete: { $ne: true } })
        res.render('admin/category', { categories })
    },

    //delete product
    deleteProduct: async (req, res) => {
        const id = req.params.id;
        await productModel.findByIdAndUpdate({ _id: id }, { $set: { delete: true } })
            .then(() => {
                res.redirect('/admin/product-manage')
            })

    },

    //block user
    blockUser: async (req, res) => {
        const id = req.params.id;
        await userModel.findByIdAndUpdate({ _id: id }, { $set: { type: "Blocked" } })
            .then(() => {
                res.redirect('/admin/user-manage')
            })
    },

    // Unblock user
    unBlockUser: async (req, res) => {
        const id = req.params.id
        await userModel.findByIdAndUpdate({ _id: id }, { $set: { type: "User" } })
            .then(() => {
                res.redirect('/admin/user-manage')
            })
    },

    //edit Product
    editProduct: async (req, res) => {
        const id = req.params.id
        const categories = await categoryModel.find({ delete: { $ne: true } })
        const product = await productModel.findOne({ _id: id })
        if (product) {
            res.render('admin/editproduct', { product , categories })
        } else {
            console.log("not working");
        }
    },

    //update product
    updateProduct: async (req, res) => {
        const id = req.params.id
        const image = req.file
        console.log(req.body)
        const { category, name, description, price, stock } = req.body
        const product = await productModel.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
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

    //Admin Logout
    adminLogout: (req,res) => {
        req.session.destroy()
        res.redirect('/admin')
    }

}