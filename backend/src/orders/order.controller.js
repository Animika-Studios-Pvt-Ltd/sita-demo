const Order = require("./order.model");
const User = require("../users/user.model");
const Book = require("../books/book.model");
const emailService = require("../services/emailService");
const smsService = require("../services/smsService");
const axios = require("axios");

const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return '+' + cleaned;
  }
  if (cleaned.length === 10) {
    return '+91' + cleaned;
  }
  if (phone.startsWith('+')) {
    return phone;
  }
  return '+' + cleaned;
};

// ✅ Helper function to calculate shipping and get cheapest courier
const calculateShippingCharge = async (destinationPincode, totalWeight, declaredValue) => {
  try {
    console.log('📦 Calculating shipping charge...');
    const response = await axios.post(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/shipping/calculate-shipping`, {
      destination_pincode: destinationPincode,
      origin_pincode: process.env.NIMBUSPOST_ORIGIN_PINCODE || '560008',
      weight: totalWeight,
      length: 20,
      breadth: 15,
      height: 10,
      declared_value: declaredValue,
    });

    if (response.data.success) {
      return {
        shippingCharge: response.data.shippingCharge,
        estimatedDays: response.data.estimatedDays,
        courierId: response.data.recommendedCourier?.id,
        courierName: response.data.recommendedCourier?.name,
      };
    }

    return {
      shippingCharge: 50,
      estimatedDays: '7-10 days',
      courierId: 'default',
      courierName: 'Standard Delivery',
    };
  } catch (error) {
    console.error('❌ Shipping calculation error:', error.message);
    return {
      shippingCharge: 50,
      estimatedDays: '7-10 days',
      courierId: 'default',
      courierName: 'Standard Delivery',
    };
  }
};

// ✅ UPDATED: Helper function to create shipment with Nimbuspost
const createShipmentWithNimbuspost = async (orderData, shippingInfo) => {
  try {
    console.log('\n========================================');
    console.log('🚚 Creating shipment with Nimbuspost');
    console.log('========================================');
    console.log('Order Code:', orderData.orderCode);

    // ✅ Calculate weight in GRAMS (as INTEGER)
    const totalWeightInGrams = orderData.products.reduce((sum, item) => {
      const weight = item.weight || 250; // Default 250g per book
      return sum + (weight * item.quantity);
    }, 0);

    console.log('Total Weight:', totalWeightInGrams, 'grams');
    console.log('Total Weight (kg):', (totalWeightInGrams / 1000).toFixed(2), 'kg');

    // ✅ UPDATE #1: Fixed phone number extraction (10 digits only)
    const cleanPhone = orderData.phone.replace(/\D/g, ''); // Remove all non-digits
    const phone10Digit = cleanPhone.slice(-10); // Get last 10 digits

    console.log('Original phone:', orderData.phone);
    console.log('Cleaned phone (10 digits):', phone10Digit);

    const shipmentPayload = {
      order_id: orderData.orderCode,
      customer_name: orderData.name,
      customer_phone: phone10Digit, // ✅ FIXED: 10 digits only
      customer_email: orderData.email,
      customer_address: orderData.address.street,
      customer_city: orderData.address.city,
      customer_state: orderData.address.state,
      customer_pincode: orderData.address.zipcode,
      customer_country: orderData.address.country || 'India',
      
      // ✅ UPDATE #2: Product details with SKU
      product_details: orderData.products.map(p => ({
        name: p.title,
        qty: p.quantity,
        price: p.price,
        sku: p.sku || `BOOK-${p.bookId?.substring(0, 8) || 'DEFAULT'}`,
      })),
      
      total_amount: orderData.totalPrice,
      
      // ✅ FIX: Send weight as INTEGER in GRAMS (not kg)
      weight: Math.round(totalWeightInGrams), // Ensure it's an integer
      
      length: 20,
      breadth: 15,
      height: 10,
    };

    console.log('📤 Payload:', JSON.stringify(shipmentPayload, null, 2));

    const response = await axios.post(
      `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/shipping/create-shipment`,
      shipmentPayload,
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Rest of your code remains the same...
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));

    if (response.data.success && response.data.awb_number) {
      console.log('========================================');
      console.log('✅ Shipment Created Successfully');
      console.log('========================================');
      console.log('AWB Number:', response.data.awb_number);
      console.log('Shipment ID:', response.data.shipment_id);
      console.log('Courier:', response.data.courier_name);
      console.log('Label URL:', response.data.label_url);
      console.log('========================================\n');

      return {
        trackingId: response.data.awb_number,
        shipmentId: response.data.shipment_id,
        labelUrl: response.data.label_url,
        courierName: response.data.courier_name,
      };
    }

    console.log('⚠️ Shipment creation returned unsuccessful');
    return null;

  } catch (error) {
    console.error('\n========================================');
    console.error('❌ SHIPMENT CREATION ERROR');
    console.error('========================================');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('========================================\n');
    return null;
  }
};

const createAOrder = async (req, res) => {
  try {
    let orderCode;
    let isUnique = false;
    while (!isUnique) {
      orderCode = generateOrderCode();
      const existing = await Order.findOne({ orderCode });
      if (!existing) isUnique = true;
    }

    console.log('🔖 Generated Order Code:', orderCode);

    const {
      userId,
      name,
      email,
      phone,
      address,
      productIds,
      products,
      totalPrice,
      giftWrapCharge,
      giftTo,
      giftFrom,
      giftMessage,
      giftAddress,
      paymentId,
      razorpayOrderId,
      cashfreeOrderId,
    } = req.body;

    console.log('📦 Creating order request received');
    console.log('📋 User ID provided:', userId);
    console.log('📧 Email:', email);

    // Validation
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid products format." });
    }

    if (!paymentId) {
      return res.status(400).json({
        message: "Payment ID is required. Please complete payment first."
      });
    }

    if (!address || !address.street || !address.city || !address.state || !address.zipcode) {
      return res.status(400).json({ message: "Complete address is required." });
    }

    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) {
      return res.status(400).json({ message: "Invalid phone number format." });
    }

    // Fetch UID from user collection
    let finalUserId = 'guest';
    let isGuestOrder = true;
    if (userId && userId !== 'guest') {
      const user = await User.findOne({ uid: userId });
      if (user) {
        finalUserId = user.uid;
        isGuestOrder = false;
        console.log('✅ Found registered user:', user.email, '| UID:', user.uid);
      } else {
        const userByEmail = await User.findOne({ email: email });
        if (userByEmail && userByEmail.uid) {
          finalUserId = userByEmail.uid;
          isGuestOrder = false;
          console.log('✅ Found user by email:', userByEmail.email, '| UID:', userByEmail.uid);
        } else {
          console.log('⚠️ User not found in database, treating as guest order');
        }
      }
    } else {
      console.log('⚠️ No userId provided, creating guest order');
    }

    console.log('📝 Final User ID:', finalUserId);
    console.log('🎭 Is Guest Order:', isGuestOrder);

    const guestOrderCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Extract product IDs from products array
    const extractedProductIds = products.map(item => item.bookId);
    console.log('📚 Extracted productIds:', extractedProductIds);

    // Check and reduce stock
    for (const item of products) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(404).json({
          message: `Book not found: ${item.title || item.bookId}`
        });
      }

      if (book.suspended) {
        return res.status(400).json({
          message: `${book.title} is currently unavailable.`
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${book.title}. Available: ${book.stock}, Requested: ${item.quantity}`
        });
      }

      book.stock -= item.quantity;
      await book.save();
      console.log(`📚 Reduced stock for ${book.title}: ${item.quantity} units`);
    }

    // ✅ UPDATE #2: Calculate total weight with new default (250g)
    const totalWeightInGrams = products.reduce((sum, item) => {
  return sum + ((item.weight || 250) * item.quantity);
}, 0);

console.log('⚖️ Total weight:', totalWeightInGrams, 'grams');
console.log('⚖️ Total weight (kg):', (totalWeightInGrams / 1000).toFixed(2), 'kg');

// Pass weight in GRAMS to shipping calculation
const shippingInfo = await calculateShippingCharge(
  address.zipcode,
  Math.round(totalWeightInGrams), // ✅ Send as integer grams
  totalPrice
);

    console.log('💰 Calculated shipping:', shippingInfo.shippingCharge);
    console.log('🚚 Selected courier:', shippingInfo.courierName);

    // Create order data
    const orderData = {
      userId: finalUserId,
      isGuestOrder: isGuestOrder,
      name,
      email,
      phone: formattedPhone,
      address: {
        street: address.street,
        city: address.city,
        country: address.country || 'India',
        state: address.state,
        zipcode: address.zipcode,
      },
      productIds: extractedProductIds,
      products,
      totalPrice,
      shippingCharge: shippingInfo.shippingCharge,
      giftWrapCharge: giftWrapCharge || 0,
      estimatedDelivery: shippingInfo.estimatedDays,
      courierId: shippingInfo.courierId,
      courierName: shippingInfo.courierName,
      guestOrderCode,
      orderCode,
      paymentId: paymentId,
      razorpayOrderId: razorpayOrderId,
      cashfreeOrderId: cashfreeOrderId,
      paymentStatus: 'paid',
      paymentMethod: cashfreeOrderId ? 'cashfree' : 'razorpay',
    };

    // Add gift details if provided
    if (giftTo || giftFrom || giftMessage) {
      orderData.giftTo = giftTo;
      orderData.giftFrom = giftFrom;
      orderData.giftMessage = giftMessage;
    }

    // Add gift address if provided
    if (giftAddress && giftAddress.street) {
      orderData.giftAddress = {
        street: giftAddress.street,
        city: giftAddress.city,
        country: giftAddress.country || 'India',
        state: giftAddress.state,
        zipcode: giftAddress.zipcode,
      };
    }

    console.log('💾 Saving order with userId:', finalUserId);
    console.log('💾 ProductIds:', extractedProductIds);
    console.log('💾 Order Code:', orderCode);

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    console.log('✅ Order created successfully');
    console.log('   Order ID:', savedOrder._id);
    console.log('   Order Code:', savedOrder.orderCode);
    console.log('   User ID:', savedOrder.userId);
    console.log('   Guest Order:', savedOrder.isGuestOrder);
    console.log('   Guest Code:', guestOrderCode);
    console.log('   Payment Status:', savedOrder.paymentStatus);
    console.log('   Total:', '$' + savedOrder.totalPrice);
    console.log('   Shipping:', '$' + savedOrder.shippingCharge);

    // ✅ UPDATED: Create shipment with Nimbuspost after order is saved
    const shipmentInfo = await createShipmentWithNimbuspost(orderData, shippingInfo);

    if (shipmentInfo && shipmentInfo.trackingId) {
      // ✅ UPDATE #5: Save courierName from shipment response
      savedOrder.trackingId = shipmentInfo.trackingId;
      savedOrder.shipmentId = shipmentInfo.shipmentId;
      savedOrder.labelUrl = shipmentInfo.labelUrl;
      savedOrder.courierName = shipmentInfo.courierName || shippingInfo.courierName;
      savedOrder.status = 'Processing';
      await savedOrder.save();
      
      console.log('✅ Order updated with shipment details');
      console.log('   AWB:', shipmentInfo.trackingId);
      console.log('   Courier:', shipmentInfo.courierName);
      console.log('   Status: Processing');
    } else {
      console.log('⚠️ Shipment creation failed - order saved without tracking');
      console.log('   Manual shipment creation may be required');
    }

    // Link payment to order
    try {
      const Payment = require('../payments/payment.model');
      await Payment.findOneAndUpdate(
        { $or: [{ razorpayPaymentId: paymentId }, { cashfreePaymentId: paymentId }] },
        { $set: { orderId: savedOrder._id } }
      );
      console.log('🔗 Payment linked to order');
    } catch (err) {
      console.error('⚠️ Failed to link payment:', err.message);
    }

    // Send notifications
    console.log('📱 Sending notifications...');
    try {
      await smsService.sendDetailedOrderConfirmation(savedOrder)
        .then(() => console.log('✅ Customer SMS sent'))
        .catch(err => console.error('❌ Customer SMS failed:', err.message));

      await smsService.sendDetailedAdminAlert(savedOrder)
        .then(() => console.log('✅ Admin SMS sent'))
        .catch(err => console.error('❌ Admin SMS failed:', err.message));

      await emailService.sendOrderPlacedEmailCustomer(savedOrder)
        .then(() => console.log('✅ Customer email sent'))
        .catch(err => console.error('❌ Customer email failed:', err.message));

      await emailService.sendOrderPlacedEmailAdmin(savedOrder)
        .then(() => console.log('✅ Admin email sent'))
        .catch(err => console.error('❌ Admin email failed:', err.message));

      console.log('✅ All notifications processed');
    } catch (notificationError) {
      console.error('❌ Notification error:', notificationError.message);
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: shipmentInfo 
        ? "Order placed and shipment created successfully!" 
        : "Order placed successfully!",
      order: savedOrder,
      isGuestOrder: isGuestOrder,
      tracking: shipmentInfo ? {
        awb: shipmentInfo.trackingId,
        courier: shipmentInfo.courierName,
        label: shipmentInfo.labelUrl,
      } : null,
    });

  } catch (error) {
    console.error("❌ Error creating order:", error);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

const generateOrderCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('📥 Fetching orders for userId:', userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findOne({ uid: userId });
    if (!user) {
      console.log('⚠️ User not found in database');
      return res.status(200).json([]);
    }

    console.log('✅ User found:', user.email);
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
    console.log(`📊 Found ${orders.length} orders for user ${userId}`);

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders by userId:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('📝 Updating order:', id);
    console.log('   Update data:', JSON.stringify(updateData, null, 2));

    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = existingOrder.status;
    const previousTrackingId = existingOrder.trackingId;
    const newStatus = updateData.status;
    const newTrackingId = updateData.trackingId;

    console.log('🔄 Updating order status:', previousStatus, '→', newStatus);

    // Handle Delivered timestamp
    if (newStatus === "Delivered" && previousStatus !== "Delivered") {
      updateData.deliveredAt = new Date();
    } else if (previousStatus === "Delivered" && newStatus !== "Delivered") {
      updateData.deliveredAt = null;
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Update sold count for delivered orders
    if (previousStatus !== "Delivered" && newStatus === "Delivered") {
      console.log('📚 Updating sold count');
      for (const item of existingOrder.products) {
        const book = await Book.findById(item.bookId);
        if (book) {
          book.sold = (book.sold || 0) + item.quantity;
          await book.save();
        }
      }
    } else if (previousStatus === "Delivered" && newStatus !== "Delivered") {
      console.log('📚 Reverting sold count');
      for (const item of existingOrder.products) {
        const book = await Book.findById(item.bookId);
        if (book) {
          book.sold = Math.max(0, (book.sold || 0) - item.quantity);
          await book.save();
        }
      }
    }

    // Restore stock for cancelled orders
    if (newStatus === "Cancelled" && previousStatus !== "Cancelled") {
      console.log('📚 Restoring stock for cancelled order');
      for (const item of existingOrder.products) {
        const book = await Book.findById(item.bookId);
        if (book) {
          book.stock = (book.stock || 0) + item.quantity;
          await book.save();
          console.log(`   Restored ${item.quantity} units to ${book.title}`);
        }
      }
    }

    // Send status update notifications
    const notificationPromises = [];

    if (newStatus === "Processing" && previousStatus !== "Processing") {
      console.log('📱 Sending processing notifications');
      notificationPromises.push(
        smsService.sendProcessingUpdate(updatedOrder),
        emailService.sendProcessingEmail(updatedOrder)
      );
    }

    if (newStatus === "Shipped" && previousStatus !== "Shipped") {
      console.log('📱 Sending shipping notifications');
      notificationPromises.push(
        smsService.sendDetailedShippingUpdate(updatedOrder),
        emailService.sendShippedEmail(updatedOrder)
      );
    }

    if (newStatus === "Delivered" && previousStatus !== "Delivered") {
      console.log('📱 Sending delivered notifications');
      notificationPromises.push(
        smsService.sendDeliveredUpdate(updatedOrder),
        emailService.sendDeliveredEmail(updatedOrder)
      );
    }

    if (newStatus === "Cancelled" && previousStatus !== "Cancelled") {
      const cancellationReason = updateData.cancellationReason || 'As per request';
      console.log('📱 Sending cancellation notifications');
      notificationPromises.push(
        smsService.sendDetailedCancellation(updatedOrder, cancellationReason),
        emailService.sendCancelledEmail(updatedOrder, cancellationReason)
      );
    }

    if (newStatus === "Return Requested" && previousStatus !== "Return Requested") {
      console.log('📱 Sending return requested notifications');
      notificationPromises.push(
        smsService.sendReturnRequestedUpdate(updatedOrder),
        emailService.sendReturnRequestedEmail(updatedOrder)
      );
    }

    if (newStatus === "Return Approved" && previousStatus !== "Return Approved") {
      console.log('📱 Sending return approved notifications');
      notificationPromises.push(
        smsService.sendReturnApprovedUpdate(updatedOrder),
        emailService.sendReturnApprovedEmail(updatedOrder)
      );
    }

    if (newStatus === "Return Rejected" && previousStatus !== "Return Rejected") {
      const rejectionReason = updateData.rejectionReason || 'Does not meet return policy';
      console.log('📱 Sending return rejected notifications');
      notificationPromises.push(
        smsService.sendReturnRejectedUpdate(updatedOrder, rejectionReason),
        emailService.sendReturnRejectedEmail(updatedOrder, rejectionReason)
      );
    }

    if (newTrackingId && newTrackingId !== previousTrackingId) {
      console.log('📧 Sending tracking update');
      notificationPromises.push(
        smsService.sendTrackingUpdate(updatedOrder, newTrackingId),
        emailService.sendTrackingUpdateEmail(updatedOrder, newTrackingId)
      );
    }

    if (notificationPromises.length > 0) {
      Promise.all(notificationPromises)
        .then(() => console.log('✅ Notifications sent'))
        .catch(err => console.error('❌ Notification error:', err.message));
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log(`📊 Retrieved ${orders.length} orders`);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// ========================================
// RETURN REQUEST FUNCTIONS
// ========================================

// Customer requests return
const requestReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ orderCode: orderId });
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if order is delivered
    if (order.status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Only delivered orders can be returned'
      });
    }

    // Check if already requested
    if (order.returnRequest && order.returnRequest.requested) {
      return res.status(400).json({
        success: false,
        message: 'Return already requested for this order'
      });
    }

    // Update order with return request
    order.returnRequest = {
      requested: true,
      requestDate: new Date(),
      reason: reason || 'No reason provided',
      status: 'pending',
      approvedBy: null,
      approvedDate: null,
      rejectionReason: null,
      returnAwb: null,
      returnShipmentId: null,
      returnLabelUrl: null
    };
    order.status = 'Return Requested';

    await order.save();

    console.log('📧 Return request notification sent to admin');

    // TODO: Send notification to admin via email/SMS

    res.json({
      success: true,
      message: 'Return request submitted successfully',
      returnRequest: order.returnRequest
    });
  } catch (error) {
    console.error('❌ Return request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request return',
      error: error.message
    });
  }
};

