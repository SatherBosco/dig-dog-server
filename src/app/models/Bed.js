const mongoose = require('../../database');

const BedSchema = new mongoose.Schema({
    bedType: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    useBedTime: {
        type: Date,
        default: Date.now,
    },
    expirationBedTime: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Bed = mongoose.model('Bed', BedSchema);

module.exports = Bed;