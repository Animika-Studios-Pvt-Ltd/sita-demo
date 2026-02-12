const { google } = require('googleapis');

// Initialize OAuth2 client for Gmail API
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

// Create Gmail API client
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

/**
 * Send email using Gmail API
 */
async function sendEmail({ to, subject, html, text }) {
  try {
    const from = process.env.EMAIL_USER;
    const storeName = process.env.STORE_NAME || 'Sita';

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: ${storeName} <${from}>`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      html || text
    ];

    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('✅ Email sent successfully via Gmail API:', result.data.id);
    return { success: true, messageId: result.data.id };
  } catch (error) {
    console.error('❌ Gmail API Error:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    throw error;
  }
}

/**
 * 1. PENDING - Order Confirmation Email
 */
async function sendOrderPlacedEmailCustomer(order) {
  try {
    const guestCode = order.guestOrderCode || 'N/A';
    const fullOrderId = order._id.toString();
    const shortOrderId = fullOrderId.substring(fullOrderId.length - 8).toUpperCase();

    const productsHTML = order.products.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    const giftSection = order.giftTo ? `
      <div style="background: #fff9e6; padding: 20px; margin: 20px 0; border-left: 4px solid #ffc107; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; color: #f57c00;">🎁 Gift Order</h3>
        <p style="margin: 5px 0;"><strong>To:</strong> ${order.giftTo}</p>
        <p style="margin: 5px 0;"><strong>From:</strong> ${order.giftFrom || 'Anonymous'}</p>
        ${order.giftMessage ? `<p style="margin: 5px 0;"><strong>Message:</strong> ${order.giftMessage}</p>` : ''}
      </div>
    ` : '';

    const deliveryAddress = order.giftAddress && order.giftTo ? order.giftAddress : order.address;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your order, ${order.name}!</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 15px 0; color: #667eea; font-size: 20px;">Order Details</h2>
              <p style="margin: 5px 0;"><strong>Order Code:</strong> ${guestCode}</p>
              <p style="margin: 5px 0;"><strong>Order ID:</strong> #${shortOrderId}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #4caf50; font-weight: bold;">Processing</span></p>
            </div>

            ${giftSection}

            <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px 0; color: #333;">Items Ordered (${order.products.length})</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsHTML}
                </tbody>
              </table>
              
              <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #667eea; text-align: right;">
                <p style="margin: 5px 0; font-size: 18px;"><strong>Total Amount:</strong> <span style="color: #667eea; font-size: 24px;">$${order.totalPrice.toFixed(2)}</span></p>
              </div>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px 0; color: #333;">📦 Delivery Address</h3>
              <p style="margin: 0; line-height: 1.8;">
                ${deliveryAddress.street}<br>
                ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.zipcode}<br>
                ${deliveryAddress.country}
              </p>
            </div>

            <div style="background: #e3f2fd; padding: 20px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
              <p style="margin: 0; color: #1565c0;">
                <strong>📬 What's Next?</strong><br>
                We'll send you tracking information once your order ships. Usually within 1-2 business days.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="margin: 5px 0; color: #666;">Need help? Contact us at</p>
              <p style="margin: 5px 0;"><a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #667eea; text-decoration: none;">${process.env.ADMIN_EMAIL}</a></p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: order.email,
      subject: `Order Confirmation - ${guestCode}`,
      html
    });

    console.log('✅ Customer order confirmation email sent');
  } catch (error) {
    console.error('❌ Failed to send customer order email:', error.message);
    throw error;
  }
}

/**
 * Admin notification for new orders
 */
async function sendOrderPlacedEmailAdmin(order) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.log('⚠️ No admin email configured');
      return;
    }

    const guestCode = order.guestOrderCode || 'N/A';
    const fullOrderId = order._id.toString();
    const shortOrderId = fullOrderId.substring(fullOrderId.length - 8).toUpperCase();

    const productsHTML = order.products.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    const deliveryAddress = order.giftAddress && order.giftTo ? order.giftAddress : order.address;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🆕 New Order Received</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${shortOrderId}</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 15px 0; color: #dc3545; font-size: 20px;">Customer Information</h2>
              <p style="margin: 5px 0;"><strong>Order Code:</strong> ${guestCode}</p>
              <p style="margin: 5px 0;"><strong>Order ID:</strong> #${shortOrderId}</p>
              <p style="margin: 5px 0;"><strong>Customer:</strong> ${order.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${order.email}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.phone}</p>
              <p style="margin: 5px 0;"><strong>Payment:</strong> <span style="color: #4caf50; font-weight: bold;">${order.paymentStatus}</span></p>
            </div>

            <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px 0; color: #333;">Products Ordered</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsHTML}
                </tbody>
              </table>
              
              <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #dc3545; text-align: right;">
                <p style="margin: 5px 0; font-size: 18px;"><strong>Total Amount:</strong> <span style="color: #dc3545; font-size: 24px;">$${order.totalPrice.toFixed(2)}</span></p>
              </div>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px 0; color: #333;">📦 Delivery Address</h3>
              <p style="margin: 0; line-height: 1.8;">
                ${deliveryAddress.street}<br>
                ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.zipcode}<br>
                ${deliveryAddress.country}
              </p>
            </div>

            ${order.giftTo ? `
              <div style="background: #fff9e6; padding: 20px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <h3 style="margin: 0 0 10px 0; color: #f57c00;">🎁 Gift Order</h3>
                <p style="margin: 5px 0;"><strong>To:</strong> ${order.giftTo}</p>
                <p style="margin: 5px 0;"><strong>From:</strong> ${order.giftFrom || 'Anonymous'}</p>
                ${order.giftMessage ? `<p style="margin: 5px 0;"><strong>Message:</strong> ${order.giftMessage}</p>` : ''}
              </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                Process this order in your admin dashboard
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `🆕 New Order #${shortOrderId} - Rs.${order.totalPrice}`,
      html
    });

    console.log('✅ Admin notification email sent');
  } catch (error) {
    console.error('❌ Admin email error:', error.message);
  }
}


