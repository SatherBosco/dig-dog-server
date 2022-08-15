const mongoose = require('../../database');

const BuyDogSchema = new mongoose.Schema({
    transactionId: {
        type: Number,
        unique: true,
    },
    paid: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    signature: {
        type: String,
    },
    amount: {
        type: String,
    },
    date: {
        type: Number,
    },
    stake: {
        type: Boolean,
        default: false,
    },
    stakeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stake',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const BuyDog = mongoose.model('BuyDog', BuyDogSchema);

module.exports = BuyDog;