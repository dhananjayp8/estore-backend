import express from "express";
import mongoose from "mongoose";
import bodyParser from "express";
import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import dotenv from "dotenv";
dotenv.config();
import paymentRouter from "./Routes/payment.js";
import cors from "cors";

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
//home route
app.get("/", (req, res) => {
  res.json({ message: "this is home route" });
});
//user router
app.use("/api/user", userRouter);

//product router
app.use("/api/product", productRouter);

//cart router

app.use("/api/cart", cartRouter);

//address router

app.use("/api/address", addressRouter);

//checkout
app.use("/api/payment", paymentRouter);

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "Mern-Ecom",
    serverSelectionTimeoutMS: 5000, // Wait for 5 seconds before timing out
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("Mongodb started"))
  .catch((err) => console.log(err));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
