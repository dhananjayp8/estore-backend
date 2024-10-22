import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";
export const isAuthenticated = async (req, res, next) => {
  const token = req.header("Auth");
  if (!token) {
    return res.json({ message: "Login first!" });
  }
  console.log(token);
  const decoded = jwt.verify(token, "Dsp@5928");
  const id = decoded.userid;
  // console.log(id);

  let user = await User.findById(id);
  if (!user) {
    return res.json({ message: "User not found" });
  }
  req.user = user;
  next();
};
