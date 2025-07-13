import express from "express";
import Suggestion from "../models/Suggestion.js";

const router = express.Router();

router.get("/suggestions", async (req, res) => {
  try {
    const suggestions = await Suggestion.find()
      .sort({ createdOn: -1 });

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;