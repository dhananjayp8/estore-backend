// import { Payment } from "../Models/Payment.js";
// import dotenv from "dotenv";
// dotenv.config();
// import { v4 as uuidv4 } from "uuid";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// // console.log(process.env.STRIPE_SECRET_KEY);
// export const checkout = async (req, res) => {
//   const { amount, cartItems, userShipping, userId } = req.body;

//   try {
//     const orderId = `order_${uuidv4()}`;
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // amount is in cents
//       currency: "usd",
//       payment_method_types: ["card"],
//       metadata: {
//         userId,
//         cartItems: JSON.stringify(cartItems),
//         userShipping: JSON.stringify(userShipping),
//         receipt: `receipt_${Date.now()}`, // add the receipt here
//       },
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//       orderId,
//       amount: amount,
//       cartItems,
//       userShipping,
//       userId,
//       payStatus: "created",
//       receipt: `receipt_${Date.now()}`, // return the receipt in the response if needed
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const verify = async (req, res) => {
//   const { paymentIntentId, orderItems, userId, userShipping } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === "succeeded") {
//       let orderConfirm = await Payment.create({
//         orderId: paymentIntent.id,
//         paymentId: paymentIntent.payment_method,
//         amount: paymentIntent.amount / 100, // convert from cents
//         orderItems,
//         userId,
//         userShipping,
//         payStatus: "paid",
//       });

//       res.json({
//         message: "Payment successful.",
//         success: true,
//         orderConfirm,
//       });
//     } else {
//       res
//         .status(400)
//         .json({ message: "Payment not successful.", success: false });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // export const createPaymentIntent = async (req, res) => {
// //   const { amount, cartItems, userShipping, userId } = req.body;

// //   try {
// //     const paymentIntent = await stripe.paymentIntents.create({
// //       amount: amount * 100, // Amount is in cents
// //       currency: "usd",
// //       metadata: {
// //         userId,
// //         cartItems: JSON.stringify(cartItems),
// //         userShipping: JSON.stringify(userShipping),
// //       },
// //     });

// //     res.json({ clientSecret: paymentIntent.client_secret });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };
import { Payment } from "../Models/Payment.js";
import { Cart } from "../Models/Cart.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkout = async (req, res) => {
  const { amount, cartItems, userShipping, userId } = req.body; //add userid

  try {
    // Generate an order ID for reference
    // const userId = req.user._id;
    console.log("Recieved cartitems in checkout", cartItems);
    const orderId = `order_${uuidv4()}`;
    const description = `Export transaction for goods purchased by user ${userId}`;
    // Create a Payment Intent with Stripe
    const itemSummaries = cartItems.map((item) => ({
      productId: item.productId,
      title: item.title,
      qty: item.qty,
    }));
    const itemMetadata = itemSummaries
      .map((item) => {
        return `${item.title} (Qty: ${item.qty})`;
      })
      .join(", ");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: "INR",
      payment_method_types: ["card"], // All payment methods you'd like to offer
      // automatic_payment_methods: {
      //   enabled: true, // Enable Stripe to automatically detect available payment methods
      // },
      description: `Order for user ${userId} - Cart  Items: ${cartItems.length}`,
      // shipping: {
      //   name: userName, // Include customer's name
      //   // address: {
      //   //   line1: userShipping.address,
      //   //   postal_code: userShipping.pincode,
      //   //   city: userShipping.city,
      //   //   state: userShipping.state,
      //   //   country: userShipping.country,
      //   // },
      // },
      metadata: {
        orderId,
        userId,
        // cartItems: JSON.stringify(cartItems),
        itemSummaries: JSON.stringify(itemSummaries),
        // userShipping: JSON.stringify(userShipping),
        receipt: `receipt_${Date.now()}`,
      },
    });

    // Send back clientSecret and orderId to the client
    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId,
      amount,
      cartItems,
      userShipping,
      userId,
      payStatus: "created",
      receipt: `receipt_${Date.now()}`,
    });
  } catch (error) {
    console.error("Error in creating payment intent:", error.message);
    res.status(500).json({ error: "Failed to create payment intent." });
  }
};
// export const verify = async (req, res) => {
//   const { paymentIntentId, orderItems, userId, userShipping } = req.body;

//   try {
//     // Retrieve the payment intent details from Stripe
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     // Check if the payment was successful
//     if (paymentIntent.status === "succeeded") {
//       // Store the payment information in your database
//       const orderConfirm = await Payment.create({
//         orderId: paymentIntent.id,
//         paymentId: paymentIntent.payment_method,
//         amount: paymentIntent.amount / 100, // Convert from cents to dollars
//         orderItems,
//         userId,
//         userShipping,
//         payStatus: "paid",
//       });
//       console.log("orderConfirm", orderConfirm);
//       // await Cart.updateOne({ userId }, { items: [] });
//       // Send success response
//       res.json({
//         message: "Payment successful.",
//         success: true,
//         orderConfirm,
//       });
//     } else {
//       res.status(400).json({
//         message: "Payment not successful.",
//         success: false,
//       });
//     }
//   } catch (error) {
//     console.error("Error in verifying payment:", error.message);
//     res.status(500).json({ error: "Failed to verify payment." });
//   }
// };
export const verify = async (req, res) => {
  const { orderId, paymentId, amount, orderItems, userId, userShipping } =
    req.body;

  try {
    // Validate incoming data (add more validation as needed)
    if (
      !orderId ||
      !paymentId ||
      !amount ||
      !orderItems ||
      !userId ||
      !userShipping
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new payment record
    const orderConfirm = await Payment.create({
      orderId,
      paymentId,
      amount,
      orderItems,
      userId,
      userShipping,
      payStatus: "paid", // Ensure the field matches your schema
    });

    // Respond with success
    res.json({ message: "Payment successful", success: true, orderConfirm });
  } catch (error) {
    console.error("Error saving payment:", error); // Log error for debugging
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// export const verify = async (req, res) => {
//   const { paymentIntentId, orderId, cartItems, userId, userShipping, amount } =
//     req.body;

//   try {
//     // Retrieve payment details from Stripe using the paymentIntentId
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === "succeeded") {
//       // Create a new payment/order record in MongoDB
//       let orderConfirm = await Payment.create({
//         orderId: orderId,
//         paymentId: paymentIntent.id, // Using Stripe paymentIntent ID as payment ID
//         signature: paymentIntent.client_secret, // Optionally store client secret as signature
//         amount: amount, // Store the amount of the transaction
//         orderItems: cartItems, // Array of cart items
//         userId: userId, // The ID of the user making the payment
//         userShipping: userShipping, // Shipping information
//         payStatus: "paid", // Mark the payment as paid
//       });

//       // Return success response
//       res.json({
//         message: "Payment successful.",
//         success: true,
//         orderConfirm,
//       });
//     } else {
//       res
//         .status(400)
//         .json({ message: "Payment not successful.", success: false });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
export const userOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user` contains the authenticated user information
    console.log("User id", userId);
    const orders = await Payment.find({ userId }).sort({ orderDate: -1 });

    console.log("order is", orders);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching user orders", error });
  }
};

export const allOrders = async (req, res) => {
  let orders = await Payment.find().sort({ orderDate: -1 });
  res.json(orders);
};
