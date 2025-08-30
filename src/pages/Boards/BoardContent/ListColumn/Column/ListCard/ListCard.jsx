import Card from "./Card/Card";
import Box from "@mui/material/Box";

function ListCard() {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflowX: "hidden",
        maxHeight: (theme) =>
          `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(
            5
          )} - ${theme.trelloCustom.column_footer_height} - ${
            theme.trelloCustom.column_header_height
          })`,
        overflowY: "auto",
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "3cedda",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "white",
        },
      }}
    >
      <Card />
    </Box>
  );
}

export default ListCard;
