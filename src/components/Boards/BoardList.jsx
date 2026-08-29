// components/BoardList.jsx
import { Grid } from "@mui/material";
import BoardCard from "./BoardCard";
import randomColor from "randomcolor";


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