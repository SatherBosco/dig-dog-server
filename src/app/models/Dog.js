const mongoose = require('../../database');

const DogSchema = new mongoose.Schema({
    dogId: {
        type: Number,
        required: true,
        unique: true,
    },
    dogCode: {
        type: Number,
        required: true,
    },
    rarity: {
        type: Number,
        required: true,
    },
    affinity: {
        type: Number,
        required: true,
    },
    clan: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hungry: {
        type: Date,
        required: true,
    },
    thirst: {
        type: Date,
        required: true,
    },
    penalty: {
        type: Number,
        default: 0,
    },
    penaltyDate: {
        type: Date,
        default: 0,
    },
    status: {
        type: String,
        required: true,
    },
    statusTime: {
        type: Date,
        required: true,
    },
    age: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Dog = mongoose.model('Dog', DogSchema);

module.exports = Dog;