/**
 * 3. SHIPPED - Order dispatched
 */
async function sendShippedEmail(order) {
  try {
    const orderId = order.guestOrderCode || order._id.toString().slice(-8).toUpperCase();

    // ✅ CHECK: Only send if order has tracking ID
    if (!order.trackingId) {
      console.log('⚠️ No tracking ID provided. Skipping shipped email.');
      return;
    }

    // ✅ Generate books list with cover images from book model
    const booksList = order.products.map(product => {
      // Use coverImage from book model, fallback to placeholder
      const imageUrl = product.coverImage || 'https://via.placeholder.com/80x120/cccccc/666666?text=Book+Cover';
      const title = product.title || 'Book';
      const author = product.author || '';
      const quantity = product.quantity || 1;
      const price = product.price || 0;

      return `
        <div style="display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee;">
          <img src="${imageUrl}" 
               alt="${title}" 
               style="width: 60px; height: 90px; object-fit: cover; border-radius: 4px; margin-right: 15px; border: 1px solid #ddd;">
          <div style="flex: 1;">
            <p style="margin: 0 0 5px 0; font-weight: bold; color: #333; font-size: 15px;">${title}</p>
            ${author ? `<p style="margin: 0 0 5px 0; font-size: 13px; color: #888; font-style: italic;">by ${author}</p>` : ''}
            <p style="margin: 0; font-size: 14px; color: #666;">Qty: ${quantity} × $${price.toFixed(2)}</p>
          </div>
          <div style="text-align: right; font-weight: bold; color: #28a745;">
            $${(quantity * price).toFixed(2)}
          </div>
        </div>
      `;
    }).join('');

    // ✅ Create a summary for the main message
    const firstBook = order.products[0];
    const firstBookTitle = firstBook?.title || 'your books';
    const bookCount = order.products.length;

    const trackingSection = `
      <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 15px 0; color: #333;">📦 Tracking Information</h3>
        <div style="background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #28a745;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Tracking ID</p>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #28a745; font-family: 'Courier New', monospace;">${order.trackingId}</p>
        </div>
        <p style="margin: 15px 0 0 0; font-size: 14px; color: #666; text-align: center;">
          📍 Use this tracking ID to monitor your shipment status
        </p>
      </div>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Your Books Are On The Way!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order ${orderId}</p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <!-- Message -->
            <div style="background: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <h2 style="margin: 0 0 15px 0; color: #28a745; font-size: 20px;">Hi ${order.name},</h2>
              <p style="margin: 10px 0; font-size: 16px; line-height: 1.8;">
                Great news! <strong>${bookCount === 1 ? firstBookTitle : `${bookCount} books`}</strong> ${bookCount === 1 ? 'is' : 'are'} on the way to you!
              </p>
              <p style="margin: 10px 0; font-size: 16px; line-height: 1.8; color: #666;">
                Expected delivery within <strong style="color: #28a745;">3-5 business days</strong>
              </p>
            </div>

            <!-- Tracking Section -->
            ${trackingSection}

            <!-- Order Summary -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Order ID:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; text-align: right;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Status:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                    <span style="color: #28a745; font-weight: bold;">✓ Shipped</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Items:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; text-align: right;">${bookCount} book${bookCount > 1 ? 's' : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0;"><strong>Total Amount:</strong></td>
                  <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #28a745;">$${order.totalPrice.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <!-- Expected Delivery -->
            <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); padding: 20px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <p style="margin: 0; color: #155724;">
                <strong style="font-size: 16px;">📅 Expected Delivery</strong><br>
                <span style="font-size: 14px;">Your books will arrive within 3-5 business days. We'll send you another email once they're delivered!</span>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6;">
              <p style="margin: 5px 0; color: #666; font-size: 14px;">Questions? We're here to help!</p>
              <p style="margin: 10px 0;">
                <a href="mailto:${process.env.ADMIN_EMAIL}" 
                   style="display: inline-block; background: #28a745; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Contact Support
                </a>
              </p>
              <p style="margin: 15px 0 5px 0; font-size: 13px; color: #888;">
                Email: <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #28a745; text-decoration: none;">${process.env.ADMIN_EMAIL}</a>
              </p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: order.email,
      subject: `Your Books Are Shipped! - Order ${orderId}`,
      html,
    });

    console.log('✅ Shipped email with book covers sent successfully');
  } catch (error) {
    console.error('❌ Shipped email error:', error.message);
  }
}

/**
 * 4. DELIVERED - Order completed
 */
async function sendDeliveredEmail(order) {
  try {
    const orderId = order.guestOrderCode || order._id.toString().slice(-8).toUpperCase();
    // ✅ Create a summary for the main message
    const firstBook = order.products[0];
    const firstBookTitle = firstBook?.title || 'your books';
    const bookCount = order.products.length;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Delivered Successfully!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order ${orderId}</p>
          </div>

          <!-- Content -->
          <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <!-- Message -->
            <div style="background: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <h2 style="margin: 0 0 15px 0; color: #28a745; font-size: 20px;">Hi ${order.name},</h2>
              <p style="margin: 10px 0; font-size: 16px; line-height: 1.8;">
                Great news! <strong>${bookCount === 1 ? firstBookTitle : `${bookCount} books`}</strong> ${bookCount === 1 ? 'has' : 'have'} been delivered successfully!
              </p>
              <p style="margin: 10px 0; font-size: 16px; line-height: 1.8; color: #666;">
                We hope you enjoy reading! <strong style="color: #28a745;">Happy Reading! ✨</strong>
              </p>
            </div>

            <!-- Review CTA -->
            <div style="background: linear-gradient(135deg, #fff9e6 0%, #ffecb3 100%); padding: 20px; margin-bottom: 20px; border-radius: 8px; border: 2px solid #ffc107; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #f57f17; font-size: 18px;">⭐ How Was Your Experience? ⭐</h3>
              <p style="margin: 10px 0 15px 0; color: #f57c00; font-size: 14px; line-height: 1.6;">
                Your honest review helps us improve and helps fellow readers discover great books!
              </p>
              <a href="${process.env.FRONTEND_URL}/publications" 
                 style="display: inline-block; background: #ffc107; color: #000; padding: 12px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 15px; box-shadow: 0 3px 5px rgba(0,0,0,0.1);">
                📝 Write a Review
              </a>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #f57c00;">It only takes a minute!</p>
            </div>

            <!-- Order Summary -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
              <h3 style="margin: 0 0 15px 0; color: #333;">📋 Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Order ID:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; text-align: right;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Status:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                    <span style="color: #28a745; font-weight: bold;">✓ Delivered</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;"><strong>Items:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #dee2e6; text-align: right;">${bookCount} book${bookCount > 1 ? 's' : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0;"><strong>Total Amount:</strong></td>
                  <td style="padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #28a745;">$${order.totalPrice.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <!-- Thank You Message -->
            <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); padding: 20px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
              <p style="margin: 0; color: #155724;">
                <strong style="font-size: 16px;">Thank You for Your Order!</strong><br>
                <span style="font-size: 14px;">We hope you enjoy your books. Come back soon for more great reads!</span>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6;">
              <p style="margin: 5px 0; color: #666; font-size: 14px;">Questions? We're here to help!</p>
              <p style="margin: 10px 0;">
                <a href="mailto:${process.env.ADMIN_EMAIL}" 
                   style="display: inline-block; background: #28a745; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Contact Support
                </a>
              </p>
              <p style="margin: 15px 0 5px 0; font-size: 13px; color: #888;">
                Email: <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #28a745; text-decoration: none;">${process.env.ADMIN_EMAIL}</a>
              </p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: order.email,
      subject: `Your Books Are Delivered! - Order ${orderId}`,
      html
    });

    console.log('✅ Delivered email with review request sent successfully');
  } catch (error) {
    console.error('❌ Delivered email error:', error.message);
  }
}



/**
 * 5. CANCELLED - Order cancelled
 */
async function sendCancelledEmail(order, reason) {
  try {
    const orderId = order.guestOrderCode || order._id.toString().slice(-8).toUpperCase();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Order Cancelled</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderId}</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 15px 0; color: #dc3545; font-size: 20px;">Hi ${order.name},</h2>
              <p style="margin: 10px 0; font-size: 16px; line-height: 1.8;">
                Your order <strong>#${orderId}</strong> has been cancelled.
              </p>
            </div>

            <div style="background: #fff3cd; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">Cancellation Reason</h3>
              <p style="margin: 0; color: #856404;">${reason}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px 0; color: #333;">Refund Information</h3>
              <p style="margin: 5px 0;"><strong>Order Amount:</strong> $${order.totalPrice.toFixed(2)}</p>
              <p style="margin: 5px 0;"><strong>Refund Status:</strong> <span style="color: #ffc107; font-weight: bold;">Processing</span></p>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
                Your refund will be processed within 5-7 business days to your original payment method.
              </p>
            </div>

            <div style="background: #e7f3ff; padding: 20px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
              <p style="margin: 0; color: #1565c0;">
                <strong>💬 Have Questions?</strong><br>
                If you have any questions or concerns about this cancellation, please don't hesitate to contact us.
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6;">
              <p style="margin: 5px 0; color: #666; font-size: 14px;">Questions? We're here to help!</p>
              <p style="margin: 10px 0;">
                <a href="mailto:${process.env.ADMIN_EMAIL}" 
                   style="display: inline-block; background: #856404; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Contact Support
                </a>
              </p>
              <p style="margin: 15px 0 5px 0; font-size: 13px; color: #888;">
                Email: <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #856404; text-decoration: none;">${process.env.ADMIN_EMAIL}</a>
              </p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: order.email,
      subject: `Order Cancelled - #${orderId}`,
      html
    });

    console.log('✅ Cancellation email sent');
  } catch (error) {
    console.error('❌ Cancellation email error:', error.message);
  }
}