// Get all pending return requests (Admin)
const getPendingReturnRequests = async (req, res) => {
  try {
    const pendingReturns = await Order.find({
      'returnRequest.status': 'pending'
    }).populate('productIds').sort({ 'returnRequest.requestDate': -1 });

    res.json({
      success: true,
      count: pendingReturns.length,
      returns: pendingReturns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch return requests',
      error: error.message
    });
  }
};

// Admin approves return and creates shipment
const approveReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { adminId } = req.body; // From admin session

    const order = await Order.findOne({ orderCode: orderId });

    if (!order || !order.returnRequest || order.returnRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Invalid return request'
      });
    }

    // ✅ Create return shipment via Nimbuspost
    const returnShipmentResponse = await axios.post(
      `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/shipping/create-return`,
      {
        order_id: order.orderCode,
        awb_number: order.trackingId,
        return_reason: order.returnRequest.reason,
        customer_name: order.name,
        customer_phone: order.phone,
        customer_email: order.email,
        customer_address: order.address.street,
        customer_city: order.address.city,
        customer_state: order.address.state,
        customer_pincode: order.address.zipcode,
        product_details: order.products.map(p => ({
          name: p.title,
          qty: p.quantity,
          price: p.price,
          sku: `BOOK-${p.bookId}`
        })),
        total_amount: order.totalPrice,
        weight: order.products.reduce((sum, p) => sum + ((p.weight || 250) * p.quantity), 0)
      }
    );

    if (returnShipmentResponse.data.success) {
      order.returnRequest.status = 'approved';
      order.returnRequest.approvedBy = adminId || 'admin';
      order.returnRequest.approvedDate = new Date();
      order.returnRequest.returnAwb = returnShipmentResponse.data.return_awb;
      order.returnRequest.returnShipmentId = returnShipmentResponse.data.return_shipment_id;
      order.returnRequest.returnLabelUrl = returnShipmentResponse.data.return_label_url;
      order.status = 'Return Approved';

      await order.save();

      console.log('✅ Return approved and shipment created');

      res.json({
        success: true,
        message: 'Return approved and shipment created',
        returnDetails: {
          awb: order.returnRequest.returnAwb,
          labelUrl: order.returnRequest.returnLabelUrl,
          shipmentId: order.returnRequest.returnShipmentId
        }
      });
    } else {
      throw new Error('Failed to create return shipment');
    }
  } catch (error) {
    console.error('❌ Return approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve return',
      error: error.message
    });
  }
};

// Admin rejects return
const rejectReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { adminId, rejectionReason } = req.body;

    const order = await Order.findOne({ orderCode: orderId });

    if (!order || !order.returnRequest || order.returnRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Invalid return request'
      });
    }

    order.returnRequest.status = 'rejected';
    order.returnRequest.approvedBy = adminId || 'admin';
    order.returnRequest.approvedDate = new Date();
    order.returnRequest.rejectionReason = rejectionReason || 'Does not meet return policy';
    order.status = 'Return Rejected';

    await order.save();

    console.log('📧 Return rejection notification sent to customer');

    // TODO: Send notification to customer

    res.json({
      success: true,
      message: 'Return request rejected',
      rejectionReason: order.returnRequest.rejectionReason
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject return',
      error: error.message
    });
  }
};


module.exports = {
  createAOrder,
  generateOrderCode,
  getOrderByUserId,
  getAllOrders,
  updateOrderById,
  requestReturn,           // NEW
  getPendingReturnRequests, // NEW
  approveReturn,           // NEW
  rejectReturn,            // NEW
};

