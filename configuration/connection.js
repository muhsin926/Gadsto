const mongoose = require('mongoose')

// Database connection 
mongoose.connect('mongodb://localhost:27017/electro')

// connection checking
mongoose.connection
.once('open', () =>console.log('database connected '))
.on('error', error => console.log('error:', error))