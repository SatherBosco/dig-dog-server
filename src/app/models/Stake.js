const mongoose = require('../../database');

const StakeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dogId1: {
        type: Number,
        required: true,
    },
    dogId2: {
        type: Number,
        required: true,
    },
    dogId3: {
        type: Number,
        required: true,
    },
    dogId4: {
        type: Number,
        required: true,
    },
    dogId5: {
        type: Number,
        required: true,
    },
    dogId6: {
        type: Number,
        required: true,
    },
    dogId7: {
        type: Number,
        required: true,
    },
    dogId8: {
        type: Number,
        required: true,
    },
    dogId9: {
        type: Number,
        required: true,
    },
    dogId10: {
        type: Number,
        required: true,
    },
    lastMint: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Stake = mongoose.model('Stake', StakeSchema);

module.exports = Stake;