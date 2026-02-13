const mongoose = require('mongoose');
const LoginHistory = require('./src/users/loginHistory.model');
require('dotenv').config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to DB');

        const latestLog = await LoginHistory.findOne().sort({ timestamp: -1 });
        console.log('Latest Log (Debug):', latestLog);

        if (latestLog && latestLog.deviceFingerprint === 'test-fingerprint-123') {
            console.log('VERIFICATION SUCCESS: deviceFingerprint saved correctly.');
        } else {
            console.log('VERIFICATION FAILED: deviceFingerprint not found.');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

verify();
