// components/BoardList.jsx
import { Grid } from "@mui/material";
import BoardCard from "./BoardCard";
import randomColor from "randomcolor";
// const boards = Array.from({ length: 16 }).map((_, i) => ({
//   id: i,
//   title: "Board title",
//   description: "This impressive paella is a perfect...",
//   color: [
//     "#4CAF50",
//     "#3F51B5",
//     "#03A9F4",
//     "#2196F3",
//     "#8BC34A",
//     "#009688",
//     "#FF7043",
//     "#FDD835",
//     "#9575CD",
//     "#00BCD4",
//     "#FFEB3B",
//     "#E91E63",
//   ][i % 12],
// }));

export default function BoardList({ boardsData }) {
  console.log("Rendering BoardList with boardsData:", boardsData);
  return (
    <Grid container mt={8} spacing={2} sx={{ flexWrap: 'wrap' }}>
      {boardsData.map((board) => (
        <Grid item 
        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
        key={board.id}
        >
          <BoardCard
            title={board.title}
            description={board.description}
           color={randomColor()}
           id={board._id}
          />
        </Grid>
      ))}
    </Grid>
  );
}