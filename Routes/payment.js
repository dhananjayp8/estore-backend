import express from "express";
import {
  checkout,
  userOrder,
  verify,
  allOrders,
} from "../Controllers/payment.js";
import { isAuthenticated } from "../Middlewares/auth.js";
const router = express.Router();

//checkout
router.post("/checkout", checkout);

//verify-payment and save to db
router.post("/verify", verify);

//user order
router.get("/userorder", isAuthenticated, userOrder);

// All order's
router.get("/orders", allOrders);

export default router;
