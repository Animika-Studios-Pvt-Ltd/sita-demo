const express = require('express');
const { Cashfree } = require('cashfree-pg');
const Payment = require('./payment.model');

const router = express.Router();

// ✅ SDK v4.3.10 Initialization
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

console.log('💳 Cashfree v4.3.10 initialized');
console.log('🔑 AppID:', process.env.CASHFREE_APP_ID?.substring(0, 10) + '...');

// Create Order
router.post('/create-order', async (req, res) => {
  console.log('\n🚀 Payment endpoint hit');
  
  try {
    const { amount, receipt, notes, name, email, phone } = req.body;
    
    // Validate
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Missing customer details' });
    }

    // Format
    const customerId = (notes?.userId || 'guest').replace(/[^a-zA-Z0-9_-]/g, '_');
    let formattedPhone = phone.toString().replace(/\D/g, '');
    if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }
    
    const orderId = receipt || `order_${Date.now()}`;
    
    // Request
    const request = {
      order_amount: parseFloat(amount),
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: customerId,
        customer_phone: formattedPhone,
        customer_name: name,
        customer_email: email,
      },
      order_meta: {
        return_url: 'https://www.langshott.in/orders?status=success',
      },
    };

    console.log('📝 Creating Cashfree order...');
    
    // ✅ v4.3.10 Method
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    
    console.log('✅ Order created successfully');

    const orderData = response.data;

    // Save to DB
    const payment = new Payment({
      cashfreeOrderId: orderData.order_id,
      paymentSessionId: orderData.payment_session_id,
      amount: orderData.order_amount,
      currency: orderData.order_currency,
      status: 'created',
      userId: notes?.userId || 'guest',
      notes: notes,
      receipt: orderData.order_id,
    });

    await payment.save();
    console.log('✅ Saved to database');

    res.json({
      success: true,
      orderId: orderData.order_id,
      paymentSessionId: orderData.payment_session_id,
      amount: orderData.order_amount,
      currency: orderData.order_currency,
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response?.data) {
      console.error('❌ Cashfree API:', error.response.data);
    }
    
    res.status(500).json({
      success: false,
      message: 'Payment failed',
      error: error.response?.data?.message || error.message,
    });
  }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID required' });
    }

    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    const payments = response.data || [];
    
    let status = 'failed';
    let paymentId = null;

    const successfulPayment = payments.find(p => p.payment_status === 'SUCCESS');
    
    if (successfulPayment) {
      status = 'paid';
      paymentId = successfulPayment.cf_payment_id;
    }

    const payment = await Payment.findOneAndUpdate(
      { cashfreeOrderId: orderId },
      {
        cashfreePaymentId: paymentId,
        status: status,
        paidAt: status === 'paid' ? new Date() : null,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({
      success: status === 'paid',
      message: status === 'paid' ? 'Verified' : 'Failed',
      paymentId: paymentId,
      status: status,
    });

  } catch (error) {
    console.error('❌ Verify error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message,
    });
  }
});

module.exports = router;
