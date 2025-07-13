import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery, useGetSuggestionsQuery } from "@/state/api";
import { useTheme } from "@mui/material";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
  Area,
} from "recharts";
import SuggestionsCard from "@/scenes/SuggestionsCard";


const Row1 = () => {
  const { palette } = useTheme();
  const { data } = useGetKpisQuery();
  const { data: suggestionsData } = useGetSuggestionsQuery();

  const revenue = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
        };
      })
    );
  }, [data]);

  const revenueExpenses = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          expenses: expenses,
        };
      })
    );
  }, [data]);

  const revenueProfit = useMemo(() => {
    console.log("data", data);
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          profit: (revenue - expenses).toFixed(2),
        };
      })
    );
  }, [data]);

  const filteredSuggestions = useMemo(() => {
    return (
      suggestionsData &&
      suggestionsData.filter(
        (sugg) =>
          sugg.type === "profit_margin" ||
          sugg.type === "low_state" ||
          sugg.type === "top_state" ||
          sugg.type === "delivery" ||
          sugg.type === "peak_month"  ||
          sugg.type === "low_month"
      )
    );
  }, [suggestionsData]);
  return (
    <>
    {/* ✅ Suggestions Box
      <DashboardBox gridArea="s" sx={{ maxHeight: "300px", overflowY: "auto" }}>
        {filteredSuggestions && (
          <SuggestionsCard suggestions={filteredSuggestions} />
        )}
      </DashboardBox> */}
      <DashboardBox gridArea="a">
        <BoxHeader
          title="Revenue and Expenses"
          subtitle="Blue line represents revenue, Red line represents expenses"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={revenueExpenses}
            margin={{
              top: 15,
              right: 25,
              left: 20,
              bottom: 60,
            }}
          >
            <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#fca5a5" stopOpacity={0} />
            </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ strokeWidth: "0" }}
              style={{ fontSize: "10px" }}  // Smaller font size
              domain={[8000, 23000]}
              tick={{ dx: -5 }} // Shift numbers slightly left
              tickFormatter={(value) => `$${Math.round(value / 1000)}K`}
            />

            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`]}/>
            <Area
              type="monotone"
              dataKey="revenue"
              dot={true}
              stroke="#1e40af"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              dot={true}
              stroke="#b91c1c"
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="b">
        <BoxHeader
          title="Profit and Revenue"
          subtitle="Orange line represents revenue, Green line represents profit"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={revenueProfit}
            margin={{
              top: 15,
              right: 25,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            {/* <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
              domain={[dataMin => dataMin * 1.1, dataMax => dataMax * 1.1]} // Expands scale slightly
              />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            /> */}
            <YAxis domain={["auto", "auto"]} tickFormatter={(value) => `$${Math.round(value / 1000)}K`}/>
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`]}/>
            <Legend
              height={20}
              wrapperStyle={{
                margin: "0 0 10px 0",
              }}
            />
            <Line
              // yAxisId="left"
              type="monotone"
              dataKey="profit"
              stroke="#22c55e"
              
              strokeWidth={2}
            />
            <Line
              // yAxisId="right"
              type="monotone"
              dataKey="revenue"
               stroke="#f97316"
               
               
              strokeWidth={2}
            />
  

          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      {/* <DashboardBox gridArea="c">
        <BoxHeader
          title="Revenue Month by Month"
          subtitle="graph representing the revenue month by month"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={revenue}
            margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Bar dataKey="revenue" fill="url(#colorRevenue)" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox> */}
    </>
  );
};

export default Row1;
