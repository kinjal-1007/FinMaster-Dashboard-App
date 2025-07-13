// import mongoose from "mongoose";
// import { loadType } from "mongoose-currency";

// const Schema = mongoose.Schema;
// loadType(mongoose);

// const ProductSchema = new Schema(
//   {
//     price: {
//       type: mongoose.Types.Currency,
//       currency: "USD",
//       get: (v) => v / 100,
//     },
//     expense: {
//       type: mongoose.Types.Currency,
//       currency: "USD",
//       get: (v) => v / 100,
//     },
//     transactions: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Transaction",
//       },
//     ],
//   },
//   { timestamps: true, toJSON: { getters: true } }
// );

// const Product = mongoose.model("Product", ProductSchema);

// export default Product;
import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);

const ProductSchema = new Schema(
  { 
    // id: {
    //    type: String, 
    //    ref: 'Product' 
    // }
    _id: false,
    id: { type: String, required: true, unique: true },
    product_name: {
      type: String,
      required: true, // Ensure every product has a name
    },
    category: { type: String, required: true }, // Category field added
    sub_category: { type: String, required: true }, 
    price: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
    expense: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
    },
    totalQuantity: { type: Number, required: true },
    totalSales: { type: Number, required: true }, 
    transactions: [{ type: String }],
    // transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  },
  { timestamps: true, toJSON: { getters: true }

//   {
//     timestamps: true,
//     toJSON: { 
//       getters: true, 
//       transform: (doc, ret) => {
//         ret._id = ret._id.toString();  // Convert _id from ObjectId to string
//         return ret;
//       } 
//   }
  
  

}
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;