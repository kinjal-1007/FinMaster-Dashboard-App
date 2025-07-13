import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";  
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import { fileURLToPath } from "url";

import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";
import stateRevenueRoutes from "./routes/staterevenue.js";
import customerRoutes from "./routes/customer.js";
import suggestionRoutes from "./routes/suggestion.js";
import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";
import StateRevenue from "./models/StateRevenue.js";
import Customer from "./models/Customer.js";
import Suggestion from "./models/Suggestion.js";
import { kpis, products, transactions, stateRevenues, customers, suggestions } from "./data/data.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(fileUpload());

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_FOLDER = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
const DATA_FILE = path.join(__dirname, "data", "data.js");
/* ROUTES */
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);
app.use('/staterevenue', stateRevenueRoutes);
app.use('/customer', customerRoutes);
app.use('/suggestion', suggestionRoutes);
app.post("/upload", async (req, res) => {
  try {
    // Check if the file and year are provided
    if (!req.files || !req.body.year) {
      return res.status(400).json({ error: "File and year are required" });
    }

    const file = req.files.file;
    const year = req.body.year;
    const categoryExpenses = req.body.categoryExpenses || "{}";

    // Save the file locally
    const filePath = path.join(UPLOAD_FOLDER, file.name);
    await file.mv(filePath);

    // Prepare FormData to send to Flask
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("year", year);
    formData.append("categoryExpenses", categoryExpenses);

    // Make a request to the Flask backend
    const flaskURL = "http://localhost:5080/upload"; // Update if your Flask server is running elsewhere
    const response = await axios.post(flaskURL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Send the response back to the client
    console.log("=== Data Received from Flask ===");
    console.log(response.data);

    // Extract the data and format it as required for the JS file
    const kpis = response.data.kpis || [];
    const transactions = response.data.transactions || [];
    const products = response.data.products || [];
    const stateRevenues = response.data.stateRevenue || [];
    const customers = response.data.customers || [];
    const suggestions = response.data.suggestions || [];

    console.log("=== Writing Data to data1.js ===");

    // Write the data to `data1.js`
    const fileContent = `
export const kpis = ${JSON.stringify(kpis, null, 2)};
export const transactions = ${JSON.stringify(transactions, null, 2)};
export const products = ${JSON.stringify(products, null, 2)};
export const stateRevenues = ${JSON.stringify(stateRevenues, null, 2)};
export const customers = ${JSON.stringify(customers, null, 2)};
export const suggestions = ${JSON.stringify(suggestions, null, 2)};
    `;

    fs.writeFileSync(DATA_FILE, fileContent);

    console.log(`Data successfully written to ${DATA_FILE}`);
    res.status(200).json({ message: "Data successfully processed and saved." });

  } catch (error) {
    console.error("Error during upload:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* MONGOOSE SETUP - Commented out */
const PORT = process.env.PORT || 9000;
console.log("MongoDB URI:", process.env.MONGO_URL);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    
        /* ADD DATA ONE TIME ONLY */
        console.log("Resetting and inserting data into database...");
        await mongoose.connection.db.dropDatabase();
        console.log("🔥 Database dropped successfully!");

        

        await KPI.insertMany(
          kpis.map((kpi) => ({
            ...kpi,
            _id: new mongoose.Types.ObjectId(), // Ensure a new ObjectId is assigned
          }))
        );
    
        const insertedProducts = await Product.insertMany(
          products.map((product) => ({
            ...product,
            // _id: new mongoose.Types.ObjectId(),
            id: product.id, 
            // _id: _id.toString(), 
            product_name: product.product_name,
            category: product.category,  // Ensure category is included
            sub_category: product.sub_category,
            price: product.price,
            expense: product.expense,
            totalQuantity: Number(product.totalQuantity), // Ensure it's a number
            totalSales: parseFloat(product.totalSales.replace(/[$,]/g, "")), // Convert to float  
            transactions: product.transactions.map(String),
            // transactions: product.transactions.map((txnId) => 
            //   mongoose.Types.ObjectId.isValid(txnId) ? new mongoose.Types.ObjectId(txnId) : null
            // ).filter(Boolean), // Remove null values if transaction IDs are invalid
          }))
        );
        console.log("✅ Inserted Products:", insertedProducts);

        console.log("🚀 Transactions being inserted:");
        transactions.forEach((txn, index) => {
          console.log(`Transaction ${index + 1}:`, txn);
        });
        // await Transaction.insertMany(
        //   transactions.map((txn) => ({
        //     ...txn,
        //     // _id: new mongoose.Types.ObjectId(),
        //     id: txn.id,
        //     buyer: txn.buyer_name,
        //     // amount: Math.round(parseFloat(txn.amount) * 100),
        //     //  // Convert to currency format
        //      amount: Math.round(parseFloat(txn.amount)),
        //     // productIds: txn.productIds.map((id) => 
        //     //   mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null
        //     // ).filter(Boolean), // Remove invalid productIds
        //     productIds: txn.productIds.map(String), 
        //   }))
        // );
        await Transaction.insertMany(
          transactions.map((txn, index) => {
            console.log(`🔍 Transaction ${index + 1} Original Amount:`, txn.amount);
        
            // Convert to string and remove any non-numeric characters except "."
            const cleanAmount = String(txn.amount).replace(/[^\d.]/g, "").replace(/,/g, ""); 
            const parsedAmount = cleanAmount ? parseFloat(cleanAmount) : 0; // Convert to float
        
            console.log(` Cleaned Amount:`, cleanAmount);
            console.log(` Parsed Amount:`, parsedAmount);
        
            if (isNaN(parsedAmount)) {
              console.error(` Error: Transaction ${index + 1} has an invalid amount:`, txn.amount);
            }
        
            return {
              id: txn.id,
              buyer: txn.buyer_name,
              amount: isNaN(parsedAmount) ? 0 : parsedAmount, // Keep decimal values
              productIds: txn.productIds.map(String),
            };
          })
        );
        console.log("🚀 StateRevenue being inserted:", stateRevenues);
        const validStateRevenues = stateRevenues
          .map((revenue) => ({
            state: revenue.State || "Unknown", // Fallback in case of missing state
            totalRevenue: revenue.Revenue ? parseFloat(revenue.Revenue.replace(/[$,]/g, "")) : 0,
          }))
          .filter((rev) => rev.totalRevenue !== NaN); // Filter out invalid entries

        console.log("📌 Valid State Revenues:", validStateRevenues);
        await StateRevenue.insertMany(validStateRevenues);

        // === 📌 Inserting Customer Analysis Data ===
        console.log("🚀 Inserting Customer Analysis Data");
        await Customer.insertMany(
          customers.map((customer) => ({
            id: customer.id,
            customer_name: customer.customer_name,
            segment: customer.segment,
            region: customer.region,
            last_purchase: new Date(customer.last_purchase),
            purchase_frequency: customer.purchase_frequency,
            revenue_generated: parseFloat(customer.revenue_generated.replace(/[$,]/g, "")),
            average_order_value: parseFloat(customer.average_order_value.replace(/[$,]/g, "")),
            estimated_ltv: parseFloat(customer.estimated_ltv.replace(/[$,]/g, "")), // <-- added this line
            product_ids: customer.product_ids.map(String),
          }))
        );
        console.log("✅ Customer Analysis Data Inserted Successfully!");

        // Insert Suggestions
        await Suggestion.insertMany(
          suggestions.map((suggestion) => ({
            ...suggestion,
            _id: new mongoose.Types.ObjectId(),
          }))
        );
        console.log("✅ Suggestions inserted into database.");
        console.log("Data inserted successfully!");
      })
.catch((error) => console.log(`Database connection failed: ${error}`));


  
/* BASIC SERVER TEST */
// const PORT = process.env.PORT || 9000;
// app.get("/", (req, res) => {
//   res.send("Server is running without MongoDB!");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });

