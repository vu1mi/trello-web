import Card from "./Card/Card";
import Box from "@mui/material/Box";
import { SortableContext,verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Sort } from "@mui/icons-material";

function ListCard({ cards }) {
  return (
    <SortableContext items={cards.map(card => card._id) } strategy={verticalListSortingStrategy}>
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
      {cards.map((card) => (
        <Card card={card} key={card._id}   />
      ))}
    </Box>
    </SortableContext>
  );
}

export default ListCard;
