// ============================================
// SMS ROUTES - API Endpoints for SMS Testing
// ============================================
const express = require('express');
const router = express.Router();
const smsService = require('../services/smsService');

router.get('/test', async (req, res) => {
    try {
        console.log('🧪 Testing SMS API...');
        
        // Send to admin number from .env
        const result = await smsService.testSMS(process.env.ADMIN_MOBILE || '9606943049');
        
        res.json({
            success: result.success,
            message: result.success ? 'SMS test successful!' : 'SMS test failed',
            result: result
        });
    } catch (error) {
        console.error('❌ SMS test error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/send', async (req, res) => {
    try {
        const { mobile, message } = req.body;
        
        if (!mobile || !message) {
            return res.status(400).json({
                success: false,
                error: 'Mobile number and message are required'
            });
        }
        
        console.log(`📱 Sending custom SMS to ${mobile}...`);
        
        const result = await smsService.send(mobile, message);
        
        res.json({
            success: result.success,
            message: result.success ? 'SMS sent successfully' : 'Failed to send SMS',
            result: result
        });
        
    } catch (error) {
        console.error('❌ Send SMS error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/test-order', async (req, res) => {
    try {
        const { mobile, orderId, customerName, amount, items } = req.body;
        
        if (!mobile) {
            return res.status(400).json({
                success: false,
                error: 'Mobile number is required'
            });
        }
        
        console.log(`📱 Testing order confirmation SMS...`);
        
        const result = await smsService.sendOrderConfirmation(
            mobile,
            orderId || 'TEST001',
            customerName || 'Test Customer',
            amount || '500',
            items || 2
        );
        
        res.json({
            success: result.success,
            message: 'Test order SMS sent',
            result: result
        });
        
    } catch (error) {
        console.error('❌ Test order SMS error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/send-batch', async (req, res) => {
    try {
        const { smsArray } = req.body;
        
        if (!smsArray || !Array.isArray(smsArray)) {
            return res.status(400).json({
                success: false,
                error: 'smsArray must be an array of {mobile, message} objects'
            });
        }
        
        console.log(`📱 Sending batch SMS to ${smsArray.length} recipients...`);
        
        const results = await smsService.sendBatch(smsArray);
        
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;
        
        res.json({
            success: true,
            message: `Batch SMS completed. Success: ${successCount}, Failed: ${failCount}`,
            totalSent: successCount,
            totalFailed: failCount,
            results: results
        });
        
    } catch (error) {
        console.error('❌ Batch SMS error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
