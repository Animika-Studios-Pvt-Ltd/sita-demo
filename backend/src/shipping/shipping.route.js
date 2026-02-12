const express = require('express');
const axios = require('axios');
const router = express.Router();

// Nimbuspost API Configuration
const NIMBUSPOST_API_URL = 'https://api.nimbuspost.com/v1';
const NIMBUSPOST_EMAIL = process.env.NIMBUSPOST_EMAIL;
const NIMBUSPOST_PASSWORD = process.env.NIMBUSPOST_PASSWORD;

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  next();
};

// ✅ PREDEFINED ORIGIN
const ORIGIN_CONFIG = {
  pincode: process.env.NIMBUSPOST_ORIGIN_PINCODE || '560008',
  state: '56',
  city: '560',
  isKarnataka: true,
  isMetro: true,
  location: 'Bangalore, Karnataka'
};

// ✅ PRICING CONFIGURATION
const PRICING_CONFIG = {
  commission_percentage: 7, // 5-8% commission
  gst_percentage: 18, // GST on delivery charges
  minimum_weight_grams: 500, // Minimum billable weight
};

let authToken = null;
let tokenExpiry = null;

const getNimbuspostToken = async () => {
  try {
    if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
      return authToken;
    }

    const response = await axios.post(`${NIMBUSPOST_API_URL}/users/login`, {
      email: NIMBUSPOST_EMAIL,
      password: NIMBUSPOST_PASSWORD,
    });

    authToken = response.data.data;
    tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
    console.log('✅ Nimbuspost token refreshed');
    return authToken;
  } catch (error) {
    console.error('❌ Nimbuspost authentication failed:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Nimbuspost');
  }
};

