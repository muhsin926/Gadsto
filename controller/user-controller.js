const userModel = require('../model/signupModel')
const bcrypt = require('bcrypt')
const productModel = require('../model/productModel')
const bannerModel = require('../model/bannerModel')
const cartModel = require('../model/cartModel')
const addressModel = require('../model/addressModel')
const wishListModel = require('../model/wishListModel')
const orderModel = require('../model/orderSchema')
const coupenModel = require('../model/coupenModel')
const moment = require('moment')
const Razorpay = require('razorpay')

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
        try {
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
        } catch {
            res.json('Something Error, Please try again')
        }
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
        try {
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
        } catch {
            res.json('Something wrong, please try again')
        }
    },


    // Product View Page
    productView: async (req, res) => {
        try {
            const id = req.params.id
            const product = await productModel.findOne({ _id: id })
            const relatedProduct = await productModel.find({ category: product.category, delete: { $ne: true } })
            res.render('user/product-view', { login: req.session.login, product, relatedProduct })
        } catch {
            res.redirect('/')
        }
    },


    //User Profile
    // =================
    myProfile: async (req, res) => {
        try {
            const id = req.session.userId
            const user = await userModel.findOne({ _id: id })
            req.session.userName = user.name
            res.render('user/myProfile', { user })
        } catch {
            res.json('Something wrong, please try again')
        }
    },


    // Edit and Update user 
    // =====================
    editUser: async (req, res) => {
        try {
            const { name, email } = req.body
            const id = req.session.userId
            const updateUser = await userModel.findByIdAndUpdate({ _id: id },
                { $set: { name: name, email: email } })
            updateUser.save()
                .then(() => {
                    res.redirect('/myProfile')
                })
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    // Shoping Cart
    shopingCart: async (req, res) => {
        try {
            const ownerId = req.session.userId
            const cartItems = await cartModel.findOne({ owner: ownerId }).
                populate('items.product').
                exec((err, allCart) => {
                    if (err) {
                        return console.log(err);
                    }

                    let coupenDiscount = 0
                    res.render('user/shoping-cart', { login: req.session.login, allCart, coupenDiscount })
                })
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    // Add To Cart
    addToCart: async (req, res) => {
        try {
            const productId = req.params.id

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
                        res.redirect('/productView/')
                    })
            } else {
                const existProduct = await cartModel.findOne
                    ({ owner: req.session.userId, 'items.product': productId })
                if (existProduct != null) {
                    await cartModel.findOneAndUpdate
                        ({ owner: req.session.userId, 'items.product': productId },
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
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    changeProductQuantity: async (req, res) => {
        try {
            const { cartId, productId, count } = req.params
            const product = await productModel.findOne({ _id: productId })
            if (count == 1) var productPrice = product.price;
            else { var productPrice = -product.price }
            const cart = await cartModel.findOneAndUpdate({ _id: cartId, 'items.product': productId },
                { $inc: { 'items.$.quantity': count, 'items.$.totalPrice': productPrice, cartTotal: productPrice } })
                .then(() => {
                    res.redirect('/shoping-cart')
                })
        } catch {
            res.json('Something wrong, please try again')
        }

    },

    // Place Order 
    checkout: async (req, res) => {
        try {
            let index = Number(req.body.index)
            if (!index) {
                index = 0
            }
            const userId = req.session.userId
            const addresses = await addressModel.findOne({ user: userId })
            let address
            if (addresses) {
                address = addresses.address;
            } else {
                address = []
            }
            const cartItems = await cartModel.findOne({ owner: userId })
            if (cartItems) {

                res.render('user/checkout', { login: req.session.login, address, index, cartItems })
            } else {
                res.redirect('/login')
            }
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    //new Address
    newAddress: async (req, res) => {
        try {
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
        } catch {
            res.json('Something wrong, please try again')
        }

    },

    //Delete Product From Cart
    deleteCartProduct: async (req, res) => {
        try {
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
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    // Render Wish List
    wishList: async (req, res) => {
        try {
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
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    //Add To Cart From Wishlist
    wishToCart: async (req, res) => {
        try {
            const productId = req.params.proId
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
                        res.redirect('/wishList')
                    })
            } else {
                const existProduct = await cartModel.findOne
                    ({ owner: req.session.userId, 'items.product': productId })
                if (existProduct != null) {
                    await cartModel.findOneAndUpdate
                        ({ owner: req.session.userId, 'items.product': productId },
                            {
                                $inc: {
                                    'items.$.quantity': 1,
                                    'items.$.totalPrice': product.price,
                                    cartTotal: cartTotal
                                }
                            })
                        .then(() => {
                            res.redirect('/wishList')
                        })
                } else {
                    const addToCart = await cartModel.findOneAndUpdate({ owner: req.session.userId },
                        { $push: { items: { product: productId, totalPrice: product.price } }, $inc: { cartTotal: cartTotal } })
                    addToCart.save()
                        .then(() => {
                            res.redirect('/wishList')
                        })
                }
            }
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    //Add To Wish List
    addToWishlist: async (req, res) => {
        try {
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
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    //Remove Product From Wihslist
    removeWishlist: async (req, res) => {
        try {
            const productId = req.params.porductId
            const userId = req.session.userId
            const remove = await wishListModel.findOneAndUpdate({ owner: userId },
                { $pull: { products: { product: productId } } })
            remove.save()
                .then(() => {
                    res.redirect('/wishList')
                })
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    // Oreder Conform
    orderConfirm: async (req, res) => {
        try {
            const paymentMethod = req.body.paymentMethod;
            const userId = req.session.userId
            const indexof = parseInt(req.body.index)
            const addresses = await addressModel.findOne({ user: userId })
            const address = addresses.address[indexof]
            const cart = await cartModel.findOne({ owner: userId })
            const products = cart.items
            const grandTotal = cart.cartTotal
            const addOrder = await orderModel({
                userId, products,
                address,
                grandTotal,
                paymentMethod
            })
            addOrder.save()
            // await cartModel.findOneAndDelete({ owner: userId })
            if (paymentMethod === 'COD') {
                await cartModel.findOneAndDelete({ owner: userId })
                res.json({ payment: 'COD' })

            } else {
                var instance = new Razorpay({
                    key_id: 'rzp_test_ot382G21y8f1J7',
                    key_secret: 'QegvCVlutW7TdMqKKFVLQt1I',
                });
                const options = {
                    amount: addOrder.grandTotal * 100,
                    currency: 'INR',
                    reciept: addOrder._id
                }
                instance.orders.create(options, (err, order) => {
                    if (err) {
                        console.log("error come orders" + err)
                    } else {

                        console.log("new order", order)
                        res.json(order)
                    }
                })
            }
        } catch {
            res.json('Something wrong, please try again')
        }

    },

    //Orders View
    orderView: async (req, res) => {
        try {
            const userName = req.session.userName
            const userId = req.session.userId

            const Orders = await orderModel.find({ userId: userId }).populate('products.product').exec((err, allOrders) => {
                if (err) {
                    console.log(err)
                }

                res.render('user/view-order', { userName, allOrders })

            })
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    pageNotFound: (req, res) => {
        res.render('pageNotFound', { login: req.session.login })
    },

    //Address Manage
    addressManage: async (req, res) => {
        try {
            const userName = req.session.userName
            const userId = req.session.userId
            const getAllAddresses = await addressModel.findOne({ userId })
            const addresses = getAllAddresses.address
            res.render('user/address-manage', { userName, addresses })
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    //new Address
    addAddress: async (req, res) => {
        try {
            const userId = req.session.userId
            const existAddress = await addressModel.findOne({ user: userId })
            if (existAddress) {
                await addressModel.findOneAndUpdate({ user: userId },
                    {
                        $push: {
                            address: [req.body]
                        }
                    }).then(() => {
                        res.redirect('/address-manage')
                    })
            } else {
                const addAddress = await addressModel({
                    user: userId,
                    address: [req.body]
                })
                addAddress.save()
                    .then(() => {
                        res.redirect('/address-manage')
                    })
            }
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    // Delete Address
    deleteAddress: async (req, res) => {
        try {
            const userId = req.session.userId
            const id = req.params.id
            await addressModel.updateOne({ user: userId }, { $pull: { address: { _id: id } } })
            res.redirect('/address-manage')
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    // Edit Address
    editAddress: async (req, res) => {
        try {
            const userName = req.session.userName
            const userId = req.session.userId
            const indexof = req.params.indexof
            const addresses = await addressModel.findOne({ user: userId })
            const index = addresses.indexof
            const address = await addressModel.findOne({ 'address.[index]': _id })
            res.render('user/edit-address', { address, userName })
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    //payment verification
    paymentVerification: async (req, res) => {
        try {
            const userId = req.session.userId
            console.log(req.body)
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'QegvCVlutW7TdMqKKFVLQt1I')
            hmac.update(req.body.payment.razorpay_order_id + '|' + req.body.payment.razorpay_payment_id);
            hmac = hmac.digest('hex')
            if (hmac == req.body.payment.razorpay_signature) {
                await cartModel.findOneAndDelete({ owner: userId })
                response = { valid: true }
                res.json(response)
            }
        } catch {
            res.json('Something wrong, please try again')
        }
    },

    orderSuccess: (req, res) => {
        res.render('user/order-success', { login: req.session.login })
    },

    // Check Coupen 
    checkCoupen: async (req, res) => {
        try {
            const userId = req.session.userId
            const clientCode = req.body.code
            const cartTotal = req.body.cartTotal
            const confirmCode = await coupenModel.findOne({ code: clientCode })
            console.log(confirmCode + 'ashfgashdf');
            if (confirmCode) {
                discountCoupen = cartTotal * confirmCode.discount / 100
                await cartModel.findOneAndUpdate({ owner: userId }, { $inc: { cartTotal: -discountCoupen } })
                res.json(discountCoupen)

            }
        } catch {
            console.log('catch working')
        }
    },

    // User Logout
    logoutUser: (req, res) => {
        req.session.destroy()
        res.redirect('/login')
    }
}

