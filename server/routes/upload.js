import express from "express";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import path from "path";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import KPI from "../models/KPI.js";

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Handle CSV file upload
router.post("/", upload.single("file"), async (req, res) => {
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

        // Determine the collection to insert based on CSV structure
        const firstRow = results[0];
        if ("productName" in firstRow) {
          // Insert into Products collection
          const formattedProducts = results.map((row) => ({
            name: row.productName,
            price: parseFloat(row.price),
            category: row.category,
          }));
          await Product.insertMany(formattedProducts);
        } else if ("amount" in firstRow) {
          // Insert into Transactions collection
          const formattedTransactions = results.map((row) => ({
            amount: parseFloat(row.amount),
            buyer: row.buyer,
            productIds: row.productIds ? row.productIds.split(",") : [],
          }));
          await Transaction.insertMany(formattedTransactions);
        } else {
          // Insert into KPI collection (if applicable)
          await KPI.insertMany(results);
        }

        // Delete the uploaded file after processing
        fs.unlinkSync(filePath);
        res.json({ message: "CSV data inserted successfully!" });
      } catch (error) {
        console.error("Error inserting CSV data:", error);
        res.status(500).json({ message: "Error inserting data into database." });
      }
    });
});

export default router;
