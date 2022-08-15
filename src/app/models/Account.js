const mongoose = require('../../database');

const AccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    bone: {
        type: Number,
        default: 0,
    },
    food: {
        type: Number,
        default: 0,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;