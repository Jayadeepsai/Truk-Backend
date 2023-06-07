const mongoose = require('mongoose');

const adminMessage = mongoose.Schema({


    title: {
        type: String
    },
    desription: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now  // Set the default value to the current date and time
      }




})

module.exports = mongoose.model('adminMessage', adminMessage)