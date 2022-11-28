const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  offer: {
    coupenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupen",
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  subTotal: {
    type: Number,
    default: 0,
  },
  cartTotal: {
    type: Number,
    default: 0,
  },
});

const cart = mongoose.model("Shoping-Cart", cartSchema);
module.exports = cart;
