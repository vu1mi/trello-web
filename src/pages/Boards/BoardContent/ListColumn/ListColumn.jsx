import Box from "@mui/material/Box";
import Column from "./Column/Column";
import { Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

function ListColumn({ columns }) {
  return (
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          backgroundColor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        {/* <Column /> */}
        {columns?.map((column) => (
          <Column key={column._id} column={column} />
        ))}
        <Box
          sx={{
            minWidth: "200px",
            maxWidth: "200px",
            mx: 2,
            borderRadius: "6px",
            height: "fit-content",
            bgcolor: "#ffffff3d",
          }}
        >
          <Button
            startIcon={<AddBoxIcon />}
            sx={{
              color: "white",
              m: 0,
              width: "100%",
              justifyContent: "flex-start",
              pl: 2.5,
              py: 1,
            }}
          >
            Add new column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  );
}

export default ListColumn;
