const userModel = require('../model/signupModel')
const bcrypt = require('bcrypt')
const productModel = require('../model/productModel')
const bannerModel = require('../model/bannerModel')
const cartModel = require('../model/cartModel')
const addressModel = require('../model/addressModel')
const wishListModel = require('../model/wishListModel')
const orderModel = require('../model/orderSchema')

module.exports = {

    // User Landing Page
    home: async (req, res) => {
        const viewProduct = await productModel.find({ delete: { $ne: true } })
        const allBanner = await bannerModel.find({ delete: { $ne: true } })
        if (req.session.login) {
            res.render('user/index', { login: req.session.login, viewProduct, allBanner })
        } else {
            res.render('user/index', { login: req.session.login, viewProduct, allBanner })
        }
    },

    // User Signup
    signup: (req, res) => {
        res.render('user/signup', { unique: req.session.uniqueErr })
    },

    // User Submit Signup
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
                req.session.userId = user._id
                res.redirect('/')
            } else {
                req.session.passErr = true
                res.redirect('/login')
            }
        }
    },


    // Product View Page
    productView: async (req, res) => {
        const id = req.params.id
        
        const product = await productModel.findOne({ _id: id })
        if (product){
            const relatedProduct = await productModel.find({ category: product.category, delete: { $ne: true } })
        res.render('user/product-view', { login: req.session.login, product, relatedProduct })
        }else{
            res.redirect('/login')
        }
        
        
        
       
    },


    //User Profile
    // =================
    myProfile: async (req, res) => {
        const id = req.session.userId
        const user = await userModel.findOne({ _id: id })
        req.session.userName = user.name
        res.render('user/myProfile', { user })
    },


    // Edit and Update user 
    // =====================
    editUser: async (req, res) => {
        const { name, email } = req.body
        const id = req.session.userId
        const updateUser = await userModel.findByIdAndUpdate({ _id: id },
            { $set: { name: name, email: email } })
        updateUser.save()
            .then(() => {
                res.redirect('/myProfile')
            })
    },

    // Shoping Cart
    shopingCart: async (req, res) => {
        const ownerId = req.session.userId
        const cartItems = await cartModel.findOne({ owner: ownerId }).
            populate('items.product').
            exec((err, allCart) => {
                if (err) {
                    return console.log(err);
                }
                res.render('user/shoping-cart', { login: req.session.login, allCart })
            })

    },

    // Add To Cart
    addToCart: async (req, res) => {
        const productId = req.params.id
        console.log(req.session.userId);
        const user = await cartModel.findOne({ owner: req.session.userId })
        const product = await productModel.findOne({ _id: productId })
        const cartTotal = product.price
        if (!user) {
            const addToCart = await cartModel({
                owner: req.session.userId,
                items: [{ product: productId, totalPrice: product.price }],
                cartTotal: cartTotal
            })
            addToCart.save()
                .then(() => {
                    res.redirect('/productView/' + productId)
                })
        } else {
            const existProduct = await cartModel.findOne({ owner: req.session.userId, 'items.product': productId })
            if (existProduct != null) {
                await cartModel.findOneAndUpdate({ owner: req.session.userId, 'items.product': productId },
                    {
                        $inc: {
                            'items.$.quantity': 1,
                            'items.$.totalPrice': product.price,
                            cartTotal: cartTotal
                        }
                    })
                    .then(() => {
                        res.redirect('/productView/' + productId)
                    })
            } else {
                const addToCart = await cartModel.findOneAndUpdate({ owner: req.session.userId },
                    { $push: { items: { product: productId, totalPrice: product.price } }, $inc: { cartTotal: cartTotal } })
                addToCart.save()
                    .then(() => {
                        res.redirect('/productView/' + productId)
                    })
            }
        }
    },

    changeProductQuantity: async (req, res) => {
        const { cartId, productId, count } = req.params
        const product = await productModel.findOne({ _id: productId })
        if (count == 1) var productPrice = product.price;
        else { var productPrice = -product.price }
        const cart = await cartModel.findOneAndUpdate({ _id: cartId, 'items.product': productId },
            { $inc: { 'items.$.quantity': count, 'items.$.totalPrice': productPrice, cartTotal: productPrice } })
            .then(() => {
                res.redirect('/shoping-cart')
            })

    },

    // Place Order 
    checkout: async (req, res) => {
        const userId = req.session.userId
        const addresses = await addressModel.findOne({ user: userId })
        let address
        if (addresses) {
            address = addresses.address;
        } else {
            address = []
        }
        const cartItems = await cartModel.findOne({ owner: userId })
        if (cartItems){
        res.render('user/checkout', { login: req.session.login, address, cartItems })
        }else{
            res.redirect('/login')
        }

    },

    //new Address
    newAddress: async (req, res) => {
        const userId = req.session.userId
        const existAddress = await addressModel.findOne({ user: userId })
        if (existAddress) {
            await addressModel.findOneAndUpdate({ user: userId },
                {
                    $push: {
                        address: [req.body]
                    }
                }).then(() => {
                    res.redirect('/checkout')
                })
        } else {
            const addAddress = await addressModel({
                user: userId,
                address: [req.body]
            })
            addAddress.save()
                .then(() => {
                    res.redirect('/checkout')
                })
        }

    },

    //Delete Product From Cart
    deleteCartProduct: async (req, res) => {
        console.log('ddelte')
        const userId = req.session.userId
        const productId = req.params.productId
        const product = await productModel.findOne({ _id: productId })
        const cartTotal = product.price
        const deleteProduct = await cartModel.findOneAndUpdate({ owner: userId },
            {
                $pull:
                {
                    items:
                        { product: productId }
                }, $inc:
                    { cartTotal: -cartTotal }
            })
        deleteProduct.save()
            .then(() => {
                res.redirect('/shoping-cart')
            })

    },

    // Render Wish List
    wishList: async (req, res) => {
        const userId = req.session.userId
        const allwishLists = await wishListModel.findOne({ owner: userId })
            .populate('products.product')
            .exec((err, wishLists) => {
                if (err) {
                    console.log(err)
                    res.redirect('/')
                }
                const products = wishLists.products
                res.render('user/wishList', { login: req.session.userId, products })
            })

    },

    //Add To Wish List
    addToWishlist: async (req, res) => {
        const productId = req.params.productId
        const userId = req.session.userId
        const existWishList = await wishListModel.findOne({ owner: userId })
        if (existWishList) {
            await wishListModel.findOneAndUpdate({ owner: userId },
                {
                    $push:
                    {
                        products: [{
                            product: productId
                        }]
                    }
                })
            res.redirect('/')
        } else {
            const newWishList = await wishListModel({
                owner: userId,
                products: [{ product: productId }]
            })
            newWishList.save()
            res.redirect('/')
        }

    },

    //Remove Product From Wihslist
    removeWishlist: async (req, res) => {
        const productId = req.params.porductId
        const userId = req.session.userId
        const remove = await wishListModel.findOneAndUpdate({ owner: userId },
            { $pull: { products: { product: productId } } })
        remove.save()
            .then(() => {
                res.redirect('/wishList')
            })
    },

    // Oreder Conform
    orderConform: async (req, res) => {
        const paymentMethod = (req.body);
        const userId = req.session.userId
        const addressId = req.params.addressId
        const cart = await cartModel.findOne({ owner: userId })
        const products = cart.items
        const grandTotal = cart.cartTotal
        const addOrder = await orderModel({
            userId, products,
            shipping: addressId,
            grandTotal,
            paymentMethod
        })
        addOrder.save()
            .then(async () => {
                await cartModel.findOneAndDelete({ owner: userId })
                res.render('user/order-success', { login: req.session.login })
            })
    },

    //Orders View
    orderView: async(req,res)=>{
        const userName = req.session.userName
          const userId = req.session.userId
        const orders = await orderModel.findOne({userId:userId}).populate('products.product').exec((err,product)=>{
            if (err){
                console.log(err)
            }else{
                console.log(product);
                res.render('user/view-order',{userName})
            }
        })

    },

    pageNotFound: (req,res)=>{
        res.render('pageNotFound',{login:req.session.login})
    },
    // User Logout
    logoutUser: (req, res) => {
        req.session.destroy()
        res.redirect('/login')
    }
}

