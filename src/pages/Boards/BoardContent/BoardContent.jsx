import Box from "@mui/material/Box";
import ListColumn from "./ListColumn/ListColumn";

function BoardContent() {
  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        height: (theme) => theme.trelloCustom.boardContentHeight,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
        display: "flex",
      }}
    >
      <ListColumn />
    </Box>
  );
}

export default BoardContent;
