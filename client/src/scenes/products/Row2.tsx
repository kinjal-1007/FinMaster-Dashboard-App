import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetProductsQuery, useGetTransactionsQuery } from "@/state/api";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d62728"];

const Row2 = () => {
    const { palette } = useTheme();
    const { data: productData, isLoading: isProductsLoading } = useGetProductsQuery();
    const { data: transactionData = [] } = useGetTransactionsQuery();
  
    // Top 5 Products Bar Chart Data
    const topProducts = useMemo(() => {
      if (!productData || productData.length === 0) return [];
    
      return productData
        .filter((product) => product?.totalSales !== undefined)
        .sort((a, b) => (b.totalSales ?? 0) - (a.totalSales ?? 0))
        .slice(0, 5)
        .map(({ product_name, totalSales }) => {
          const name = product_name || "Unknown Product";
          const shortName = name.split(" ").slice(0, 3).join(" ");
          return {
            name: shortName,
            totalSales: totalSales ?? 0,
          };
        });
        
    }, [productData]);
      
      // Memoized Pie Chart Data for Product Categories
      const categoryData = useMemo(() => {
        console.log(productData);
        if (!productData || productData.length === 0) return [];
      
        const categoryMap: Record<string, number> = {};
      
        productData.forEach(({ category, totalQuantity }) => {
          if (category && totalQuantity !== undefined) {
            categoryMap[category] = (categoryMap[category] || 0) + totalQuantity;
          }
        });
      
        return Object.entries(categoryMap).map(([name, value]) => ({
          name,
          value,
        }));
      }, [productData]);
  return (
    <>
      <DashboardBox gridArea="i">
  <BoxHeader
    title="Top 5 Products by Sales"
    subtitle="A horizontal bar chart showing highest sales products"
    sideText=""
  />
  <ResponsiveContainer width="100%" height="90%">
    <BarChart
      layout="vertical"
      data={topProducts}
      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
    >
      <defs>
        <linearGradient id="colorSales" x1="0" y1="0" x2="1" y2="0">
          <stop offset="5%" stopColor="#1e40af" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <CartesianGrid horizontal={false} stroke={palette.grey[700]} />
      <XAxis type="number" tickLine={false} tick={{ fill: palette.grey[900], fontSize: "12px" }}   tickFormatter={(value) => `$${value.toLocaleString()}`}
      />
      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: palette.grey[900], fontSize: "12px" }} width={100} />
      <Tooltip cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}   formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
      />
      <Bar dataKey="totalSales" fill="url(#colorSales)" barSize={20} radius={[5, 5, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</DashboardBox>

<DashboardBox gridArea="j">
  <BoxHeader
    title="Product Distribution by Category"
    subtitle="Pie chart representing product categories"
    sideText="Total Quantity"
  />
  <ResponsiveContainer width="100%" height="90%">
    <PieChart>
      <Pie
        data={categoryData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={120}
        dataKey="value"
      >
        {categoryData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip   formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
      />
    </PieChart>
  </ResponsiveContainer>
</DashboardBox>
      {/* <DashboardBox gridArea="i">
      <BoxHeader title="Expense Breakdown By Category" sideText="" />
  <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
    {pieChartData?.map((data, i) => (
      <Box key={`${data.name}-${i}`}>
        <PieChart width={110} height={100}>
          <Pie
            stroke="none"
            data={[data]} // Wrap in array so Pie component can read it
            innerRadius={18}
            outerRadius={35}
            paddingAngle={2}
            dataKey="value"
          >
            <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
          </Pie>
        </PieChart>
        <Typography 
          variant="h5" 
          mt="0.5rem" 
          color="blue" // Change to ensure visibility
          fontWeight="bold"
          textAlign="center"
        >
          {data.name}</Typography>
      </Box>
    ))}
  </FlexBetween>
      </DashboardBox> */}
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

export default Row2;
