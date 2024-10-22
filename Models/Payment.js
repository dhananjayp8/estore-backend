import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     orderDate: {
//       type: Date,
//       default: Date.now,
//     },
//     paystatus: { type: String },
//   },
//   { strict: false }
// );

// export const Payment = mongoose.model("Payment", paymentSchema);
// const paymentSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: String,
//       required: true,
//     },
//     paymentId: {
//       type: String,
//       required: true,
//     },
//     signature: {
//       type: String, // Optional if you're handling signature validation
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     orderItems: {
//       type: Array,
//       required: true, // Store the cart items in this array
//     },
//     userId: {
//       type: String,
//       required: true,
//     },
//     userShipping: {
//       type: Object, // Shipping address
//       required: true,
//     },
//     payStatus: {
//       type: String,
//       default: "pending", // Set a default value like 'pending'
//     },
//     orderDate: {
//       type: Date,
//       default: Date.now, // Automatically set the order date
//     },
//   },
//   { strict: false } // This allows extra fields to be stored without schema validation
// );

// export const Payment = mongoose.model("Payment", paymentSchema);
const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    paystatus: { type: String },
    amount: { type: Number },
    orderItems: { type: Array },
    userShipping: { type: Object },
    paymentId: { type: String },
    signature: { type: String },
  },
  { strict: false }
);

export const Payment = mongoose.model("Payment", paymentSchema);