// ✅ NEW: Get real-time rates from Nimbuspost API
const getRealTimeShippingRates = async (origin, destination, weight, orderAmount = 100, paymentType = 'prepaid') => {
  try {
    const token = await getNimbuspostToken();
    console.log('🔍 Fetching real-time rates from Nimbuspost...');
    console.log('Origin:', origin);
    console.log('Destination:', destination);
    console.log('Weight:', weight, 'grams');

    const response = await axios.post(
      `${NIMBUSPOST_API_URL}/courier/serviceability`,
      {
        origin: String(origin),
        destination: String(destination),
        payment_type: paymentType,
        order_amount: String(orderAmount),
        weight: String(weight),
        length: '20',
        breadth: '15',
        height: '10'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    console.log('📦 Raw API Response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.status && response.data.data && Array.isArray(response.data.data)) {
      const couriers = response.data.data;
      console.log(`📊 Total couriers available: ${couriers.length}`);

      if (couriers.length === 0) {
        throw new Error('No couriers available for this route');
      }

      // Filter for Ekart couriers (since Shadowfax not available)
      const ekartCouriers = couriers.filter(c => c.name && c.name.includes('Ekart'));

      // If no Ekart, use all available couriers
      const availableCouriers = ekartCouriers.length > 0 ? ekartCouriers : couriers;

      // Sort by total charges (cheapest first)
      availableCouriers.sort((a, b) => parseFloat(a.total_charges) - parseFloat(b.total_charges));

      console.log(`✅ Found ${availableCouriers.length} courier options (${ekartCouriers.length} Ekart)`);
      console.log(`💰 Cheapest: ${availableCouriers[0]?.name} - $${availableCouriers[0]?.total_charges}`);

      return {
        success: true,
        couriers: availableCouriers,
        cheapest: availableCouriers[0] || null,
        allCouriers: couriers
      };
    }

    throw new Error('Invalid response format from Nimbuspost API');
  } catch (error) {
    console.error('❌ Failed to fetch real-time rates:', error.message);
    if (error.response) {
      console.error('📥 API Error Response:', JSON.stringify(error.response.data, null, 2));
      console.error('📥 Status Code:', error.response.status);
    }
    throw error;
  }
};

// ✅ Calculate shipping with commission and GST on top of real-time base rate
const calculateShippingWithCommission = async (destination, weightGrams, orderAmount = 100) => {
  try {
    // Get real-time rates from Nimbuspost
    const ratesData = await getRealTimeShippingRates(
      ORIGIN_CONFIG.pincode,
      destination,
      weightGrams,
      orderAmount,
      'prepaid'
    );

    // ✅ FIX: Check if we have valid courier data
    if (!ratesData || !ratesData.cheapest || !ratesData.cheapest.freight_charges) {
      console.warn('⚠️ No valid courier data received, using fallback pricing');

      // Fallback pricing based on weight
      const fallbackBaseCharge = weightGrams <= 500 ? 68 :
        weightGrams <= 1000 ? 75 :
          weightGrams <= 2000 ? 90 : 120;

      const commission = fallbackBaseCharge * (PRICING_CONFIG.commission_percentage / 100);
      const totalWithCommission = fallbackBaseCharge + commission;
      const gst = totalWithCommission * (PRICING_CONFIG.gst_percentage / 100);
      const finalAmount = Math.ceil(totalWithCommission + gst);

      return {
        success: true,
        fallback: true,
        weightInKg: weightGrams / 1000,
        breakdown: {
          baseCharge: fallbackBaseCharge,
          codCharges: 0,
          nimbuspostTotal: fallbackBaseCharge,
          commission: Math.round(commission),
          commissionPercentage: PRICING_CONFIG.commission_percentage,
          subtotal: Math.round(totalWithCommission),
          gst: Math.round(gst),
          gstPercentage: PRICING_CONFIG.gst_percentage,
          finalAmount: finalAmount,
        },
        courier: {
          id: '15',
          name: 'Ekart (Fallback)',
          edd: '3-5 days',
          minWeight: 500,
          chargeableWeight: Math.max(weightGrams, 500),
        },
        alternativeCouriers: []
      };
    }

    const cheapestCourier = ratesData.cheapest;

    // Extract base freight charge from Nimbuspost
    const baseCharge = parseFloat(cheapestCourier.freight_charges) || 0;
    const codCharges = parseFloat(cheapestCourier.cod_charges) || 0;
    const totalNimbuspostCharge = baseCharge + codCharges;

    // ✅ Add commission (7%)
    const commission = totalNimbuspostCharge * (PRICING_CONFIG.commission_percentage / 100);
    const totalWithCommission = totalNimbuspostCharge + commission;

    // ✅ Add GST (18%)
    const gst = totalWithCommission * (PRICING_CONFIG.gst_percentage / 100);
    const finalAmount = Math.ceil(totalWithCommission + gst);

    return {
      success: true,
      fallback: false,
      weightInKg: weightGrams / 1000,
      breakdown: {
        baseCharge: Math.round(baseCharge),
        codCharges: Math.round(codCharges),
        nimbuspostTotal: Math.round(totalNimbuspostCharge),
        commission: Math.round(commission),
        commissionPercentage: PRICING_CONFIG.commission_percentage,
        subtotal: Math.round(totalWithCommission),
        gst: Math.round(gst),
        gstPercentage: PRICING_CONFIG.gst_percentage,
        finalAmount: finalAmount,
      },
      courier: {
        id: cheapestCourier.id,
        name: cheapestCourier.name,
        edd: cheapestCourier.edd,
        minWeight: cheapestCourier.min_weight,
        chargeableWeight: cheapestCourier.chargeable_weight,
      },
      alternativeCouriers: ratesData.couriers.slice(1, 4) // Top 3 alternatives
    };
  } catch (error) {
    console.error('❌ Error calculating shipping:', error.message);

    // ✅ CRITICAL FIX: Return fallback pricing instead of throwing error
    console.warn('⚠️ Using fallback pricing due to API error');

    const fallbackBaseCharge = weightGrams <= 500 ? 68 :
      weightGrams <= 1000 ? 75 :
        weightGrams <= 2000 ? 90 : 120;

    const commission = fallbackBaseCharge * (PRICING_CONFIG.commission_percentage / 100);
    const totalWithCommission = fallbackBaseCharge + commission;
    const gst = totalWithCommission * (PRICING_CONFIG.gst_percentage / 100);
    const finalAmount = Math.ceil(totalWithCommission + gst);

    return {
      success: true,
      fallback: true,
      error: error.message,
      weightInKg: weightGrams / 1000,
      breakdown: {
        baseCharge: fallbackBaseCharge,
        codCharges: 0,
        nimbuspostTotal: fallbackBaseCharge,
        commission: Math.round(commission),
        commissionPercentage: PRICING_CONFIG.commission_percentage,
        subtotal: Math.round(totalWithCommission),
        gst: Math.round(gst),
        gstPercentage: PRICING_CONFIG.gst_percentage,
        finalAmount: finalAmount,
      },
      courier: {
        id: '15',
        name: 'Ekart (Fallback)',
        edd: '3-5 days',
        minWeight: 500,
        chargeableWeight: Math.max(weightGrams, 500),
      },
      alternativeCouriers: []
    };
  }
};


// ✅ Get Gift Wrap Charge
router.get('/gift-wrap-charge', (req, res) => {
  res.json({
    success: true,
    charge: 15,
    message: 'Gift wrap charge fetched successfully'
  });
});

// ✅ Calculate shipping rates endpoint with real-time API
router.post('/calculate-shipping', async (req, res) => {
  try {
    console.log('📦 Shipping Calculation Payload:', JSON.stringify(req.body, null, 2));
    const { destination_pincode, weight, order_amount } = req.body;

    if (!destination_pincode || !weight) {
      return res.status(400).json({
        success: false,
        message: 'Destination pincode and weight are required',
      });
    }

    if (weight < 1 || weight > 50000) {
      return res.status(400).json({
        success: false,
        message: weight < 1 ? 'Weight must be at least 1 gram' : 'Weight exceeds maximum limit of 50kg',
      });
    }

    console.log('📦 Calculating shipping charge with real-time API...');
    console.log('Origin:', ORIGIN_CONFIG.pincode);
    console.log('Destination:', destination_pincode);
    console.log('Weight:', weight, 'grams');

    const result = await calculateShippingWithCommission(destination_pincode, weight, order_amount || 100);

    console.log('💰 Real-time calculation breakdown:');
    console.log('   Courier:', result.courier.name, '(ID:', result.courier.id + ')');
    console.log('   Nimbuspost Base: $', result.breakdown.baseCharge);
    console.log('   Commission (7%): $', result.breakdown.commission);
    console.log('   Subtotal: $', result.breakdown.subtotal);
    console.log('   GST (18%): $', result.breakdown.gst);
    console.log('   Final Amount: $', result.breakdown.finalAmount);

    return res.json({
      success: true,
      shippingCharge: result.breakdown.finalAmount,
      estimatedDelivery: result.courier.edd,
      recommendedCourier: {
        name: result.courier.name,
        id: result.courier.id,
        charge: result.breakdown.finalAmount,
        edd: result.courier.edd,
      },
      breakdown: {
        weight: result.weightInKg + ' kg',
        chargeableWeight: result.courier.chargeableWeight + ' grams',
        nimbuspostBase: result.breakdown.baseCharge,
        commission: result.breakdown.commission,
        commissionPercentage: result.breakdown.commissionPercentage + '%',
        subtotal: result.breakdown.subtotal,
        gst: result.breakdown.gst,
        gstPercentage: result.breakdown.gstPercentage + '%',
        finalAmount: result.breakdown.finalAmount,
        courier: result.courier.name,
        courierId: result.courier.id,
      },
      alternatives: result.alternativeCouriers.map(c => ({
        id: c.id,
        name: c.name,
        charge: c.total_charges,
        edd: c.edd
      }))
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate shipping',
      error: error.message,
      shippingCharge: 80, // Fallback
      estimatedDays: '3-5 days',
    });
  }
});

// ✅ Create shipment with real-time courier selection
router.post('/create-shipment', async (req, res) => {
  try {
    const {
      order_id,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      customer_city,
      customer_state,
      customer_pincode,
      product_details,
      total_amount,
      weight,
      length,
      breadth,
      height,
    } = req.body;

    console.log('\n========================================');
    console.log('🚚 CREATING NIMBUSPOST SHIPMENT (REAL-TIME)');
    console.log('========================================');
    console.log('Order ID:', order_id);
    console.log('Customer:', customer_name);
    console.log('Destination:', customer_pincode);
    console.log('Weight:', weight, 'grams');

    const token = await getNimbuspostToken();
    const packageWeightGrams = Math.round(weight);

    // ✅ Get real-time courier recommendation
    const shippingData = await calculateShippingWithCommission(
      customer_pincode,
      packageWeightGrams,
      total_amount
    );

    const selectedCourier = shippingData.courier;

    console.log('🎯 Selected Courier (Real-time):', selectedCourier.name);
    console.log('🆔 Courier ID:', selectedCourier.id);
    console.log('📅 EDD:', selectedCourier.edd);
    console.log('========================================\n');

    const shipmentPayload = {
      order_number: order_id,
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      discount_charges: 0,
      cod_charges: 0,
      advance_amount: 0,
      cod_amount: 0,
      payment_type: 'prepaid',
      order_amount: Math.round(total_amount),
      package_weight: packageWeightGrams,
      package_length: Math.round(length || 20),
      package_breadth: Math.round(breadth || 15),
      package_height: Math.round(height || 10),
      courier_id: selectedCourier.id, // ✅ Real-time selected courier
      request_auto_pickup: 'yes',
      consignee: {
        name: customer_name,
        address: customer_address,
        address_2: '',
        city: customer_city,
        state: customer_state,
        pincode: String(customer_pincode),
        phone: String(customer_phone).replace(/\D/g, '').slice(-10),
        email: customer_email || 'noreply@example.com',
      },
      pickup: {
        warehouse_name: process.env.NIMBUSPOST_WAREHOUSE_NAME || 'Lumos Main Warehouse',
        name: process.env.NIMBUSPOST_PICKUP_NAME || 'Lumos',
        address: process.env.NIMBUSPOST_PICKUP_ADDRESS || 'Indiranagar, 100 Feet Road',
        address_2: '',
        city: process.env.NIMBUSPOST_PICKUP_CITY || 'Bangalore',
        state: process.env.NIMBUSPOST_PICKUP_STATE || 'Karnataka',
        pincode: ORIGIN_CONFIG.pincode,
        phone: process.env.NIMBUSPOST_PICKUP_PHONE || '9980806803',
        email: NIMBUSPOST_EMAIL,
      },
      order_items: product_details.map(item => ({
        name: item.name,
        qty: item.qty,
        price: Math.round(item.price),
        sku: item.sku || 'BOOK001',
      })),
      ewaybill: '',
    };

    console.log('⚠️ NIMBUSPOST DISABLED: Returning Mock AWB');

    // Mock Response
    const mockAwb = `MOCK-${Date.now()}`;
    const mockShipmentId = `SHIP-${Date.now()}`;

    /* 
    // DISABLED for now - Just return mock success
    const response = await axios.post(
      `${NIMBUSPOST_API_URL}/shipments`,
      shipmentPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );
    */

    // Simulate success
    const shipmentData = {
      awb_number: mockAwb,
      shipment_id: mockShipmentId,
      label_url: 'https://via.placeholder.com/400x600?text=Mock+Label', // Dummy Label
      courier_name: selectedCourier.name,
      courier_id: selectedCourier.id,
    };

    console.log('========================================');
    console.log('✅ MOCK SHIPMENT CREATED (REAL APIs DISABLED)');
    console.log('========================================');
    console.log('AWB:', shipmentData.awb_number);
    console.log('Shipment ID:', shipmentData.shipment_id);
    console.log('========================================\n');

    res.json({
      success: true,
      message: 'Shipment created successfully (Mock)',
      awb_number: shipmentData.awb_number,
      shipment_id: shipmentData.shipment_id,
      label_url: shipmentData.label_url,
      courier_name: shipmentData.courier_name,
      courier_id: shipmentData.courier_id,
    });
  } catch (error) {
    console.error('\n========================================');
    console.error('❌ SHIPMENT CREATION FAILED');
    console.error('========================================');
    console.error('Error:', error.message);
    if (error.response?.data) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Failed to create shipment',
      error: error.response?.data?.message || error.message,
    });
  }
});

