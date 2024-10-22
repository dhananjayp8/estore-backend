import express from "express";
import { login, profile, register, users } from "../Controllers/user.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const router = express.Router();
//register user
router.post("/register", register);
//login user
router.post("/login", login);
//get all users
router.get("/allUsers", users);
//get user profile

router.get("/profile", isAuthenticated, profile);
export default router;