/**
 * 6. RETURN REQUESTED - Customer initiates return
 */
async function sendReturnRequestedEmail(order) {
  try {
    const orderId = order.guestOrderCode || order._id.toString().slice(-8).toUpperCase();
    const adminEmail = process.env.ADMIN_EMAIL;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Return Request Received 🔄</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderId}</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 15px 0; color: #ff9800; font-size: 20px;">Hi ${order.name},</h2>
              <p style="margin: 10px 0; font-size: 16px; line-height: 1.8;">
                We've received your return request for order <strong>#${orderId}</strong>.
              </p>
            </div>

            <div style="background: #fff3cd; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #ff9800;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">Return Details</h3>
              <p style="margin: 5px 0;"><strong>Reason:</strong> ${order.returnReason || 'Not specified'}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #ff9800; font-weight: bold;">Under Review</span></p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 15px 0; color: #333;">What Happens Next?</h3>
              <ul style="margin: 10px 0; padding-left: 20px; line-height: 2;">
                <li>Our team will review your request within 24-48 hours</li>
                <li>You'll receive an email with our decision</li>
                <li>If approved, we'll provide return instructions</li>
              </ul>
            </div>

            <div style="background: #e3f2fd; padding: 20px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
              <p style="margin: 0; color: #1565c0;">
                <strong>⏱️ Review Timeline:</strong><br>
                We'll review your return request and respond within 24-48 business hours.
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6;">
              <p style="margin: 5px 0; color: #666; font-size: 14px;">Questions? We're here to help!</p>
              <p style="margin: 10px 0;">
                <a href="mailto:${process.env.ADMIN_EMAIL}" 
                   style="display: inline-block; background: #856404; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Contact Support
                </a>
              </p>
              <p style="margin: 15px 0 5px 0; font-size: 13px; color: #888;">
                Email: <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #856404; text-decoration: none;">${process.env.ADMIN_EMAIL}</a>
              </p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                This is an automated email. Please do not reply directly to this message.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to customer
    await sendEmail({
      to: order.email,
      subject: `Return Request Received - #${orderId}`,
      html
    });

    // Send admin alert
    if (adminEmail) {
      const adminHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">🔄 Return Request - ACTION REQUIRED</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderId}</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="margin: 0 0 15px 0; color: #ff9800; font-size: 20px;">Customer Information</h2>
                <p style="margin: 5px 0;"><strong>Order ID:</strong> #${orderId}</p>
                <p style="margin: 5px 0;"><strong>Customer:</strong> ${order.name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${order.email}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.phone}</p>
                <p style="margin: 5px 0;"><strong>Order Amount:</strong> $${order.totalPrice.toFixed(2)}</p>
              </div>

              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800;">
                <h3 style="margin: 0 0 10px 0; color: #856404;">Return Request Details</h3>
                <p style="margin: 0; color: #856404;"><strong>Reason:</strong> ${order.returnReason || 'Not specified'}</p>
                ${order.returnImage ? `<p style="margin: 10px 0 0 0;"><a href="${order.returnImage}" target="_blank" style="color: #ff9800;">View Image</a></p>` : ''}
              </div>

              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="margin: 5px 0; color: #666; font-size: 14px;">
                  Review and approve/reject this return request in your admin dashboard
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: adminEmail,
        subject: `🔄 Return Request - Order #${orderId} - ACTION REQUIRED`,
        html: adminHtml
      });
    }

    console.log('✅ Return requested email sent');
  } catch (error) {
    console.error('❌ Return requested email error:', error.message);
  }
}

