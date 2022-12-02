const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema ({
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Products"
    },

})

const wishList = mongoose.model("WishList",wishListSchema)
module.exports = wishList