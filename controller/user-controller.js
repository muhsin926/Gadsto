const userModel = require('../model/signupModel')
const bcrypt = require('bcrypt')
const productModel = require('../model/productModel')
const bannerModel = require('../model/bannerModel')

module.exports = {

    // User Landing Page
    home: async(req, res) => {
        const viewProduct = await productModel.find({delete:{$ne:true}})
        const allBanner = await bannerModel.find ({delete:{$ne:true}})
        if (req.session.login) {
            res.render('user/index', { login: req.session.login ,viewProduct, allBanner})
        } else {
            res.render('user/index', { login: req.session.login ,viewProduct, allBanner})
        }
    },

    // User Signup
    signup: (req, res) => {
        res.render('user/signup', { unique: req.session.uniqueErr })
    },

    // User Submit Signup
    dosignup: async (req,res) => {
        if (!req.session.login) {
            const { name, email, password } = req.body;
            const user = await userModel.findOne({ email });
            req.session.uniqueErr = false
            if (user) {
                req.session.uniqueErr = true
                return res.redirect('/signup');
            }
            const hashpass = await bcrypt.hash(password, 10);
            const newUser = new userModel({
                name,
                email,
                password: hashpass
            });
            try {
                await newUser.save();
                req.session.login = true
                res.redirect('/')
            } catch (error) {
                res.redirect('/login')
            }
        } else { res.redirect('user/user') }
    },

    // User Login
    login: (req, res) => {
        if (req.session.login) {
            res.redirect('/')
        } else {
            res.render('user/login', { email: req.session.emailErr, pass: req.session.passErr })
        }
    },

    //User Submit Login
    dologin: async (req, res) => {
        const { email, password } = req.body;
        req.session.emailErr = false
        req.session.passErr = false
        const user = await userModel.findOne({ $and: [{ email: email }, { type: 'User' }] });
        if (!user) {
            req.session.emailErr = true
            res.redirect('/login')
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.login = true
                res.redirect('/')
            } else {
                req.session.passErr = true
                res.redirect('/login')
            }
        }
    },

    //User Profile
    myProfile: (req,res) => {
        res.render('user/myProfile')
    },

    // Product View Page
    productView: async(req,res) => {
        const id = req.params.id
        const product = await productModel.findOne({_id:id})
        const relatedProduct = await productModel.find({category:product.category,delete:{$ne:true}})
        res.render('user/product-view',{login:req.session.login, product, relatedProduct })
    },

    // User Logout
    logoutUser: (req, res) => {
        req.session.destroy()
        res.redirect('/login')
    }
}

