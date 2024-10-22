import express from "express";
import {
  addToCart,
  clearCart,
  decreaseProductQty,
  removeProductFromCart,
  userCart,
} from "../Controllers/cart.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const router = express.Router();

//add to cart
router.post("/add", isAuthenticated, addToCart);

//get user cart
router.get("/user", isAuthenticated, userCart);

//remove product from cart
router.delete("/remove/:productId", isAuthenticated, removeProductFromCart);

//clear cart

router.delete("/clear", isAuthenticated, clearCart);

//decrease cart
router.post("/--qty", isAuthenticated, decreaseProductQty);
export default router;
