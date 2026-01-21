const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    isGuestOrder: { type: Boolean, default: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: String,
      city: String,
      country: String,
      state: String,
      zipcode: String,
    },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    products: [
      {
        bookId: mongoose.Schema.Types.ObjectId,
        title: String,
        price: Number,
        quantity: Number,
        coverImage: String,
        weight: Number, // ✅ Added weight per product
      },
    ],
    totalPrice: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 }, // ✅ Store calculated shipping
    giftWrapCharge: { type: Number, default: 0 },
    guestOrderCode: { type: String },
    orderCode: {
      type: String,
      unique: true,
      required: true,
      minlength: 8,
      maxlength: 8,
    },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    cashfreeOrderId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String },
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Return Requested",
        "Return Approved",
        "Return Rejected",
      ],
      default: "Pending",
    },
    returnRequest: {
  requested: { type: Boolean, default: false },
  requestDate: { type: Date },
  reason: { type: String },
  status: { 
    type: String, 
    enum: ['none', 'pending', 'approved', 'rejected', 'completed'],
    default: 'none' 
  },
  approvedBy: { type: String },
  approvedDate: { type: Date },
  rejectionReason: { type: String },
  returnAwb: { type: String },
  returnShipmentId: { type: String },
  returnLabelUrl: { type: String }
},
    trackingId: { type: String }, // ✅ AWB Number from Nimbuspost
    courierId: { type: String }, // ✅ Courier ID
    courierName: { type: String }, // ✅ Courier Name
    estimatedDelivery: { type: String }, // ✅ Estimated delivery days
    shipmentId: { type: String }, // ✅ Nimbuspost shipment ID
    labelUrl: { type: String }, // ✅ Shipping label URL
    cancellationReason: { type: String },
    returnReason: { type: String },
    returnImage: { type: String },
    returnImagePublicId: { type: String, default: null },
    returnStatus: {
      type: String,
      enum: ["None", "Requested", "Approved", "Rejected", "Completed"],
      default: "None",
    },
    giftTo: { type: String },
    giftFrom: { type: String },
    giftMessage: { type: String },
    giftAddress: {
      street: String,
      city: String,
      country: String,
      state: String,
      zipcode: String,
    },
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
