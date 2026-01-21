const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Base function to send SMS
const sendSMS = async (to, message) => {
  try {
    console.log('📱 Sending SMS to:', to);
    console.log('   Message length:', message.length, 'characters');
    console.log('   Message:', message.substring(0, 50) + '...');
    
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    
    console.log('✅ SMS sent successfully:', response.sid);
    return { success: true, messageSid: response.sid, data: response };
  } catch (error) {
    console.error('❌ Twilio SMS Error:', error.message);
    console.error('   Error Code:', error.code);
    return { success: false, error: error.message, code: error.code };
  }
};

// Order Placed Notification - ADMIN ONLY (SHORT VERSION)
const sendOrderPlacedNotification = async (order) => {
  try {
    const guestCode = order.guestOrderCode || 'N/A';
    
    console.log('📱 Sending order notification to ADMIN only');
    
    // SHORT SMS to Admin (under 160 characters)
    const adminMessage = `NEW ORDER: ${guestCode}
${order.name}
Rs.${order.totalPrice.toFixed(0)}
${order.products.length} items
${order.phone}`;
    
    console.log('   Message length:', adminMessage.length, 'chars');
    
    const adminResult = await sendSMS(process.env.ADMIN_PHONE_NUMBER, adminMessage);
    
    console.log('📊 Admin notification result:', adminResult.success ? '✅ Sent' : '❌ Failed');
    
    return { success: adminResult.success, adminResult };
  } catch (error) {
    console.error('Error in sendOrderPlacedNotification:', error);
    return { success: false, error: error.message };
  }
};

// Tracking Update Notification - DISABLED FOR NOW
const sendTrackingUpdateNotification = async (order, trackingId) => {
  console.log('ℹ️ Tracking SMS disabled - only admin order notifications active');
  return { success: true, skipped: true };
};

// Order Shipped Notification - DISABLED FOR NOW
const sendShippedNotification = async (order) => {
  console.log('ℹ️ Shipped SMS disabled - only admin order notifications active');
  return { success: true, skipped: true };
};

// Order Delivered Notification - DISABLED FOR NOW
const sendDeliveredNotification = async (order) => {
  console.log('ℹ️ Delivered SMS disabled - only admin order notifications active');
  return { success: true, skipped: true };
};

module.exports = {
  sendSMS,
  sendOrderPlacedNotification,
  sendTrackingUpdateNotification,
  sendShippedNotification,
  sendDeliveredNotification,
};
