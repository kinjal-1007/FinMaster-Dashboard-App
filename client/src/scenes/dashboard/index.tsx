import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";
import SuggestionsCard from "@/scenes/SuggestionsCard"; // update the import as per your structure
import { useMemo } from "react";
import { useGetSuggestionsQuery } from "@/state/api"; // adjust path as needed

const gridTemplateLargeScreens = `
  "a b b"
  "a b b"
  "a b b"
  "a b b"
  "a b b"
  "c e f"
  "c e f"
  "c i f"
  "c i f"
  "c i f"
`;

const gridTemplateSmallScreens = `
  "a"
  "a"
  "a"
  "a"
  "b"
  "b"
  "b"
  "b"
  "c"
  "c"
  "c"
  "e"
  "e"
  "f"
  "f"
  "f"
  "i"
  "i"
`;

const Dashboard = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data } = useGetSuggestionsQuery();

  // Filter suggestions logic example
  const filteredSuggestions = useMemo(() => {
      return (
        data &&
        data.filter(
          (sugg) =>
            sugg.type === "profit_margin" ||
            sugg.type === "low_state" ||
            sugg.type === "top_state" ||
            sugg.type === "delivery" ||
            sugg.type === "peak_month"  ||
            sugg.type === "low_month"
        )
      );
    }, [data]);

  return (
    <Box width="100%" height="100%" p="1rem" display="flex" flexDirection="column" gap="1.5rem">
      {/* Suggestion Card ABOVE the Grid */}
    <SuggestionsCard suggestions={filteredSuggestions ?? []} />

      {/* Dashboard Grid Below */}
      <Box
        width="100%"
        height="100%"
        display="grid"
        gap="1.5rem"
        sx={
          isAboveMediumScreens
            ? {
                gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
                gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
                gridTemplateAreas: gridTemplateLargeScreens,
              }
            : {
                gridAutoColumns: "1fr",
                gridAutoRows: "80px",
                gridTemplateAreas: gridTemplateSmallScreens,
              }
        }
      >
        <Row1 />
        <Row2 />
        <Row3 />
      </Box>
    </Box>
  );
};

export default Dashboard;
