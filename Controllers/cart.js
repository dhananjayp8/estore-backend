import { Cart } from "../Models/Cart.js";
//add to cart
export const addToCart = async (req, res) => {
  const { productId, title, price, qty, imgSrc } = req.body;

  const userId = req.user;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart({ userId, items: [] });
  }
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (itemIndex > -1) {
    cart.items[itemIndex].qty += qty;
    cart.items[itemIndex].price += price * qty;
  } else {
    cart.items.push({ productId, title, price, qty, imgSrc });
  }

  await cart.save();
  res.json({ message: "Item added to Cart!", cart });
};

//get user's cart

export const userCart = async (req, res) => {
  const userId = req.user;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    return res.json({ message: "Cart not found!" });
  }
  res.json({ message: "User cart", cart });
};

//remove product from cart
export const removeProductFromCart = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    return res.json({ message: "Cart not found!" });
  }
  console.log(productId);
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  await cart.save();
  res.json({ message: "Product removed from cart" });
};
//clear cart
export const clearCart = async (req, res) => {
  const userId = req.user;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ items: [] });
  } else {
    cart.items = [];
  }
  await cart.save();

  res.json({ message: "cart cleared" });
};

// decrease quantity
export const decreaseProductQty = async (req, res) => {
  const { productId, qty } = req.body;

  const userId = req.user;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart({ userId, items: [] });
  }
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (itemIndex > -1) {
    const item = cart.items[itemIndex];
    if (item.qty > qty) {
      const pricePerUnit = item.price / item.qty;
      item.qty -= qty;
      item.price -= pricePerUnit * qty;
    } else {
      cart.items.splice(itemIndex, 1);
    }
  } else {
    res.json({ message: "Invalid Product Id" });
  }

  await cart.save();
  res.json({ message: "Item quantity decreased!", cart });
};
