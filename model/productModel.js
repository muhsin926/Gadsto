const mongoose = require('mongoose')
const validator = require('validator')

const productSchema = new mongoose.Schema({
    name: {
         type: String,
         required: true,
    },
    description: {
        type: String,
        required: true,
        
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: String,
        required: true,
    },
    category: {
        type: String,
       
    },
    image:{
        type: String,
        required:true

    },
    delete:{
        type: Boolean,
        default: false
    }
})

const Products =mongoose.model('Products',productSchema);

module.exports=Products