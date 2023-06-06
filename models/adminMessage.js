const mongoose = require('mongoose');

const adminMessage = mongoose.Schema({


    title: {
        type: String
    },
    desription: {
        type: String
    }



})

module.exports = mongoose.model('adminMessage', adminMessage)