/**
 * 7. RETURN APPROVED - Return accepted
 */
async function sendReturnApprovedEmail(order) {
  try {
    const orderId = order.guestOrderCode || order._id.toString().slice(-8).toUpperCase();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Return Request Approved ✅</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderId}</p>
            </div>

            <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="margin: 0 0 15px 0; color: #28a745; font-size: 20px;">Hi ${order.name},</h2>
                <p style="margin: 10px 0; font-size: 16px; line-height: 1.8;">
                  Good news! Your return request for order <strong>#${orderId}</strong> has been approved.
                </p>
              </div>

              <div style="background: #d4edda; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                <h3 style="margin: 0 0 10px 0; color: #155724;">✅ Return Approved</h3>
                <p style="margin: 0; color: #155724;">Please follow the instructions below to complete your return.</p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 15px 0; color: #333;">Return Instructions</h3>
                <ol style="margin: 10px 0; padding-left: 20px; line-height: 2;">
                  <li>Pack the items securely in original packaging (if possible)</li>
                  <li>Include a copy of your order confirmation</li>
                  <li>Contact us for pickup arrangements</li>
                  <li>Refund will be processed after we receive the return</li>
                </ol>
              </div>

              <div style="background: #e3f2fd; padding: 20px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
                <h3 style="margin: 0 0 10px 0; color: #1565c0;">💰 Refund Information</h3>
                <p style="margin: 5px 0;"><strong>Refund Amount:</strong> $${order.totalPrice.toFixed(2)}</p>
                <p style="margin: 5px 0; font-size: 14px; color: #1565c0;">
                  Refund will be credited within 5-7 business days after return verification.
                </p>
              </div>

              <!-- Footer -->
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6;">
                <p style="margin: 5px 0; color: #666; font-size: 14px;">Questions? We're here to help!</p>
                <p style="margin: 10px 0;">
                  <a href="mailto:${process.env.ADMIN_EMAIL}"
                    style="display: inline-block; background: #155724; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Contact Support
                  </a>
                </p>
                <p style="margin: 15px 0 5px 0; font-size: 13px; color: #888;">
                  Email: <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #155724; text-decoration: none;">${process.env.ADMIN_EMAIL}</a>
                </p>
                <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                  This is an automated email. Please do not reply directly to this message.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
  `;

    await sendEmail({
      to: order.email,
      subject: `Return Approved - #${orderId} ✅`,
      html
    });

    console.log('✅ Return approved email sent');
  } catch (error) {
    console.error('❌ Return approved email error:', error.message);
  }
}