// ✅ Cancel shipment endpoint
router.post('/cancel-shipment', async (req, res) => {
  try {
    const { awb_number, order_id } = req.body;

    if (!awb_number) {
      return res.status(400).json({
        success: false,
        message: 'AWB number is required',
      });
    }

    console.log('\n========================================');
    console.log('❌ CANCELLING SHIPMENT');
    console.log('========================================');
    console.log('AWB Number:', awb_number);
    console.log('Order ID:', order_id);

    const token = await getNimbuspostToken();

    const response = await axios.post(
      `${NIMBUSPOST_API_URL}/shipments/cancel`,
      {
        awb: awb_number,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    console.log('📥 Nimbuspost Response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.status) {
      console.log('========================================');
      console.log('✅ SHIPMENT CANCELLED SUCCESSFULLY');
      console.log('========================================\n');

      res.json({
        success: true,
        message: 'Shipment cancelled successfully',
        data: response.data.data,
      });
    } else {
      throw new Error(response.data.message || 'Shipment cancellation failed');
    }
  } catch (error) {
    console.error('\n========================================');
    console.error('❌ SHIPMENT CANCELLATION FAILED');
    console.error('========================================');
    console.error('Error:', error.message);
    if (error.response?.data) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Failed to cancel shipment',
      error: error.response?.data?.message || error.message,
    });
  }
});

