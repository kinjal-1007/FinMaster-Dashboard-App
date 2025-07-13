import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();


// Get all customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers." });
  }
});

export default router;
