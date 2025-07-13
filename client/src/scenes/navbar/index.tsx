import { useState } from "react";
import { Link } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
// import { Box, Typography, useTheme } from "@mui/material";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import FlexBetween from "@/components/FlexBetween";
import CloseIcon from "@mui/icons-material/Close";
type Props = {};

const Navbar = (props: Props) => {
  const { palette } = useTheme();
  const [selected, setSelected] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [year, setYear] = useState("");
  const [categoryExpenses, setCategoryExpenses] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);

    // Modal Handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  
    const addExpenseField = () => {
    setCategoryExpenses([...categoryExpenses, { key: "", value: "" }])};

  // Remove expense row by index
  const removeExpenseField = (index: number) => {
    const newExpenses = [...categoryExpenses];
    newExpenses.splice(index, 1);
    setCategoryExpenses(newExpenses);
  };

  const handleExpenseChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newExpenses = [...categoryExpenses];
    newExpenses[index][field] = value;
    setCategoryExpenses(newExpenses);
  };

    const handleFormSubmit = async () => {
    if (!file || !year) {
      alert("File and Year are required!");
      return;
    }

    // Validate that keys are not empty and values are in correct format (optional)
    for (const expense of categoryExpenses) {
      if (!expense.key.trim()) {
        alert("Expense category cannot be empty.");
        return;
      }
      if (!expense.value.trim()) {
        alert("Expense amount cannot be empty.");
        return;
      }
    }

    // Convert array of objects to JSON string in expected format:
    // { "Marketing": "$2000", "Operations": "$1500" }
    const expensesObj: Record<string, string> = {};
    categoryExpenses.forEach(({ key, value }) => {
      expensesObj[key] = value;
    });
    const expensesJSON = JSON.stringify(expensesObj);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("year", year);
    formData.append("categoryExpenses", expensesJSON);

    try {
      const response = await fetch("http://localhost:9000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Data uploaded successfully!");
        handleClose();
      } else {
        alert(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Upload failed. Please try again.");
    }
  };
  
  return (
    <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[100]}>
      {/* LEFT SIDE */}
      <FlexBetween gap="0.75rem">
        <PixIcon sx={{ fontSize: "28px" }} />
        <Typography variant="h4" fontSize="16px" color={palette.grey[100]}>
          FinMaster
        </Typography>
      </FlexBetween>

      {/* RIGHT SIDE */}
      <FlexBetween gap="2rem">
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/"
            onClick={() => setSelected("dashboard")}
            style={{
              color: selected === "dashboard" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            dashboard
          </Link>
        </Box>
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/products"
            onClick={() => setSelected("products")}
            style={{
              color: selected === "products" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            product details
          </Link>
        </Box>
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/predictions"
            onClick={() => setSelected("predictions")}
            style={{
              color: selected === "predictions" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            predictions
          </Link>
        </Box>

        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/customers"
            onClick={() => setSelected("customers")}
            style={{
              color: selected === "customers" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            customer insights
          </Link>
        </Box>
        {/* <Box>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="csv-upload"
          />
          <label htmlFor="csv-upload">
            <Button variant="contained" component="span" sx={{ backgroundColor: palette.primary[500] }}>
              Upload CSV
            </Button>
          </label>
        </Box> */}

        {/* Upload Button */}
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ backgroundColor: palette.primary[500], color: palette.grey[100] }}
        >
          Upload Data
        </Button>

        {/* Popup Form */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            Upload Data
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <TextField
              fullWidth
              margin="normal"
              label="Year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Category Expenses
            </Typography>

            {categoryExpenses.map((expense, index) => (
              <Box
                key={index}
                display="flex"
                gap={2}
                alignItems="center"
                mb={1}
              >
                <TextField
                  label="Expense Category"
                  value={expense.key}
                  onChange={(e) =>
                    handleExpenseChange(index, "key", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Amount"
                  value={expense.value}
                  onChange={(e) =>
                    handleExpenseChange(index, "value", e.target.value)
                  }
                  placeholder="$1000"
                  fullWidth
                />
                {categoryExpenses.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeExpenseField(index)}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            ))}

            <Button variant="text" onClick={addExpenseField}>
              + Add an Expense
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFormSubmit} variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;
