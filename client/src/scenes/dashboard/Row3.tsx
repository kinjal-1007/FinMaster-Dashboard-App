import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
  
} from "@/state/api";
import { Box, Typography, Stack, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800", "#9C27B0"];

  const { data: kpiData } = useGetKpisQuery();

const pieChartData = useMemo(() => {
  if (!kpiData || !kpiData[0]?.expensesByCategory) return [];
  
  return Object.entries(kpiData[0].expensesByCategory).map(([key, value]) => ({
    name: key,
    value: parseFloat(value) || 0, // Ensure numerical values
  }));
}, [kpiData]);


  const productColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];

  const transactionColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.67,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.35,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.1,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string>).length,
    },
  ];

  return (
    <>
      {/* <DashboardBox gridArea="g">
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length} products`}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={productData || []}
            columns={productColumns}
            getRowId={(row) => row._id} // Fix: Use `_id` as `id`

          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="h">
        <BoxHeader
          title="Recent Orders"
          sideText={`${transactionData?.length} latest transactions`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={transactionData || []}
            columns={transactionColumns}
            getRowId={(row) => row._id} // Fix: Use `_id` as `id`

          />
        </Box>
      </DashboardBox> */}
      <DashboardBox gridArea="i">
    <BoxHeader title="Expense Breakdown By Category" sideText=""/>

    {pieChartData.length > 0 ? (
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Donut Chart */}
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={pieChartData}
              innerRadius={45}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
            >
              {pieChartData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Labels with Exact Values */}
        <Stack spacing={1}>
          {pieChartData.map((data, i) => (
            <Box key={data.name} display="flex" alignItems="center">
              <Box
                sx={{ width: 12, height: 12, backgroundColor: pieColors[i % pieColors.length], borderRadius: "50%", mr: 1 }}
              />
              <Typography variant="body1" fontWeight="bold">
                {data.name}: ${data.value.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    ) : (
      <Typography variant="h6" color="gray">No Data Available</Typography>
    )}
  </DashboardBox>
      {/* <DashboardBox gridArea="j">
        <BoxHeader
          title="Overall Summary and Explanation Data"
          sideText="+15%"
        />
        <Box
          height="15px"
          margin="1.25rem 1rem 0.4rem 1rem"
          bgcolor={palette.primary[800]}
          borderRadius="1rem"
        >
          <Box
            height="15px"
            bgcolor={palette.primary[600]}
            borderRadius="1rem"
            width="40%"
          ></Box>
        </Box>
        <Typography margin="0 1rem" variant="h6">
          Orci aliquam enim vel diam. Venenatis euismod id donec mus lorem etiam
          ullamcorper odio sed. Ipsum non sed gravida etiam urna egestas
          molestie volutpat et. Malesuada quis pretium aliquet lacinia ornare
          sed. In volutpat nullam at est id cum pulvinar nunc.
        </Typography>
      </DashboardBox> */}
    </>
  );
};

export default Row3;
