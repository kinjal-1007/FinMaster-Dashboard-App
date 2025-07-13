// import mongoose from "mongoose";
// import { loadType } from "mongoose-currency";

// const Schema = mongoose.Schema;
// loadType(mongoose);

// const TransactionSchema = new Schema(
//   {
//     buyer: {
//       type: String,
//       required: true,
//     },
//     amount: {
//       type: mongoose.Types.Currency,
//       currency: "USD",
//       get: (v) => v / 100,
//     },
//     productIds: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//       },
//     ],
//   },
//   { timestamps: true, toJSON: { getters: true } }
// );

// const Transaction = mongoose.model("Transaction", TransactionSchema);

// export default Transaction;

import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);


const TransactionSchema = new Schema(
  // {   _id: {
  //   type: mongoose.Schema.Types.ObjectId,  
  //   default: () => new mongoose.Types.ObjectId(), // ✅ Generates new ObjectId
  // },
  { _id: false,
    id: { type: String, required: true, unique: true },
   
    buyer: {
      type: String,
      required: true,
    },
    // amount: {
    //   type: mongoose.Types.Currency,
    //   currency: "USD",
    //   get: (v) => v / 100,
    // },
    amount: { type: Number, required: true }, 
    productIds: [{ type: String}],
    // productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true, toJSON: { getters: true } }
);

// const Transaction = mongoose.model("Transaction", TransactionSchema);

// export default Transaction;

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction ;

