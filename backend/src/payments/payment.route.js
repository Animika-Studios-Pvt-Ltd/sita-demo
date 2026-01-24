const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('./payment.model');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_YourKeyHere",
  key_secret: process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET || "YourSecretHere",
});

console.log('💳 Razorpay initialized');

// Create Order (Store)
router.post('/create-order', async (req, res) => {
  console.log('\n🚀 Store Payment endpoint hit');

  try {
    const { amount, receipt, notes, name, email, phone } = req.body;

    // Validate
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: receipt || `store_${Date.now()}`,
      notes: {
        ...notes,
        customer_name: name,
        customer_email: email,
        customer_phone: phone
      }
    };

    console.log('📝 Creating Razorpay order...');
    const order = await razorpay.orders.create(options);
    console.log('✅ Order created successfully:', order.id);

    // Save to DB
    const payment = new Payment({
      cashfreeOrderId: order.id, // Reusing field name for Razorpay Order ID to minimize schema changes
      amount: amount,
      currency: order.currency,
      status: 'created',
      userId: notes?.userId || 'guest',
      notes: notes,
      receipt: order.receipt,
    });

    await payment.save();
    console.log('✅ Saved to database');

    res.json({
      success: true,
      orderId: order.id,
      amount: amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: error.message,
    });
  }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing verification details' });
    }

    const secret = process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Success
    const payment = await Payment.findOneAndUpdate(
      { cashfreeOrderId: razorpay_order_id },
      {
        cashfreePaymentId: razorpay_payment_id, // Reusing field
        status: 'paid',
        paidAt: new Date(),
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    res.json({
      success: true,
      message: 'Verified',
      paymentId: razorpay_payment_id,
      status: 'paid',
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
