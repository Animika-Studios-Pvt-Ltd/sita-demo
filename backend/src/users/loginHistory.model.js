const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    device: {
        type: String,
        default: 'Unknown'
    },
    os: {
        type: String,
        default: 'Unknown'
    },
    browser: {
        type: String,
        default: 'Unknown'
    },
    status: {
        type: String,
        enum: ['Success', 'Failed'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);
module.exports = LoginHistory;
