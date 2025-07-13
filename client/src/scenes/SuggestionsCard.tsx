import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

interface Suggestion {
  title: string;
  description: string;
  type: string;
}

interface SuggestionsCardProps {
  suggestions: Suggestion[];
}

const SuggestionsCard = ({ suggestions }: SuggestionsCardProps) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <Accordion defaultExpanded={false} elevation={3} sx={{ borderRadius: "12px"}}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <TipsAndUpdatesIcon sx={{ color: "#ffa800", mr: 1 }} />
        <Typography variant="h3">Business Intel Suggestions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap="1rem">
          {suggestions.map((sugg, index) => (
            <Card key={index} variant="outlined" sx={{ borderRadius: "20px" }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {sugg.title}
                </Typography>
                <Typography variant="body2">{sugg.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SuggestionsCard;


