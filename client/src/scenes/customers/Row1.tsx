import React, { useMemo } from "react";
import { useTheme, Box, Typography } from "@mui/material";
import DashboardBox from "@/components/DashboardBox";
import BoxHeader from "@/components/BoxHeader";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useGetCustomersQuery } from "@/state/api";

const Row1 = () => {
  const { palette } = useTheme();
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];
  const { data: customersData } = useGetCustomersQuery();

  // 🎯 Top 5 by Revenue
  const topCustomersByRevenue = [...(customersData || [])]
    .sort((a, b) => b.revenue_generated - a.revenue_generated)
    .slice(0, 5);

  // 🎯 Top 5 by Lifetime Value
  const topCustomersByLifetime = [...(customersData || [])]
  .sort((a, b) => b.estimated_ltv - a.estimated_ltv)
  .slice(0, 5);

  // 🎯 Segment Distribution
  const segmentData = useMemo(() => {
    if (!customersData || customersData.length === 0) return [];

    const segmentMap: Record<string, number> = {};

    customersData.forEach(({ segment }) => {
      if (segment) {
        segmentMap[segment] = (segmentMap[segment] || 0) + 1;
      }
    });

    return Object.entries(segmentMap || {}).map(([name, value]) => ({
      name,
      value,
    }));
  }, [customersData]);

  // 📊 **Columns for DataGrid**
  const revenueColumns: GridColDef[] = [
    {
      field: "customer_name",
      headerName: "Customer Name",
      flex: 1,
    },
    {
      field: "revenue_generated",
      headerName: "Revenue Generated",
      flex: 1,
      renderCell: (params) => `$${params.value.toLocaleString()}`,
    },
  ];

  const lifetimeColumns: GridColDef[] = [
    {
      field: "customer_name",
      headerName: "Customer Name",
      flex: 1,
    },
    {
      field: "lifetime_value",
      headerName: "Lifetime Value",
      flex: 1,
      renderCell: (params) => `$${params.value.toLocaleString()}`,
    },
  ];

  // 💡 **Data Formatting**
  const revenueRows = topCustomersByRevenue.map((customer, index) => ({
    id: index,
    customer_name: customer.customer_name,
    revenue_generated: customer.revenue_generated,
  }));

  const lifetimeRows = topCustomersByLifetime.map((customer, index) => ({
    id: index,
    customer_name: customer.customer_name,
    lifetime_value:
      customer.average_order_value * customer.purchase_frequency,
  }));

  return (
    <>
      {/* Top Customers by Revenue */}
      <DashboardBox gridArea="a">
        <BoxHeader 
          title="Top 5 Customers by Revenue" 
          sideText={`${topCustomersByRevenue.length} customers`} 
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[800],
              border: "none",
              fontSize: "0.8rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
              fontSize: "0.9rem",
            },
          }}
        >
          <DataGrid
            rows={revenueRows}
            columns={revenueColumns}
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
          />
        </Box>
      </DashboardBox>

      {/* Top Customers by Lifetime Value */}
      <DashboardBox gridArea="b">
        <BoxHeader 
          title="Top 5 Customers by Lifetime Value" 
          sideText={`${topCustomersByLifetime.length} customers`} 
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[800],
              border: "none",
              fontSize: "0.8rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
              fontSize: "0.9rem",
            },
          }}
        >
          <DataGrid
            rows={lifetimeRows}
            columns={lifetimeColumns}
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
          />
        </Box>
      </DashboardBox>
      {/* Customer Distribution by Segment */}
<DashboardBox gridArea="c">
  <BoxHeader 
    title="Segment Distribution" 
    sideText={`${segmentData.reduce((acc, curr) => acc + curr.value, 0)} customers`}
  />
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    height="80%"
    position="relative"
    p="0.5rem"
  >
    {segmentData.length > 0 ? (
      <Box width="100%" height="100%" position="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segmentData}
              cx="60%"
              cy="50%"
              labelLine={false}
              label={({
                name,
                percent,
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize="0.75rem"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
              outerRadius={80}
              innerRadius={40}
              paddingAngle={5}
              dataKey="value"
            >
              {segmentData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [
                `${value} customers`, 
                name
              ]}
              contentStyle={{
                backgroundColor: palette.background.paper,
                border: `1px solid ${palette.grey[800]}`,
                borderRadius: '4px',
                padding: '0.5rem'
              }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{
                fontSize: "0.75rem",
                paddingLeft: "1rem",
                color: palette.text.primary
              }}
              formatter={(value) => (
                <span style={{ color: palette.text.primary }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    ) : (
      <Typography variant="h6" color={palette.grey[300]}>
        Loading data...
      </Typography>
    )}
  </Box>
</DashboardBox>
    </>
  );
};

export default Row1;
