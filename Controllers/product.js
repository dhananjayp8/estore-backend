import { Products } from "../Models/product.js";

//add product
export const addProduct = async (req, res) => {
  const { title, description, price, category, gty, imgSrc } = req.body;
  try {
    let product = await Products.create({
      title,
      description,
      price,
      category,
      gty,
      imgSrc,
    });
    res.json({ message: "Product added successfully!", product });
  } catch (err) {
    res.json(err.message);
  }
};

//get product

export const getProducts = async (req, res) => {
  let products = await Products.find().sort({ createdAt: -1 });
  res.json({ message: "All products", products });
};

//get product by id
export const getProductById = async (req, res) => {
  const id = req.params.id;
  let product = await Products.findById(id);
  if (!product) {
    return res.json({ message: "Invalid id" });
  }
  res.json({ message: "Specific Product", product });
};

//update product
export const updateProductById = async (req, res) => {
  const id = req.params.id;
  let product = await Products.findByIdAndUpdate(id, req.body, { new: true });
  if (!product) {
    return res.json({ message: "Invalid id" });
  }
  res.json({ message: "Updated Product", product });
};
//delete product

export const deleteProductById = async (req, res) => {
  const id = req.params.id;
  let product = await Products.findByIdAndDelete(id);
  if (!product) {
    return res.json({ message: "Invalid id" });
  }
  res.json({ message: "Product has been deleted", product });
};