/**
 * 8. RETURN REJECTED - Return denied
 */
async function sendReturnRejectedEmail(order, rejectionReason) {
  try {
    const orderId = order.guestOrderCode || order._id.toString().slice(-8).toUpperCase();

    const html = `
    < !DOCTYPE html >
      <html>
        <head>
          <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="margin: 0; font-size: 28px;">Return Request Declined</h1>
                  <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderId}</p>
                </div>

                <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
                  <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h2 style="margin: 0 0 15px 0; color: #dc3545; font-size: 20px;">Hi ${order.name},</h2>
                    <p style="margin: 10px 0; font-size: 16px; line-height: 1.8;">
                      We regret to inform you that your return request for order <strong>#${orderId}</strong> has been declined.
                    </p>
                  </div>

                  <div style="background: #f8d7da; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
                    <h3 style="margin: 0 0 10px 0; color: #721c24;">Reason for Rejection</h3>
                    <p style="margin: 0; color: #721c24;">${rejectionReason}</p>
                  </div>

                  <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin: 0 0 15px 0; color: #333;">Have Questions?</h3>
                    <p style="margin: 0; line-height: 1.8;">
                      If you have any questions or concerns about this decision, please don't hesitate to contact us. We're here to help!
                    </p>
                  </div>

                  <!-- Footer -->
                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6;">
                    <p style="margin: 5px 0; color: #666; font-size: 14px;">Questions? We're here to help!</p>
                    <p style="margin: 10px 0;">
                      <a href="mailto:${process.env.ADMIN_EMAIL}"
                        style="display: inline-block; background: #dc3545; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Contact Support
                      </a>
                    </p>
                    <p style="margin: 15px 0 5px 0; font-size: 13px; color: #888;">
                      Email: <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #dc3545; text-decoration: none;">${process.env.ADMIN_EMAIL}</a>
                    </p>
                    <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                      This is an automated email. Please do not reply directly to this message.
                    </p>
                  </div>
                </div>
              </div>
            </body>
          </html>
          `;

    await sendEmail({
      to: order.email,
      subject: `Return Request Declined - #${orderId}`,
      html
    });

    console.log('✅ Return rejected email sent');
  } catch (error) {
    console.error('❌ Return rejected email error:', error.message);
  }
}

/**
 * Tracking update email
 */
async function sendTrackingUpdateEmail(order, trackingId) {
  try {
    const orderId = order.guestOrderCode || order._id.toString().slice(-8).toUpperCase();

    const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                      <h1 style="margin: 0; font-size: 28px;">Tracking Information Updated 📦</h1>
                      <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${orderId}</p>
                    </div>

                    <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
                      <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="margin: 0 0 15px 0; color: #2196f3; font-size: 20px;">Hi ${order.name},</h2>
                        <p style="margin: 10px 0; font-size: 16px; line-height: 1.8;">
                          Your order <strong>#${orderId}</strong> tracking information has been updated.
                        </p>
                      </div>

                      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h3 style="margin: 0 0 15px 0; color: #333; text-align: center;">Tracking ID</h3>
                        <div style="background: #e3f2fd; padding: 20px; border-radius: 4px; text-align: center;">
                          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2196f3; letter-spacing: 1px;">${trackingId}</p>
                        </div>
                        <p style="margin: 15px 0 0 0; font-size: 14px; color: #666; text-align: center;">
                          Use this tracking ID to monitor your shipment
                        </p>
                      </div>

                      <div style="background: #e3f2fd; padding: 20px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
                        <p style="margin: 0; color: #1565c0;">
                          <strong>📍 Track Your Shipment:</strong><br>
                            You can use this tracking ID to monitor your shipment's progress and estimated delivery time.
                        </p>
                      </div>

                      <!-- Footer -->
                      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6;">
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">Questions? We're here to help!</p>
                        <p style="margin: 10px 0;">
                          <a href="mailto:${process.env.ADMIN_EMAIL}"
                            style="display: inline-block; background: #2196f3; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Contact Support
                          </a>
                        </p>
                        <p style="margin: 15px 0 5px 0; font-size: 13px; color: #888;">
                          Email: <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #2196f3; text-decoration: none;">${process.env.ADMIN_EMAIL}</a>
                        </p>
                        <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                          This is an automated email. Please do not reply directly to this message.
                        </p>
                      </div>
                    </div>
                  </div>
                </body>
              </html>
              `;

    await sendEmail({
      to: order.email,
      subject: `Tracking Update - #${orderId}`,
      html
    });

    console.log('✅ Tracking update email sent');
  } catch (error) {
    console.error('❌ Tracking email error:', error.message);
  }
}

