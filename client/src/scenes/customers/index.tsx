import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
import SuggestionsCard from "@/scenes/SuggestionsCard"; 
import { useMemo } from "react";
import { useGetSuggestionsQuery } from "@/state/api"; 
const gridTemplateLargeScreens = `
  "a b b c"
  "a b b c"
  "a b b c"
  "a b b c"
  "d d e e"
  "d d e e"
  "d d e e"
  "f f f f"
  "f f f f"
  "f f f f"
  "f f f f"
  "f f f f"
  "f f f f"
  "f f f f"
  "f f f f"
  "f f f f"
  "f f f f"

`;

const gridTemplateMediumScreens = `
  "a b"
  "a b"
  "a b"
  "c d"
  "c d"
  "e f"
  "e f"
  "g h"
  "g h"
`;

const gridTemplateSmallScreens = `
  "a"
  "b"
  "c"
  "d"
  "e"
  "f"
  "g"
  "h"
`;

const Customers = () => {
  const isAboveLargeScreens = useMediaQuery("(min-width: 1200px)");
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const { data } = useGetSuggestionsQuery();

  // Filter suggestions logic example
  const filteredSuggestions = useMemo(() => {
      return (
        data &&
        data.filter(
          (sugg) =>
            sugg.type === "low_buyers_high_revenue" ||
            sugg.type === "high_buyers_low_revenue" ||
            sugg.type === "top_customer" 
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
      padding="1rem"
      sx={
        isAboveLargeScreens
          ? {
              gridTemplateColumns: "repeat(4, minmax(250px, 1fr))",
              gridTemplateRows: "repeat(8, minmax(60px, 1fr))",
              gridTemplateAreas: gridTemplateLargeScreens,
            }
          : isAboveMediumScreens
          ? {
              gridTemplateColumns: "repeat(2, minmax(200px, 1fr))",
              gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
              gridTemplateAreas: gridTemplateMediumScreens,
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
    </Box>
    </Box>
  );
};

export default Customers;
