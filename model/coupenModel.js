const mongoose = require('mongoose');

const coupenSchema = new mongoose.Schema ({
    name : {
       type: String
    },
    code:{
        type:String
    },
    discount:{
        type: Number
    }
})

const coupen = mongoose.model("coupen",coupenSchema)
module.exports = coupen