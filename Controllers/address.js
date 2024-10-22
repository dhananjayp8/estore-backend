import { Address } from "../Models/Address.js";
//add address
export const addAddress = async (req, res) => {
  let { fullName, address, city, state, pincode, phoneNumber } = req.body;
  let userId = req.user;
  let userAddress = await Address.create({
    userId,
    fullName,
    address,
    city,
    state,
    pincode,
    phoneNumber,
  });
  res.json({ message: "Address added successfully!", userAddress });
};

//get address
export const getAddress = async (req, res) => {
  let address = await Address.findOne({ userId: req.user }).sort({
    createdAt: -1,
  });
  res.json({
    message: "Address",
    userAddress: address,
  });
};
