import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().select("id product_name category sub_category totalQuantity totalSales price expense transactions");
    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      id: product.id.toString(),
    }));
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
