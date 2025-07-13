import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
import SuggestionsCard from "@/scenes/SuggestionsCard"; // update the import as per your structure
import { useMemo } from "react";
import { useGetSuggestionsQuery } from "@/state/api"; 
const gridTemplateLargeScreens = `
    "g g h h"
    "g g h h"
    "g g h h"
    "g g h h"
    "g g h h"
    "g g h h"
    "i i j j"
    "i i j j"
    "i i j j"
    "i i j j"
    "i i j j"
    "i i j j"
`;
const gridTemplateSmallScreens = `
  "g"
  "g"
  "g"
  "g"
  "g"
  "h"
  "h"
"h"
"h"
"h"
"i"
"i"
"i"
"i"
"j"
"j"
"j"
"j"`;

const Products = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
  const { data } = useGetSuggestionsQuery();

  // Filter suggestions logic example
  const filteredSuggestions = useMemo(() => {
      return (
        data &&
        data.filter(
          (sugg) =>
            sugg.type === "low_profit_high_sale" ||
            sugg.type === "low_category" ||
            sugg.type === "top_category" 
        )
      );
    }, [data]);
  return (
    <Box width="100%" height="100%" p="1rem" display="flex" flexDirection="column" gap="1.5rem">
      {/* Suggestion Card ABOVE the Grid */}
    <SuggestionsCard suggestions={filteredSuggestions ?? []} />
    <Box
      width="100%"
      height="100%"
      display="grid"
      gap="1.5rem"
      sx={
        isAboveMediumScreens
          ? {
              gridTemplateColumns: "repeat(4, minmax(270px, 1fr))",
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
      <Row2/>
    </Box>
    </Box>
  );
};

export default Products;
