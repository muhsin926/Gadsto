const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema ({
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    items: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
    }]
})

const cart = mongoose.model("Shoping-Cart",cartSchema)
module.exports = cart