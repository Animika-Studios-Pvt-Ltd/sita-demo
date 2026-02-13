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
    clientIp: String, // Best guess for client IP
    serverIp: String, // Deployment/Server IP (socket remoteAddress)
    sourceIp: String, // Explicit Source IP
    destinationIp: String, // Explicit Destination IP
    deviceFingerprint: String, // Unique Device Hash
    forwardedFor: String, // Raw x-forwarded-for header
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
