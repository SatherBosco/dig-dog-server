const mongoose = require('../../database');

const RoomSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    roomStartTime: {
        type: Date,
        required: true,
    },
    timeMult: {
        type: Number,
        default: 1,
    },
    useRoomTime: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;