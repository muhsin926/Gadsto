const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: [{
        product: {
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
        status: {
            type: String,
            default: 'Order Confirmed'
        },
    }],
    address: {
        fullName: {
            type: String,
           
        },
        phone: {
            type: Number,

        },
        pincode: {
            type: Number,

        },
        addressLine: {
            type: String,

        },
        landMark: {
            type: String,

        },
        city: {
            type: String,

        },
        state: {
            type: String,

        },
    },

    grandTotal: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    payment: {
        type: String,
        default: "unpaid"
    },
  

})

const orders = mongoose.model("Orders", orderSchema)
module.exports = orders