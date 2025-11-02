const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }   
})

const Dealer = mongoose.models.Dealer || mongoose.model('Dealer', dealerSchema);
module.exports = Dealer;