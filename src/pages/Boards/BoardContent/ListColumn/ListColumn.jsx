import Box from "@mui/material/Box";
import Column from "./Column/Column";
import { Button, Collapse } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React from "react";
import TextField from '@mui/material/TextField';
import { cloneDeep } from "lodash";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import {  createColumnAPI, deleteColumnAPI  } from "~/apis/index.js";

function ListColumn({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [openinput, setOpenInput] = React.useState(false);
  const [valueInput, setValueInput] = React.useState("");

  const createNewColumn = async () => {
    if (!valueInput.trim()) return;

    
    const newboard = cloneDeep(board)
    const createdColumn = await createColumnAPI({  "title": valueInput.trim() , "boardId": board._id })
        newboard.columns.push(createdColumn)
        newboard.columnOrderIds.push(createdColumn._id)
        dispatch(updateCurrentActiveBoard(newboard))

    // await createColumn({ title: valueInput.trim() });
    setOpenInput(false);
    setValueInput("");
  };
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
          <Column key={column._id} column={column}   />
        ))}
        <Box
          sx={{
            minWidth: "250px",
            maxWidth: "300px",
            mx: 2,
            borderRadius: "6px",
            height: "fit-content",
            bgcolor: "#ffffff3d",
            p: 1,
          }}
        >
          <Collapse in={!openinput} timeout={200} unmountOnExit>
            <Button
              onClick={() => setOpenInput(true)}
              startIcon={<AddBoxIcon />}
              sx={{
                color: "white",
                width: "100%",
                justifyContent: "flex-start",
                pl: 1.5,
                py: 1,
              }}
              className="interceptor-loading"
            >
              Add new column
            </Button>
          </Collapse>

          <Collapse in={openinput} timeout={200} unmountOnExit>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <TextField
                autoFocus
                label="Title column"
                variant="outlined"
                size="small"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') createNewColumn();
                  if (e.key === 'Escape') { setOpenInput(false); setValueInput(''); }
                }}
                sx={{ width: "100%", 
                   bgcolor: (theme) =>
                   theme.palette.mode === "dark" ? "transparent" : "white", 
                   borderRadius: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={() => { setOpenInput(false); setValueInput(''); }}
                  sx={{
                    color: "white",
                    flex: 1,
                    py: 0.75,
                    backgroundColor: "#e95151",
                    transition: "background-color 0.2s ease",
                    '&:hover': { backgroundColor: "#f06868" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createNewColumn}
                  disabled={!valueInput.trim()}
                  sx={{
                    color: "white",
                    flex: 1,
                    py: 0.75,
                    backgroundColor: "#5aac44",
                    transition: "background-color 0.2s ease",
                    '&:hover': { backgroundColor: "#77d25e" },
                    '&.Mui-disabled': { backgroundColor: "#a0c99a", color: "white" },
                  }}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </SortableContext>
  );
}

export default ListColumn;
