const mongoose = require('mongoose');
const Order = require('./order.model'); // Adjust path to your model

const MONGODB_URI = process.env.DB_URL || 'mongodb+srv://vidyatestumesh_db_user:BJMWO0WncAlYOXWb@book-cluster.ufi2wnq.mongodb.net/test?retryWrites=true&w=majority&appName=book-cluster';

const fakeOrders = [
  {
    userId: "user_67890abcdef12345",
    isGuestOrder: false,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+919876543210",
    address: {
      street: "123, MG Road, Indiranagar",
      city: "Bangalore",
      country: "India",
      state: "Karnataka",
      zipcode: "560038"
    },
    productIds: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ],
    products: [
      {
        bookId: new mongoose.Types.ObjectId(),
        title: "The Alchemist",
        price: 349.00,
        quantity: 2,
        coverImage: "https://example.com/images/alchemist.jpg",
        weight: 250
      },
      {
        bookId: new mongoose.Types.ObjectId(),
        title: "Atomic Habits",
        price: 599.00,
        quantity: 1,
        coverImage: "https://example.com/images/atomic-habits.jpg",
        weight: 400
      }
    ],
    totalPrice: 1297.00,
    shippingCharge: 50.00,
    giftWrapCharge: 30.00,
    orderCode: "ORD12345",
    paymentId: "pay_MkjT8X9qR5vN2Z",
    razorpayOrderId: "order_MkjT8X9qR5vN2Z",
    paymentStatus: "paid",
    paymentMethod: "razorpay",
    status: "Shipped",
    returnRequest: {
      requested: false,
      status: "none"
    },
    trackingId: "AWB1234567890",
    courierId: "DELHIVERY",
    courierName: "Delhivery",
    estimatedDelivery: "3-5 days",
    shipmentId: "SHIP_987654321",
    labelUrl: "https://nimbuspost.com/label/SHIP_987654321.pdf",
    returnStatus: "None"
  },
  // Add more orders here...
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - remove this if you want to keep existing orders)
    // await Order.deleteMany({});
    // console.log('Cleared existing orders');

    // Insert fake data
    const result = await Order.insertMany(fakeOrders);
    console.log(`✅ Inserted ${result.length} orders successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
