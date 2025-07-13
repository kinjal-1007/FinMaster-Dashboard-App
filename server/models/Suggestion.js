// models/Suggestion.js
import mongoose from "mongoose";

const SuggestionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Suggestion = mongoose.model("Suggestion", SuggestionSchema);
export default Suggestion;
