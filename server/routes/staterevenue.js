import express from "express";
import StateRevenue from "../models/StateRevenue.js";

const router = express.Router();

router.get("/staterevenues", async (req, res) => {
  try {
    const state_revenue = await StateRevenue.find();
    res.status(200).json(state_revenue);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;