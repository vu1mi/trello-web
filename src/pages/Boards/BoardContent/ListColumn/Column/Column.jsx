import { Tooltip, Typography, Collapse } from "@mui/material";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCut from "@mui/icons-material/ContentCut";
import Cloud from "@mui/icons-material/Cloud";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ContentCopy, ContentPaste } from "@mui/icons-material";
import AddCardIcon from "@mui/icons-material/AddCard";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import ListCard from "./ListCard/ListCard";
import { mapOrder } from "~/utils/sorts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';
import { useDroppable } from '@dnd-kit/core';
function Column({ column, createCard }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openInput, setOpenInput] = useState(false);
  const [valueInput, setValueInput] = useState("");

  const open = Boolean(anchorEl);
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: column._id,
  });
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const orderCard = mapOrder(column?.cards, column?.cardOrderIds, "_id");

  const { attributes, listeners, setNodeRef: setSortRef, transform, transition, isDragging} =
    useSortable({ id: column._id, data: { ...column } });
  const dndKitColumnStyles = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : undefined,
  };
  const createNewCard = async (dataCard) => {
    await createCard(dataCard)
    setValueInput("")
    setOpenInput(false)
  }
    const setRefs = (node) => {
    setDropRef(node);
    setSortRef(node);
  };

  return (
    <Box
      ref={setRefs}
      style={dndKitColumnStyles}
      {...attributes}
      {...listeners}
      sx={{
        minWidth: "300px",
        maxWidth: "300px",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
        ml: 2,
        pb: 1,
        borderRadius: "6px",
        height: "fit-content",
        // maxHeight: (theme) =>
        //   `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(
        //     5
        //   )})`,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "15px 0 "
      }}
    >
      {/* column header */}
      <Box
        sx={{
          height: (theme) => theme.trelloCustom.column_header_height,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {column?.title}
        </Typography>
        <Box>
          <ExpandMoreIcon
            id="basic-column-dropdown"
            aria-controls={open ? "basic-menu-column-dropdown" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{
              color: "text.primary",
              cursor: "pointer",
            }}
          />
          <Menu
            id="basic-menu-column-dropdown"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "basic-column-dropdown",
              },
            }}
          >
            <MenuItem>
              <ListItemIcon>
                <AddCardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add new card </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCut fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cut</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPaste fontSize="small" />
              </ListItemIcon>
              <ListItemText>Patse</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <DeleteOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Remove column</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Archive this column</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <ListCard cards={orderCard} />

      {/* column footer */}
      <Box
        sx={{
          height: "auto",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Collapse in={openInput} timeout="auto" unmountOnExit>
          <Box sx={{ width: "100%", boxSizing: "border-box" }}>
            <TextField
              id="outlined-suffix-shrink"
              label="Title card"
              variant="outlined"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              sx={{ width: "100%", mb: 1, boxSizing: "border-box", transition: "all 0.3s ease" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        opacity: 0,
                        margin: "0 10px",

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
            <Box sx={{ display: 'flex', gap: '8px', width: "100%", boxSizing: "border-box", transition: "all 0.3s ease" }}>
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
                  transition: "all 0.2s ease",
                  '&:hover': {
                    backgroundColor: "#f06868",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => createNewCard({ title: valueInput, columnId: column._id })}
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
            </Box>
          </Box>
        </Collapse>
        <Collapse in={!openInput} timeout="auto" unmountOnExit >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Button startIcon={<AddCardIcon />} onClick={() => setOpenInput(true)}>Add new card</Button>
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: "pointer" }} />
            </Tooltip>
          </Box>
        </Collapse>

      </Box>
    </Box>
  );
}

export default Column;
