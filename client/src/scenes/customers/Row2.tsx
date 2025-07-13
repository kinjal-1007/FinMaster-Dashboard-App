import { Box, Typography } from "@mui/material";
import DashboardBox from "../../components/DashboardBox";
import BoxHeader from "../../components/BoxHeader";
import { useGetCustomersQuery } from "../../state/api";
import moment from "moment";
import { BarChart, Bar, XAxis, Tooltip, CartesianGrid, ResponsiveContainer, YAxis } from "recharts";
import { useTheme } from "@mui/material/styles";

const Row2 = () => {
  const { palette } = useTheme();
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];
  const { data: customersData } = useGetCustomersQuery();

  if (!customersData || customersData.length === 0) {
    console.log("No customer data found.");
    return null;
  }
   interface Customer {
    id: string;                         
    _id: string;                        
    __v: number;                        
    customer_name: string;              
    segment: string;                    
    region: string;                     
    last_purchase: string;              
    purchase_frequency: number;         
    revenue_generated: number;          
    average_order_value: number;        
    product_ids: Array<string>;         
    createdAt: string;                  
    updatedAt: string;    
  }

  const latestPurchaseDate = customersData
  ? moment(Math.max(...customersData.map(c => new Date(c.last_purchase).getTime())))
  : moment();
  // Explicitly type recencyBuckets
  const recencyBuckets: {
    "< 1 Month": Customer[];
    "1-3 Months": Customer[];
    "> 3 Months": Customer[];
  } = {
    "< 1 Month": [],
    "1-3 Months": [],
    "> 3 Months": [],
  };

  customersData?.forEach((customer) => {
  const daysSincePurchase = latestPurchaseDate.diff(moment(customer.last_purchase), "days");
    if (daysSincePurchase <= 30) recencyBuckets["< 1 Month"].push(customer);
    else if (daysSincePurchase <= 90) recencyBuckets["1-3 Months"].push(customer);
    else recencyBuckets["> 3 Months"].push(customer);
  });

  // 📊 Retention vs Churn (example calculation, refine as needed)
  const totalCustomers = customersData?.length || 0;
  const retained = recencyBuckets["< 1 Month"].length + recencyBuckets["1-3 Months"].length;
  const churned = totalCustomers - retained;

  const retentionData = [
    { name: "Retained", value: retained },
    { name: "Churned", value: churned },
  ];


  return (
    <>
      {/* Customer Recency Buckets - Now Horizontal */}
      <DashboardBox gridArea="d">
        <BoxHeader 
          title="Customer Recency" 
          sideText={`${totalCustomers} total`}
        />
        <Box
          p="0.5rem"
          height="80%"
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          gap="1rem"
        >
          {Object.entries(recencyBuckets).map(([bucket, customers], index) => (
            <Box 
              key={index} 
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p="1rem"
              sx={{
                backgroundColor: palette.background.paper,
                borderRadius: "0.5rem",
                width: "100%",
                // border: `1px solid ${palette.grey[800]}`,
              }}
            >
              <Typography 
                variant="h3" 
                color={palette.text.primary} // Darker text
                fontWeight="600"
              >
                {bucket}
              </Typography>
              <Typography 
                variant="h2" 
                color={colors[index % colors.length]}
                fontWeight="700"
              >
                {customers.length}
              </Typography>
              <Typography 
                variant="h4" 
                color={palette.text.secondary} // Better contrast
              >
                {((customers.length / totalCustomers) * 100).toFixed(1)}% of total
              </Typography>
            </Box>
          ))}
        </Box>
      </DashboardBox>

      {/* Retention vs Churn Rate */}
      <DashboardBox gridArea="e">
        <BoxHeader 
          title="Retention vs Churn" 
          sideText={`${((retained / totalCustomers) * 100).toFixed(1)}% retained`}
        />
        <Box
          height="80%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={retentionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[800]} />
              <XAxis 
                dataKey="name" 
                tick={{ 
                  fill: palette.text.primary, // Darker text
                  fontSize: 12 
                }}
                tickLine={{ stroke: palette.grey[800] }}
              />
              <YAxis 
                tick={{ 
                  fill: palette.text.primary, // Darker text
                  fontSize: 12 
                }}
                tickLine={{ stroke: palette.grey[800] }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: palette.background.default,
                  border: `1px solid ${palette.grey[800]}`,
                  borderRadius: "4px",
                  color: palette.text.primary // Darker text
                }}
              />
              <Bar 
                dataKey="value" 
                fill={palette.primary.main}
                radius={[4, 4, 0, 0]}
                label={{ 
                  position: 'top', 
                  fill: palette.text.primary, // Darker text
                  fontSize: 12
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </DashboardBox>

{/* Purchase Frequency & AOV - Compact Table Style */}
<DashboardBox gridArea="f">
  <BoxHeader 
    title="Purchase Behavior" 
    sideText={`${customersData?.length || 0} customers`}
  />
  <Box
    sx={{
      height: 'calc(100% - 4rem)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '1rem',
      marginRight: '2rem',
    }}
  >
    <Box
      sx={{
        overflow: 'auto',
        flex: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: palette.grey[800],
        },
        '&::-webkit-scrollbar-thumb': {
          background: palette.primary.main,
          borderRadius: '3px',
        },
      }}
    >
      <Box 
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 4px',
        }}
      >
        <Box 
          component="thead"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: palette.background.default,
          }}
        >
          <Box component="tr">
            <Box 
              component="th"
              sx={{
                p: '0.75rem 1rem',
                textAlign: 'left',
                color: palette.text.secondary,
                fontWeight: 500,
                borderBottom: `1px solid ${palette.grey[800]}`,
              }}
            >
              Customer
            </Box>
            <Box 
              component="th"
              sx={{
                p: '0.75rem 1rem',
                textAlign: 'right',
                color: palette.text.secondary,
                fontWeight: 500,
                borderBottom: `1px solid ${palette.grey[800]}`,
              }}
            >
              Frequency
            </Box>
            <Box 
              component="th"
              sx={{
                p: '0.75rem 1rem',
                textAlign: 'right',
                color: palette.text.secondary,
                fontWeight: 500,
                borderBottom: `1px solid ${palette.grey[800]}`,
              }}
            >
              Avg Order Value
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {customersData?.map((customer) => (
            <Box 
              component="tr"
              key={customer._id}
              sx={{
                backgroundColor: palette.background.paper,
                '&:hover': {
                  backgroundColor: palette.action.hover,
                },
              }}
            >
              <Box 
                component="td"
                sx={{
                  p: '0.75rem 1rem',
                  borderTopLeftRadius: '4px',
                  borderBottomLeftRadius: '4px',
                  color: palette.text.primary,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '150px',
                }}
              >
                {customer.customer_name}
              </Box>
              <Box 
                component="td"
                sx={{
                  p: '0.75rem 1rem',
                  textAlign: 'right',
                  color: palette.primary.main,
                }}
              >
                {customer.purchase_frequency}/month
              </Box>
              <Box 
                component="td"
                sx={{
                  p: '0.75rem 1rem',
                  textAlign: 'right',
                  color: palette.secondary.main,
                  borderTopRightRadius: '4px',
                  borderBottomRightRadius: '4px',
                }}
              >
                ${customer.average_order_value.toFixed(2)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
</DashboardBox>
    </>
  );
};

export default Row2;

