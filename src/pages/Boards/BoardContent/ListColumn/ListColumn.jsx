import Box from "@mui/material/Box";
import Column from "./Column/Column";
import { Button } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React from "react";
import { filledInputClasses } from '@mui/material/FilledInput';
import { inputBaseClasses } from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { createColumnAPI } from "~/apis";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

function ListColumn({ columns, createColumn, createCard }) {
  const [openNewColumnForm, setOpenNewColumnForm] = React.useState(false);
  const [openinput, setOpenInput] = React.useState(false);
  const [valueInput, setValueInput] = React.useState("");
  const createNewColumn = async () => {
    await createColumn({ title: valueInput });
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
          <Column key={column._id} column={column} createCard={createCard} />
        ))}
        <Box
          sx={{
            minWidth: "200px",
            maxWidth: "400px",
            mx: 2,
            borderRadius: "6px",
            height: "fit-content",
            bgcolor: "#ffffff3d",
          }}
        >
          {
            openinput === false ?

              <Button
                onClick={() => setOpenInput(true)}
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
              : <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
                  transform: openinput ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.3s ease",

                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-suffix-shrink"
                  label="Title column"
                  variant="outlined"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"

                          sx={{

                            opacity: 0,
                            pointerEvents: 'none',
                            [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                              opacity: 1,
                            },

                          }}

                        >

                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', padding: '0 8px 8px' }}>
                  <Button
                    onClick={() => setOpenInput(false)}

                    sx={{
                      color: "white",
                      m: 0,
                      width: "100%",
                      justifyContent: "flex-start",
                      pl: 2.5,
                      py: 1,
                      backgroundColor: "#e95151",
                      '&:hover': {
                        backgroundColor: "#f06868",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => createNewColumn(valueInput)}
                    sx={{
                      color: "white",
                      m: 0,
                      width: "100%",
                      justifyContent: "flex-start",
                      pl: 2.5,
                      py: 1,
                      backgroundColor: "#5aac44",
                      '&:hover': {
                        backgroundColor: "#77d25e",
                      },
                    }}
                  >
                    Create
                  </Button>

                </div>


              </Box>
          }
        </Box>
      </Box>
    </SortableContext>
  );
}

export default ListColumn;