/**
 * Review notification to admin
 */
async function sendReviewNotificationToAdmin(review) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.log('⚠️ No admin email configured');
      return;
    }

    const subject = `New Review Received - ${review.rating}⭐`;
    const html = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                          <h1 style="margin: 0; font-size: 28px;">⭐ New Review Received</h1>
                          <p style="margin: 10px 0 0 0; font-size: 16px;">${'⭐'.repeat(review.rating || 0)}</p>
                        </div>

                        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
                          <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h2 style="margin: 0 0 15px 0; color: #ffc107; font-size: 20px;">Review Details</h2>
                            <p style="margin: 5px 0;"><strong>Review ID:</strong> ${review._id || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>User:</strong> ${review.userName || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Email:</strong> ${review.userEmail || 'N/A'}</p>
                            <p style="margin: 5px 0;"><strong>Rating:</strong> ${review.rating || 0}/5</p>
                            <p style="margin: 5px 0;"><strong>Book:</strong> ${review.bookTitle || review.bookId || 'Unknown'}</p>
                          </div>

                          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
                            <h3 style="margin: 0 0 10px 0; color: #856404;">Comment</h3>
                            <p style="margin: 0; color: #856404;">${review.comment || 'No comment provided'}</p>
                          </div>

                          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="margin: 5px 0; color: #666; font-size: 14px;">
                              Review this in your admin dashboard
                            </p>
                          </div>
                        </div>
                      </div>
                    </body>
                  </html>
                  `;

    const result = await sendEmail({ to: adminEmail, subject, html });

    if (result?.messageId) {
      console.log('✅ Review notification email sent:', result.messageId);
    } else {
      console.log('✅ Review notification sent');
    }
  } catch (error) {
    console.error('❌ Review notification email error:', error.message);
  }
}

// ✅ REVIEW DISAPPROVAL EMAIL
async function sendReviewDisapprovedEmail(reviewData, reason) {
  try {
    const { userName, bookName, comment, rating, userEmail } = reviewData;

    const html = `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                            <!-- Header -->
                            <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                              <h1 style="margin: 0; font-size: 28px;">⚠️ Review Not Approved</h1>
                              <p style="margin: 10px 0 0 0; font-size: 16px;">Your review has been disapproved</p>
                            </div>

                            <!-- Content -->
                            <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
                              <!-- User Info -->
                              <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <h2 style="margin: 0 0 15px 0; color: #dc3545; font-size: 20px;">Hi ${userName},</h2>
                                <p style="margin: 10px 0; font-size: 16px; line-height: 1.8;">
                                  We regret to inform you that your review for <strong>${bookName}</strong> has been disapproved and will not be published on our website.
                                </p>
                              </div>

                              <!-- Review Details -->
                              <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <h3 style="margin: 0 0 15px 0; color: #333;">Your Review</h3>
                                <p style="margin: 5px 0;"><strong>Book:</strong> ${bookName}</p>
                                <p style="margin: 5px 0;"><strong>Rating:</strong> ${'⭐'.repeat(rating)}</p>
                                <p style="margin: 5px 0;"><strong>Comment:</strong></p>
                                <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 10px;">
                                  <p style="margin: 0; font-style: italic; color: #666;">"${comment}"</p>
                                </div>
                              </div>

                              <!-- Reason -->
                              <div style="background: #f8d7da; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
                                <h3 style="margin: 0 0 10px 0; color: #721c24;">Reason for Disapproval</h3>
                                <p style="margin: 0; color: #721c24;">${reason}</p>
                              </div>

                              <!-- Guidelines -->
                              <div style="background: #e7f3ff; padding: 20px; margin-top: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
                                <p style="margin: 0; color: #1565c0;">
                                  <strong>💡 Review Guidelines:</strong><br>
                                    • Be respectful and constructive<br>
                                      • Focus on the book content<br>
                                        • Avoid inappropriate language<br>
                                          • Share genuine experiences
                                        </p>
                                      </div>

                                      <!-- Footer -->
                                      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                                        <p style="margin: 5px 0; color: #666;">Have questions? Contact us at</p>
                                        <p style="margin: 5px 0;"><a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #667eea; text-decoration: none;">${process.env.ADMIN_EMAIL}</a></p>
                                        <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                                          This is an automated email. Please do not reply directly to this message.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </body>
                              </html>
                              `;

    // ✅ CORRECTED: Pass object with named properties
    await sendEmail({
      to: userEmail,
      subject: `Review Disapproved - ${bookName}`,
      html: html
    });

    console.log('✅ Review disapproval email sent');
    return { success: true };
  } catch (error) {
    console.error('❌ Review disapproval email error:', error.message);
    return { success: false, error: error.message };
  }
}

async function sendContactFormEmail({ name, email, subject, message, contactId }) {
  try {
    const enquiriesEmail = 'india.lumos@gmail.com';

    const html = `
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  <style>
                                    body {
                                      font - family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                    line-height: 1.6;
                                    color: #333;
          }
                                    .header {
                                      background: linear-gradient(135deg, #002bebff 0%, #65b2faff 100%);
                                    color: white;
                                    padding: 30px;
                                    text-align: center;
                                    border-radius: 10px 10px 0 0;
          }
                                    .content {
                                      background: #f9f9f9;
                                    padding: 30px;
                                    border: 1px solid #e0e0e0;
          }
                                    .info-box {
                                      background: white;
                                    padding: 20px;
                                    margin: 15px 0;
                                    border-radius: 8px;
                                    border-left: 4px solid #667eea;
          }
                                    .label {
                                      font - weight: bold;
                                    color: #667eea;
                                    display: inline-block;
                                    min-width: 100px;
          }
                                    .message-box {
                                      background: white;
                                    padding: 20px;
                                    margin: 20px 0;
                                    border-radius: 8px;
                                    border: 1px solid #e0e0e0;
                                    white-space: pre-wrap;
                                    word-wrap: break-word;
          }
                                    .footer {
                                      background: #333;
                                    color: #fff;
                                    padding: 20px;
                                    text-align: center;
                                    border-radius: 0 0 10px 10px;
                                    font-size: 12px;
          }
                                    .metadata {
                                      font - size: 12px;
                                    color: #666;
                                    margin-top: 20px;
                                    padding-top: 20px;
                                    border-top: 1px solid #ddd;
          }
                                  </style>
                                </head>
                                <body style="max-width: 600px; margin: 0 auto; padding: 20px;">
                                  <div class="header">
                                    <h1 style="margin: 0;">New Contact Form Submission</h1>
                                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Sita</p>
                                  </div>

                                  <div class="content">
                                    <p style="font-size: 16px; margin-bottom: 20px;">
                                      You have received a new message from your website contact form.
                                    </p>

                                    <div class="info-box">
                                      <p><span class="label">From:</span> ${name}</p>
                                      <p><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></p>
                                      <p><span class="label">Subject:</span> ${subject}</p>
                                    </div>

                                    <h3 style="color: #667eea; margin-top: 30px;">Message:</h3>
                                    <div class="message-box">
                                      ${message}
                                    </div>

                                    <div class="metadata">
                                      <p><strong>Received:</strong> ${new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'Asia/Kolkata'
    })}</p>
                                    </div>
                                  </div>
                                </body>
                              </html>
                              `;

    await sendEmail({
      to: enquiriesEmail,
      subject: `[Contact Form] ${subject}`,
      html: html
    });

    console.log(`✅ Contact form email sent to ${enquiriesEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    throw error;
  }
}


