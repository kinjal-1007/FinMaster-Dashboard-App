import mongoose from 'mongoose';
import { loadType } from 'mongoose-currency';
const Schema = mongoose.Schema;
loadType(mongoose);

const CustomerSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  customer_name: {
    type: String,
    required: true
  },
  segment: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  last_purchase: {
    type: Date,
    required: true
  },
  purchase_frequency: {
    type: Number,
    required: true
  },
  revenue_generated: {
    type: Number,
    required: true
  },
  average_order_value: {
    type: Number,
    required: true
  },
  estimated_ltv: {
    type: Number,
    required: true
  },
  product_ids: {
    type: [String],
    required: true
  }
});

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;
