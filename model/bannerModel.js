const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({

    category: {
        type:String,
        required:true  
    },
    imageUrl:{
        type:String,
        required: true
    },
    title: {
        type:String,
        required:true
    },
    text: {
        type: String,
        required: true
    },
    delete: {
        type:Boolean,
          default: false
    }
});

const banner = mongoose.model("banner",bannerSchema)
module.exports= banner