/**
 * 8. EVENT BOOKING CONFIRMATION
 */
async function sendBookingConfirmationEmail(booking) {
  try {
    const eventParams = booking.event || {};
    const eventDate = new Date(eventParams.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const html = `
                              <!DOCTYPE html>
                              <html>
                                <head>
                                  <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    </head>
                                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
                                      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                                        <div style="background: linear-gradient(135deg, #c86836 0%, #0D0842 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                                          <h1 style="margin: 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
                                          <p style="margin: 10px 0 0 0; font-size: 16px;">We look forward to seeing you, ${booking.userName}!</p>
                                        </div>

                                        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
                                          <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                            <h2 style="margin: 0 0 15px 0; color: #c86836; font-size: 20px;">Event Details</h2>
                                            <p style="margin: 8px 0;"><strong>Event:</strong> ${eventParams.title || 'Sita Event'}</p>
                                            <p style="margin: 8px 0;"><strong>Date:</strong> ${eventDate}</p>
                                            <p style="margin: 8px 0;"><strong>Time:</strong> ${eventParams.startTime} - ${eventParams.endTime}</p>
                                            <p style="margin: 8px 0;"><strong>Mode:</strong> ${eventParams.mode}</p>
                                            <p style="margin: 8px 0;"><strong>Location:</strong> ${eventParams.location || 'Online'}</p>
                                          </div>

                                          <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                            <h3 style="margin: 0 0 15px 0; color: #333;">Booking Summary</h3>
                                            <p style="margin: 5px 0;"><strong>Primary Contact:</strong> ${booking.userName}</p>
                                            <p style="margin: 5px 0;"><strong>Seats:</strong> ${booking.seats}</p>
                                            
                                            ${booking.participants && booking.participants.length > 0 ? `
                                              <div style="margin: 15px 0; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                                                <p style="margin: 0 0 5px 0; font-weight: bold;">Participants:</p>
                                                ${booking.participants.map(p => `
                                                  <p style="margin: 3px 0; font-size: 14px;">• ${p.name} (${p.email})</p>
                                                `).join('')}
                                              </div>
                                            ` : ''}

                                            <p style="margin: 5px 0;"><strong>Amount Paid:</strong> <span style="color: #28a745; font-weight: bold;">$${booking.totalAmount}</span></p>
                                            <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${booking._id.toString().slice(-6).toUpperCase()}</p>
                                          </div>

                                          <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0056b3;">
                                            <p style="margin: 0; color: #004085;">
                                              <strong>💡 Need Help?</strong><br>
                                                If you have any questions or need to reschedule, please reply to this email or contact us at ${process.env.ADMIN_EMAIL}.
                                            </p>
                                          </div>

                                          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                                            <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                                              Sita
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </body>
                                  </html>
                                  `;

    await sendEmail({
      to: booking.userEmail,
      subject: `Booking Confirmed: ${eventParams.title}`,
      html
    });

    console.log(`✅ Booking confirmation email sent to ${booking.userEmail}`);
  } catch (error) {
    console.error('❌ Booking email error:', error.message);
  }
}

/**
 * 9. EVENT RATING - Invite user to rate event
 */
async function sendEventRatingEmail(booking, event) {
  try {
    const userEmail = booking.userEmail;
    const userName = booking.userName;
    const eventName = event.title;
    const baseUrl = process.env.CLIENT_URL
      ? (process.env.CLIENT_URL.startsWith('http') ? process.env.CLIENT_URL : `https://${process.env.CLIENT_URL}`)
      : 'http://booking.localhost:5173';

    // Collect all unique participants (Main booker + Participants)
    const participants = new Map();
    participants.set(userEmail, { name: userName, email: userEmail });

    console.log(`DEBUG: Booking ID: ${booking._id}`);
    console.log(`DEBUG: Main User: ${userEmail}`);
    console.log(`DEBUG: Participants Raw:`, JSON.stringify(booking.participants));

    if (booking.participants && booking.participants.length > 0) {
      booking.participants.forEach(p => {
        if (p.email) {
          participants.set(p.email, { name: p.name, email: p.email });
        }
      });
    }

    console.log(`📧 Sending rating emails to ${participants.size} participants for Event: ${eventName}`);

    const emailPromises = [];

    for (const participant of participants.values()) {
      const ratingLink = `${baseUrl}/rate-event/${booking._id}?email=${encodeURIComponent(participant.email)}`;

      const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">How was the event? 🌟</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">We'd love to hear your thoughts!</p>
              </div>
              
              <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
                <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <h2 style="margin: 0 0 15px 0; color: #EE5253; font-size: 20px;">Hi ${participant.name},</h2>
                  <p style="margin: 10px 0; font-size: 16px; line-height: 1.8;">
                    Thank you for attending <strong>${eventName}</strong>. We hope you had a great time!
                  </p>
                  <p style="margin: 10px 0; font-size: 16px; line-height: 1.8;">
                    Your feedback helps us create better experiences for our community. Please take a moment to rate the event.
                  </p>
                </div>
    
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${ratingLink}" 
                     style="display: inline-block; background: #EE5253; color: white; padding: 15px 35px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(238, 82, 83, 0.3);">
                    Rate This Event
                  </a>
                </div>
    
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #dee2e6;">
                  <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                    If you didn't attend this event, you can ignore this email.
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

      emailPromises.push(
        sendEmail({
          to: participant.email,
          subject: `How was ${eventName}? - Rate your experience`,
          html
        }).then(() => console.log(`✅ Rating email sent to ${participant.email}`))
          .catch(err => console.error(`❌ Failed to send rating email to ${participant.email}:`, err.message))
      );
    }

    await Promise.all(emailPromises);
    return true;
  } catch (error) {
    console.error('❌ Rating email error:', error.message);
    return false;
  }
}


/**
 * 10. EVENT RATED - Notify Admin of new rating
 */
async function sendEventRatedEmailAdmin(rating, booking) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.log('⚠️ No admin email configured for rating notification');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">New Event Rating ⭐</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">${booking.event?.title || 'Unknown Event'}</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 15px 0; color: #F57C00; font-size: 20px;">Rating Details</h2>
              <p style="margin: 5px 0;"><strong>User:</strong> ${rating.userName} (${rating.userEmail})</p>
              <p style="margin: 5px 0;"><strong>Rating:</strong> ${'⭐'.repeat(rating.rating)} (${rating.rating}/5)</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString('en-IN')}</p>
            </div>

            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #F57C00;">
              <h3 style="margin: 0 0 10px 0; color: #856404;">Comment</h3>
              <p style="margin: 0; color: #856404; font-style: italic;">"${rating.comment || 'No comment provided'}"</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="margin: 5px 0; color: #666; font-size: 14px;">
                Review this rating in your admin dashboard to approve/disapprove it.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `New Rating: ${rating.rating}⭐ for ${booking.event?.title}`,
      html
    });

    console.log(`✅ Admin event rating email sent to ${adminEmail}`);
  } catch (error) {
    console.error('❌ Admin rating email error:', error.message);
  }
}

module.exports = {
  sendEmail,
  sendOrderPlacedEmailCustomer,
  sendOrderPlacedEmailAdmin,
  sendShippedEmail,
  sendDeliveredEmail,
  sendCancelledEmail,
  sendReturnRequestedEmail,
  sendReturnApprovedEmail,
  sendReturnRejectedEmail,
  sendTrackingUpdateEmail,
  sendReviewNotificationToAdmin,
  sendReviewDisapprovedEmail,
  sendContactFormEmail,
  sendBookingConfirmationEmail,
  sendEventRatingEmail,
  sendEventRatedEmailAdmin
};

