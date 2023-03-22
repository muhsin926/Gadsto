const mongoose = require('mongoose')

// Database connection 
const db = "mongodb+srv://Gadsto:xtoxsUWSgqRbuoSp@cluster0.fcpe9hg.mongodb.net/Gadsto?retryWrites=true&w=majority"

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
}) 

// connection checking
mongoose.connection
.once('open', () =>console.log('database connected '))
.on('error', error => console.log('error:', error))