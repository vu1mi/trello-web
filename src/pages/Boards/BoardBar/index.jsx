import { Box } from "@mui/material";

function BoardBar() {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: (theme) => theme.trelloCustom.boardBarHeight,
          backgroundColor: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        Board Content
      </Box>
    </>
  );
}

export default BoardBar;
