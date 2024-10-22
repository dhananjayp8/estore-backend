import express from "express";
import { isAuthenticated } from "../Middlewares/auth.js";
import { addAddress, getAddress } from "../Controllers/address.js";

const router = express.Router();

//add address
router.post("/add", isAuthenticated, addAddress);

//get address
router.get("/get", isAuthenticated, getAddress);
export default router;
