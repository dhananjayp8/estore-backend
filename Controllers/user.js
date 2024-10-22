import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//register user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      res.json({ message: "User already exists", success: false });
    }
    const hashPass = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashPass });
    res.json({ message: "User registered successfully!", success: true });
  } catch (err) {
    res.json({ message: err.message });
  }
};
//login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not find", success: false });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ message: "Invalid Credentials", success: false });
    }
    const token = jwt.sign({ userid: user._id }, "Dsp@5928", {
      expiresIn: "365d",
    });
    res.json({ message: `Welcome ${user.name}`, token, success: true });
  } catch (err) {
    res.json({ message: err.message });
  }
};

//get all users
export const users = async (req, res) => {
  try {
    let users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.json(err.message);
  }
};

//get profile

export const profile = async (req, res) => {
  res.json({ user: req.user });
};
