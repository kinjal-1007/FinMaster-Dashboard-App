// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import morgan from "morgan";
// import kpiRoutes from "./routes/kpi.js";
// import productRoutes from "./routes/product.js";
// import transactionRoutes from "./routes/transaction.js";
// import KPI from "./models/KPI.js";
// import Product from "./models/Product.js";
// import Transaction from "./models/Transaction.js";  // Fixed import
// import { kpis, products, transactions } from "./data/data.js";

// /* CONFIGURATIONS */
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());

// /* ROUTES */
// app.use("/kpi", kpiRoutes);
// app.use("/product", productRoutes);
// app.use("/transaction", transactionRoutes);

// /* MONGOOSE SETUP */
// const PORT = process.env.PORT || 9000;
// console.log("MongoDB URI:", process.env.MONGO_URL);

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(async () => {
//     app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

//     /* ADD DATA ONE TIME ONLY OR AS NEEDED */
//     console.log("Inserting data into database...");
//     await mongoose.connection.db.dropDatabase();

//     await KPI.insertMany(
//       kpis.map((kpi) => ({ ...kpi, _id: new mongoose.Types.ObjectId() }))
//     );

//     await Product.insertMany(
//       products.map((product) => ({
//         ...product,
//         _id: new mongoose.Types.ObjectId(),
//         transactions: product.transactions.map((t) => new mongoose.Types.ObjectId(t)),

//       }))
//     );
//     transactions.forEach((txn, index) => {
//       console.log(`Transaction ${index + 1}:`, txn);
//     });
    
    
//       await Transaction.insertMany(
//         transactions.map(({ _id, ...transaction }) => ({
//           ...transaction,
//           _id: _id ? new mongoose.Types.ObjectId(_id) : new mongoose.Types.ObjectId(), 
    
//         productIds: Array.isArray(transaction.productIds)
//           ? transaction.productIds.map((id) =>
//               mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId()
//             )
//           : [],
//       }))
//     );
    
//     // const formattedTransactions = transactions.map((txn) => ({
//     //   ...txn,
//     //   _id: new mongoose.Types.ObjectId(txn._id), // ✅ Convert _id to valid ObjectId
//     // }));
    
//     // await Transaction.insertMany(formattedTransactions);
//     await mongoose.connection.db.dropDatabase();
//     console.log("Data inserted successfully!");
//   })
//   .catch((error) => console.log(`${error} did not connect`));




// // import express from "express";
// // import bodyParser from "body-parser";
// // import mongoose from "mongoose";  // Commented out
// // import cors from "cors";
// // import dotenv from "dotenv";
// // import helmet from "helmet";
// // import morgan from "morgan";
// // import kpiRoutes from "./routes/kpi.js";
// // import productRoutes from "./routes/product.js";
// // import transactionRoutes from "./routes/transaction.js";
// // import KPI from "./models/KPI.js";
// // import Product from "./models/Product.js";
// // import Transaction from "./models/Transaction.js";
// // // import { Transaction } from "./models/Transaction.js";
// // import { kpis, products, transactions } from "./data/data.js";
// // // import data from "./data/data.js"; 




// // /* CONFIGURATIONS */
// // dotenv.config();
// // const app = express();
// // app.use(express.json());
// // app.use(helmet());
// // app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// // app.use(morgan("common"));
// // app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({ extended: false }));
// // app.use(cors());

// // /* ROUTES */
// // app.use("/kpi", kpiRoutes);
// // app.use("/product", productRoutes);
// // app.use("/transaction", transactionRoutes);

// // /* MONGOOSE SETUP - Commented out */
// // const PORT = process.env.PORT || 9000;
// // console.log("MongoDB URI:", process.env.MONGO_URL);

// // mongoose
// //   .connect(process.env.MONGO_URL, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   })
// //   .then(async () => {
// //     app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

// //     /* ADD DATA ONE TIME ONLY OR AS NEEDED */
// //     console.log("Inserting data into database...");
// //     await mongoose.connection.db.dropDatabase();
// //     KPI.insertMany(kpis);
// //     Product.insertMany(products);
// //     Transaction.insertMany(transactions);
// //     console.log("Data inserted successfully!");
// //   })
// //   .catch((error) => console.log(`${error} did not connect`));


  
// /* BASIC SERVER TEST */
// // const PORT = process.env.PORT || 9000;
// // app.get("/", (req, res) => {
// //   res.send("Server is running without MongoDB!");
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server is running on port: ${PORT}`);
// // });

// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import morgan from "morgan";

// import kpiRoutes from "./routes/kpi.js";
// import productRoutes from "./routes/product.js";
// import transactionRoutes from "./routes/transaction.js";
// import KPI from "./models/KPI.js";
// import Product from "./models/Product.js";
// import Transaction from "./models/Transaction.js";
// import { kpis, products, transactions } from "./data/data.js";

// /* CONFIGURATIONS */
// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());

// /* ROUTES */
// app.use("/kpi", kpiRoutes);
// app.use("/product", productRoutes);
// app.use("/transaction", transactionRoutes);

// /* MONGOOSE SETUP */
// const PORT = process.env.PORT || 9000;
// console.log("MongoDB URI:", process.env.MONGO_URL);

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(async () => {
//     app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

//     /* ADD DATA ONE TIME ONLY */
//     console.log("Resetting and inserting data into database...");
//     await mongoose.connection.db.dropDatabase();

//     await KPI.insertMany(
//       kpis.map((kpi) => ({
//         ...kpi,
//         _id: new mongoose.Types.ObjectId(), // Ensure a new ObjectId is assigned
//       }))
//     );

//     const insertedProducts = await Product.insertMany(
//       products.map((product) => ({
//         ...product,
//         _id: new mongoose.Types.ObjectId(),
//         transactions: product.transactions.map((txnId) => 
//           mongoose.Types.ObjectId.isValid(txnId) ? new mongoose.Types.ObjectId(txnId) : null
//         ).filter(Boolean), // Remove null values if transaction IDs are invalid
//       }))
//     );
//     console.log("🚀 Transactions being inserted:");
//     transactions.forEach((txn, index) => {
//       console.log(`Transaction ${index + 1}:`, txn);
//     });
//     await Transaction.insertMany(
//       transactions.map((txn) => ({
//         ...txn,
//         _id: new mongoose.Types.ObjectId(),
//         buyer: txn.buyer_name,
//         amount: Math.round(parseFloat(txn.amount) * 100), // Convert to currency format
//         productIds: txn.productIds.map((id) => 
//           mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null
//         ).filter(Boolean), // Remove invalid productIds
//       }))
//     );
//     console.log("Data inserted successfully!");
//   })
//   .catch((error) => console.log(`Database connection failed: ${error}`));


import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";

import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";

import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.log(`Database connection failed: ${error}`));

/* FILE UPLOAD CONFIGURATION */
const upload = multer({ dest: "uploads/" });

/* API ENDPOINT TO HANDLE CSV UPLOAD */
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = path.join(process.cwd(), req.file.path);
  const results = [];

  // Read and parse CSV file
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", async () => {
      try {
        console.log("CSV Data:", results);

        // Determine which collection the data belongs to
        const firstRow = results[0];
        if ("productName" in firstRow) {
          // Insert into Products collection
          const formattedProducts = results.map((row) => ({
            name: row.productName,
            price: parseFloat(row.price),
            category: row.category,
          }));
          await Product.insertMany(formattedProducts);
          console.log("✅ Product data inserted");
        } else if ("amount" in firstRow) {
          // Insert into Transactions collection
          const formattedTransactions = results.map((row) => ({
            amount: parseFloat(row.amount),
            buyer: row.buyer,
            productIds: row.productIds ? row.productIds.split(",") : [],
          }));
          await Transaction.insertMany(formattedTransactions);
          console.log("✅ Transaction data inserted");
        } else {
          // Insert into KPI collection
          await KPI.insertMany(results);
          console.log("✅ KPI data inserted");
        }

        // Delete the uploaded file after processing
        fs.unlinkSync(filePath);
        res.json({ message: "CSV data inserted successfully!" });
      } catch (error) {
        console.error("❌ Error inserting CSV data:", error);
        res.status(500).json({ message: "Error inserting data into database." });
      }
    });
});
