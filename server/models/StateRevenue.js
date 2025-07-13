import mongoose from "mongoose";

const Schema = mongoose.Schema;

const StateRevenueSchema = new Schema(
  { 
    _id: false,
    state: { type: String, required: true, unique: true }, // State name as unique identifier
    totalRevenue: { type: Number, required: true }, // Total revenue for the state
  },
  { timestamps: true }
);

const StateRevenue = mongoose.model("StateRevenue", StateRevenueSchema);
export default StateRevenue;
