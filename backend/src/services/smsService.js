const axios = require('axios');

class SMSService {
  constructor() {
    this.baseUrl = process.env.SMS_BASE_URL || 'http://103.255.103.24/api/send_transactional_sms.php';
    this.username = process.env.SMS_USERNAME || 'u7721';
    this.msgToken = process.env.SMS_MSG_TOKEN || '3jxlz6';
    this.senderId = process.env.SMS_SENDER_ID || 'ANIMIK';
    this.adminMobile = process.env.ADMIN_MOBILE || '8861691980';
    this.isEnabled = process.env.SMS_ENABLED !== 'false';

    console.log('📱 SMS Service initialized:', {
      enabled: this.isEnabled,
      baseUrl: this.baseUrl,
      username: this.username,
      sender: this.senderId,
      admin: this.adminMobile
    });
  }

  async send(mobile, customerName, orderCode, totalPrice, orderDate) {
    if (!this.isEnabled) {
      console.log('📱 SMS disabled in environment');
      return { success: true, skipped: true };
    }

    /* 
    // DISABLED: SMS SERVICE BLOCKED
    try {
      const mobileStr = String(mobile || '');
      const cleanMobile = mobileStr.replace(/^(\+91|91)/, '').replace(/\D/g, '').trim();

      if (!/^\d{10}$/.test(cleanMobile)) {
        throw new Error(`Invalid mobile: ${cleanMobile}`);
      }

      // Updated message template to match provided example exactly
      const message = `Dear ${customerName}, your order ${orderCode} for Rs.${totalPrice} placed on ${orderDate} is confirmed. Thank you for shopping with ANIMIKA STUDIOS.`;

      const url = `${this.baseUrl}?username=${this.username}&msg_token=${this.msgToken}&sender_id=${this.senderId}&message=${encodeURIComponent(message)}&mobile=${cleanMobile}`;

      console.log(`\n📤 Sending SMS to ${cleanMobile}`);
      console.log(`📧 Message: ${message}`);

      const response = await axios.get(url, { timeout: 10000 });

      console.log(`✅ SMS API Response:`, response.data);

      return {
        success: true,
        mobile: cleanMobile,
        message,
        data: response.data,
        sentAt: new Date()
      };
    } catch (error) {
      console.error(`❌ SMS failed for ${mobile}:`, error.message);
      if (error.response) {
        console.error(`❌ API Response:`, error.response.data);
      }
      return {
        success: false,
        mobile,
        error: error.message
      };
    }
    */
    console.log(`🔕 SMS DISABLED: Would have sent SMS to ${mobile} for Order ${orderCode}`);
    return { success: true, skipped: true, message: 'SMS Service Disabled' };
  }

  formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendOrderConfirmation(orderData) {
    console.log('\n========================================');
    console.log('📱 SENDING ORDER CONFIRMATION SMS');
    console.log('========================================');

    const results = [];

    try {
      const { name, phone, _id, totalPrice, guestOrderCode, createdAt } = orderData;
      const orderCode = guestOrderCode || _id.toString().slice(-8).toUpperCase();
      const orderDate = this.formatDate(createdAt || new Date());

      console.log('📦 Order Details:');
      console.log('   Name:', name);
      console.log('   Phone:', phone);
      console.log('   Order Code:', orderCode);
      console.log('   Total:', totalPrice);
      console.log('   Date:', orderDate);

      // Customer SMS
      console.log('\n📱 Sending SMS to CUSTOMER...');
      const customerResult = await this.send(
        phone,
        name,
        orderCode,
        totalPrice,
        orderDate
      );
      results.push({ type: 'customer', ...customerResult });

      if (customerResult.success) {
        console.log('✅ Customer SMS sent');
      } else {
        console.error('❌ Customer SMS failed:', customerResult.error);
      }

      await this.delay(2000); // 2 second delay between messages

      // Admin SMS
      console.log('\n📱 Sending SMS to ADMIN...');
      const adminResult = await this.send(
        this.adminMobile,
        name,
        orderCode,
        totalPrice,
        orderDate
      );
      results.push({ type: 'admin', ...adminResult });

      if (adminResult.success) {
        console.log('✅ Admin SMS sent');
      } else {
        console.error('❌ Admin SMS failed:', adminResult.error);
      }

      const successCount = results.filter(r => r.success).length;
      console.log(`\n✅ ORDER CONFIRMATION COMPLETE: ${successCount}/2 SMS sent`);
      console.log('========================================\n');
    } catch (error) {
      console.error('❌ Order confirmation error:', error.message);
      console.error('========================================\n');
    }

    return results;
  }

  // Stub methods - no SMS sent for these
  async sendProcessingUpdate(orderData) {
    return { success: true, skipped: true, message: 'Processing update not configured' };
  }

  async sendShippingUpdate(orderData) {
    return { success: true, skipped: true, message: 'Shipping update not configured' };
  }

  async sendDeliveredUpdate(orderData) {
    return { success: true, skipped: true, message: 'Delivery update not configured' };
  }

  async sendCancellationUpdate(orderData, reason) {
    return { success: true, skipped: true, message: 'Cancellation not configured' };
  }

  async sendReturnRequestedUpdate(orderData) {
    return { success: true, skipped: true, message: 'Return requested not configured' };
  }

  async sendReturnApprovedUpdate(orderData) {
    return { success: true, skipped: true, message: 'Return approved not configured' };
  }

  async sendReturnRejectedUpdate(orderData, rejectionReason) {
    return { success: true, skipped: true, message: 'Return rejected not configured' };
  }

  async sendTrackingUpdate(orderData, trackingId) {
    return { success: true, skipped: true, message: 'Tracking update not configured' };
  }

  async testSMS(mobile) {
    console.log('\n========================================');
    console.log('🧪 SENDING TEST SMS');
    console.log('========================================');
    const testDate = this.formatDate(new Date());
    const result = await this.send(mobile, 'Test Customer', 'TEST1234', '999', testDate);
    console.log('========================================\n');
    return result;
  }

  // Legacy methods
  async sendDetailedOrderConfirmation(orderData) {
    return await this.sendOrderConfirmation(orderData);
  }

  async sendDetailedAdminAlert(orderData) {
    return await this.sendOrderConfirmation(orderData);
  }

  async sendDetailedShippingUpdate(orderData) {
    return { success: true, skipped: true };
  }

  async sendDetailedCancellation(orderData, reason) {
    return { success: true, skipped: true };
  }
}

module.exports = new SMSService();
