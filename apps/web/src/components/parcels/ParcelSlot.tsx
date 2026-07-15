import { Box } from "@mui/material";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

// Пустой слот-полоска: тусклый силуэт будущей карточки внутри полоски.
export default function EmptyParcelSlot() {
  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      gap={{ xs: 1.5, md: 2 }}
      px={{ xs: 2, md: 2.5 }}
      py={2}
      sx={{ opacity: 0.25 }}
    >
      <Box
        flexShrink={0}
        width={44}
        height={44}
        borderRadius={2.5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="text.disabled"
        sx={{ bgcolor: "action.hover" }}
      >
        <Inventory2RoundedIcon />
      </Box>
      <Box flex={1} minWidth={0} display="flex" flexDirection="column" gap={1}>
        <Box
          height={12}
          width="45%"
          borderRadius={1}
          sx={{ bgcolor: "action.selected" }}
        />
        <Box
          height={10}
          width="70%"
          borderRadius={1}
          sx={{ bgcolor: "action.hover" }}
        />
      </Box>
    </Box>
  );
}