// ✅ Create return/reverse pickup endpoint
router.post('/create-return', async (req, res) => {
  try {
    const {
      order_id,
      awb_number,
      return_reason,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      customer_city,
      customer_state,
      customer_pincode,
      product_details,
      total_amount,
      weight,
    } = req.body;

    if (!awb_number || !order_id) {
      return res.status(400).json({
        success: false,
        message: 'AWB number and Order ID are required',
      });
    }

    console.log('\n========================================');
    console.log('🔄 CREATING RETURN SHIPMENT');
    console.log('========================================');
    console.log('Original AWB:', awb_number);
    console.log('Order ID:', order_id);
    console.log('Return Reason:', return_reason);

    const token = await getNimbuspostToken();
    const packageWeightGrams = Math.round(weight || 500);

    // Clean phone number to 10 digits
    const cleanPhone = String(customer_phone).replace(/\D/g, '');
    const phone10Digit = cleanPhone.slice(-10);

    // ✅ Create reverse pickup payload
    const returnPayload = {
      order_number: `${order_id}-RETURN`,
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      discount_charges: 0,
      cod_charges: 0,
      advance_amount: 0,
      cod_amount: 0,
      payment_type: 'prepaid',
      order_amount: Math.round(total_amount || 0),
      package_weight: packageWeightGrams,
      package_length: 20,
      package_breadth: 15,
      package_height: 10,
      request_auto_pickup: 'yes',
      // ✅ Pickup from customer (original delivery address)
      pickup: {
        warehouse_name: customer_name,
        name: customer_name,
        address: customer_address,
        address_2: '',
        city: customer_city,
        state: customer_state,
        pincode: String(customer_pincode),
        phone: phone10Digit,
        email: customer_email || 'noreply@example.com',
      },
      // ✅ Deliver to warehouse (your location)
      consignee: {
        name: process.env.NIMBUSPOST_PICKUP_NAME || 'Lumos',
        address: process.env.NIMBUSPOST_PICKUP_ADDRESS || 'Indiranagar, 100 Feet Road',
        address_2: '',
        city: process.env.NIMBUSPOST_PICKUP_CITY || 'Bangalore',
        state: process.env.NIMBUSPOST_PICKUP_STATE || 'Karnataka',
        pincode: ORIGIN_CONFIG.pincode,
        phone: process.env.NIMBUSPOST_PICKUP_PHONE || '9980806803',
        email: NIMBUSPOST_EMAIL,
      },
      order_items: product_details.map(item => ({
        name: item.name,
        qty: item.qty,
        price: Math.round(item.price),
        sku: item.sku || 'RETURN001',
      })),
      ewaybill: '',
    };

    console.log('📤 Return Payload:', JSON.stringify(returnPayload, null, 2));

    const response = await axios.post(
      `${NIMBUSPOST_API_URL}/shipments`,
      returnPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    console.log('📥 Nimbuspost Response Status:', response.data.status);

    if (response.data && response.data.status) {
      const returnData = response.data.data;

      console.log('========================================');
      console.log('✅ RETURN SHIPMENT CREATED');
      console.log('========================================');
      console.log('Return AWB:', returnData.awb_number || returnData.awb);
      console.log('Return Shipment ID:', returnData.shipment_id || returnData.id);
      console.log('Courier:', returnData.courier_name);
      console.log('Label URL:', returnData.label || returnData.label_url);
      console.log('========================================\n');

      res.json({
        success: true,
        message: 'Return shipment created successfully',
        return_awb: returnData.awb_number || returnData.awb,
        return_shipment_id: returnData.shipment_id || returnData.id,
        return_label_url: returnData.label || returnData.label_url,
        courier_name: returnData.courier_name,
        original_awb: awb_number,
      });
    } else {
      throw new Error(response.data.message || 'Return shipment creation failed');
    }
  } catch (error) {
    console.error('\n========================================');
    console.error('❌ RETURN SHIPMENT CREATION FAILED');
    console.error('========================================');
    console.error('Error:', error.message);
    if (error.response?.data) {
      console.error('API Response:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Failed to create return shipment',
      error: error.response?.data?.message || error.message,
    });
  }
});

// ✅ Track shipment endpoint
router.get('/track/:awb', async (req, res) => {
  try {
    const { awb } = req.params;

    if (!awb) {
      return res.status(400).json({
        success: false,
        message: 'AWB number is required',
      });
    }

    console.log('🔍 Tracking shipment:', awb);

    const token = await getNimbuspostToken();

    const response = await axios.get(
      `${NIMBUSPOST_API_URL}/shipments/track/${awb}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (response.data && response.data.status) {
      res.json({
        success: true,
        tracking: response.data.data,
      });
    } else {
      throw new Error('Failed to fetch tracking information');
    }
  } catch (error) {
    console.error('❌ Tracking error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to track shipment',
      error: error.message,
    });
  }
});

// ========================================
// BILLING ENDPOINTS
// ========================================
// Get all Nimbuspost invoices
router.get('/billing/invoices', verifyAdmin, async (req, res) => {
  try {
    const { start_date, end_date, page = 1, limit = 10 } = req.query;

    console.log('📊 Fetching invoices from Nimbuspost...');

    const token = await getNimbuspostToken();

    // Fetch from Nimbuspost
    let response;
    try {
      response = await axios.get(
        `${NIMBUSPOST_API_URL}/billing/invoices`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            start_date: start_date || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
            end_date: end_date || new Date().toISOString().split('T')[0],
            page: parseInt(page),
            limit: parseInt(limit)
          },
          timeout: 30000,
        }
      );
    } catch (apiError) {
      console.warn('⚠️ Billing invoices endpoint not available:', apiError.message);
      // Return empty list if endpoint fails (common capability issue)
      return res.json({
        success: false,
        message: 'Nimbuspost billing endpoint not available for this account',
        invoices: [],
        pagination: { page: parseInt(page), limit: parseInt(limit), total: 0 }
      });
    }

    console.log('✅ Invoices fetched successfully');

    if (response && response.data && response.data.status) {
      res.json({
        success: true,
        invoices: response.data.data || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: response.data.total || 0
        }
      });
    } else {
      throw new Error(response?.data?.message || 'Failed to fetch invoices');
    }

  } catch (error) {
    console.error('❌ Billing fetch error:', error.message);
    res.status(200).json({
      success: false,
      message: 'Nimbuspost billing endpoint not accessible',
      error: 'This feature requires "Billing" permission in your Nimbuspost account settings',
      invoices: [],
      suggestedAction: 'Contact Nimbuspost support to enable billing API access'
    });
  }
});

// Get current wallet balance
router.get('/wallet/balance', verifyAdmin, async (req, res) => {
  try {
    console.log('💰 Fetching wallet balance...');

    const token = await getNimbuspostToken();

    const response = await axios.get(
      `${NIMBUSPOST_API_URL}/account/wallet/balance`,  // Try alternative endpoint
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000,
      }
    );

    if (response.data && response.data.status) {
      console.log('✅ Balance fetched:', response.data.data?.balance);

      res.json({
        success: true,
        balance: response.data.data?.balance || 0,
        currency: 'INR',
        lastUpdated: new Date(),
        message: 'Wallet balance retrieved successfully'
      });
    } else {
      throw new Error('Failed to fetch wallet balance');
    }
  } catch (error) {
    console.error('❌ Wallet balance error:', error.message);
    res.status(200).json({
      success: false,
      message: 'Wallet balance endpoint not available',
      balance: 0,
      error: 'Billing features may not be enabled for your account',
      suggestedAction: 'Enable billing API access in your Nimbuspost account settings'
    });
  }
});

// Simplified transactions endpoint
router.get('/billing/transactions', verifyAdmin, async (req, res) => {
  try {
    const { start_date, end_date, type, page = 1, limit = 20 } = req.query;

    console.log('💳 Fetching transactions...');

    const token = await getNimbuspostToken();

    const response = await axios.get(
      `${NIMBUSPOST_API_URL}/billing/transactions`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          start_date: start_date || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
          end_date: end_date || new Date().toISOString().split('T')[0],
          type: type || '',
          page: parseInt(page),
          limit: parseInt(limit)
        },
        timeout: 30000,
      }
    );

    if (response.data && response.data.status) {
      res.json({
        success: true,
        transactions: response.data.data || [],
        summary: {
          total_shipments: response.data.total_shipments || 0,
          total_cost: response.data.total_cost || 0,
          total_refunds: response.data.total_refunds || 0
        },
        pagination: { page: parseInt(page), limit: parseInt(limit), total: response.data.total || 0 }
      });
    } else {
      throw new Error('Failed to fetch transactions');
    }
  } catch (error) {
    console.error('❌ Transaction fetch error:', error.message);
    res.status(200).json({
      success: false,
      message: 'Transaction endpoint not available',
      transactions: [],
      error: 'Billing features may not be enabled',
      suggestedAction: 'Enable billing API in Nimbuspost account'
    });
  }
});


module.exports = router;
