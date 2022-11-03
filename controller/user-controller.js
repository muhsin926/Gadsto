const userModel = require('../model/signupModel')
const bcrypt = require('bcrypt')
const productModel = require('../model/productModel')

module.exports = {
    // User landing page
    home: async(req, res) => {
        const viewProduct = await productModel.find({})
        if (req.session.login) {
            res.render('user/index', { login: req.session.login ,viewProduct })
        } else {
            res.render('user/index', { login: req.session.login ,viewProduct})
        }
    },

    // User signup
    signup: (req, res) => {
        res.render('user/signup', { unique: req.session.uniqueErr })
    },

    // User login
    login: (req, res) => {
        if (req.session.login) {
            res.redirect('/')
        } else {
            res.render('user/login', { email: req.session.emailErr, pass: req.session.passErr })
        }
    },

    // User submit signup
    dosignup: async (req, res) => {
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
                console.log(req.body);
                req.session.login = true
                res.redirect('/')
            } catch (error) {
                res.redirect('/login')
            }
        } else {
            res.redirect('user/user')
        }
    },

    //User submit login
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

    // User logout
    logoutUser: (req, res) => {
        req.session.destroy()
        res.redirect('/login')
    }
}

