const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema ({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: [{
        product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        },
        quantity: {
            type: String,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
    }],
    shipping:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    status:{
        type: String,
        default: 'Oreder Conformed'
    },
    grandTotal: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const wishList = mongoose.model("Order",orderSchema)
module.exports = wishList