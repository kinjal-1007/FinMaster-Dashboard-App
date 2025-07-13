import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery } from "@/state/api";
import { Box, Button, Typography, useTheme, TextField } from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression, { DataPoint } from "regression";
import TipsAndUpdatesIcon  from "@mui/icons-material/TipsAndUpdates";

const Predictions = () => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);
  const [growthPercentage, setGrowthPercentage] = useState(5); 
  const { data: kpiData } = useGetKpisQuery();

  try {
    console.log("KPIs Data:", kpiData);
    console.log("Base URL:", import.meta.env.VITE_BASE_URL);
  } catch {
    console.log("error");
  }

  const formattedData = useMemo(() => {
    if (!kpiData) return [];
    const monthData = kpiData[0].monthlyData;

    const formatted: Array<DataPoint> = monthData.map(
      ({ revenue }, i: number) => {
        return [i, revenue];
      }
    );
    const regressionLine = regression.linear(formatted);
    const slope = regressionLine.equation[0]; // ✅ Calculating slope

    console.log("Slope of Regression Line:", slope);

    return monthData.map(({ month, revenue }, i: number) => {
      return {
        name: month,
        "Actual Revenue": revenue,
        "Regression Line": regressionLine.points[i][1],
        "Predicted Revenue": regressionLine.predict(i + 12)[1],
      };
    });
  }, [kpiData, growthPercentage]);

  const handleGrowthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        setGrowthPercentage(value);
      } else {
        setGrowthPercentage(0); // Set a default value if parsing fails
      }
  };
  const renderSuggestions = () => {
    const additionalRevenue = (formattedData[formattedData.length - 1]["Actual Revenue"] * growthPercentage) / 100;

    return (
  <Box mt="1rem">
    <Typography variant="h3">
      📈 <strong>Recommendations to Achieve {growthPercentage}% Growth:</strong>
    </Typography>
    <ul>
      <li>
        <TipsAndUpdatesIcon sx={{color: "#ffa800", fontSize: "15px" }}/> Increase average sales volume by{" "}
        <strong>{(additionalRevenue / 12).toFixed(2)} USD/month</strong>.
      </li>
      <li>
      <TipsAndUpdatesIcon sx={{color: "#ffa800", fontSize: "15px"}}/> Focus on <strong>top-performing regions</strong> and{" "}
        <strong>best-selling products</strong>.
      </li>
      <li>
      <TipsAndUpdatesIcon sx={{color: "#ffa800", fontSize: "15px" }}/> Boost <strong>customer retention</strong> through loyalty programs.
      </li>
      <li>
      <TipsAndUpdatesIcon sx={{color: "#ffa800", fontSize: "15px" }}/> Explore <strong>discount campaigns</strong> for underperforming regions.
      </li>
      <li>
      <TipsAndUpdatesIcon sx={{color: "#ffa800", fontSize: "15px" }}/> Identify <strong>high-margin products</strong> and promote them aggressively.
      </li>
    </ul>
  </Box>
);

  };

  return (
<DashboardBox width="100%" minHeight="1000px" p="1rem" sx={{ overflowY: "auto" }}>
      <FlexBetween m="1rem 2.5rem" gap="1rem">
        <Box>
          <Typography variant="h3">Revenue and Predictions</Typography>
          <Typography variant="h5">
            charted revenue and predicted revenue based on a simple linear
            regression model
          </Typography>
        </Box>
        <Button
          onClick={() => setIsPredictions(!isPredictions)}
          sx={{
            color: palette.grey[800],
            backgroundColor: palette.grey[300],
            boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,.4)",
          }}
        >
          Show Predicted Revenue for Next Year
        </Button>
      </FlexBetween>

      {/* 💡 TextField for Percentage Input */}
      <TextField
        label="Desired Growth (%)"
        value={isNaN(growthPercentage) ? "" : growthPercentage}
        onChange={handleGrowthChange}
        type="number"
        inputProps={{ min: 0, max: 100 }}
        fullWidth
      />

      <Box display="flex" flexDirection="column" gap="2rem">
      <Box flex="1">
      {renderSuggestions()}
      </Box>
      <Box width="100%" height="600px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 20,
            right: 75,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
          <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px",fontWeight: "bold" }}>
            <Label value="Month" offset={-5} position="insideBottom"  style={{ fontWeight: "bold", fontSize: "15px" }}  />
          </XAxis>
          <YAxis
            domain={[12000, 26000]}
            axisLine={{ strokeWidth: "0" }}
            style={{ fontSize: "10px" , fontWeight: "bold" }}
            tickFormatter={(v) => `$${v}`}
          >
            <Label
              value="Revenue in USD"
              angle={-90}
              offset={-15}
              position="insideLeft"
              style={{ fontWeight: "bold", fontSize: "15px" }} 
              
            />
          </YAxis>
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="Actual Revenue"
            // stroke="#666042"
            stroke="#E53935" 
            strokeWidth={0}

            dot={{ strokeWidth: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Regression Line"
            stroke="#8884d8"
            dot={false}
            strokeWidth={3}
          />
          {isPredictions && (
            <Line
              strokeDasharray="5 5"
              dataKey="Predicted Revenue"
              
              stroke="#666042"
              strokeWidth={2}
              
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      </Box>
      </Box>
    </DashboardBox>
  );
};

export default Predictions;