const mongoose = require('../../database');

const VestingToBoneSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const VestingToBone = mongoose.model('VestingToBone', VestingToBoneSchema);

module.exports = VestingToBone;