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
import { useDroppable } from '@dnd-kit/core';
import {deleteColumnAPI, updateColumnAPI,createCardAPI} from "~/apis";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { cloneDeep } from "lodash";
import { useConfirm } from 'material-ui-confirm'
function Column({ column}) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const confirm = useConfirm()
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
    try{
      const createdCard = await createCardAPI({ ...dataCard, boardId: board._id })
   
      const newboard = cloneDeep(board)
      const columnToupdate = newboard.columns.find(c => c._id === createdCard.data.columnId)
        if (!columnToupdate) {
          toast.error("Column not found");
          return;
      }
      columnToupdate.cards.push(createdCard.data)
      columnToupdate.cardOrderIds.push(createdCard.data._id)
        dispatch(updateCurrentActiveBoard(newboard))
        toast.success("Create card successfully")
      }
      catch(error){
        toast.error("Create card failed")
        return
      }
    // console.log(response)
    setValueInput("")
    setOpenInput(false)
    
  }

  const handleDeleteColumn = async () => {

    try{
      const { confirmed } = await confirm({
      title: 'Xóa column ?',
      description: 'Hành động này không thể hoàn tác!',
      confirmationText: 'Delete',
      cancellationText: 'Cancel',
       })

      if (!confirmed) return
       const response = await deleteColumnAPI(column._id)
       console.log(response)

      if (response.status === 204) {
            toast.success("Delete column successfully")
            const newboard = cloneDeep(board)
            newboard.columns = newboard.columns.filter(c => c._id !== column._id)
            newboard.columnOrderIds = newboard.columnOrderIds.filter(id => id !== column._id)
            dispatch(updateCurrentActiveBoard(newboard))
        }
    
     
    }catch(error){
      if (error?.confirmed === false) return // 👈 user cancel
     toast.error("Delete column failed")
    }
  
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
            <MenuItem
              onClick={handleDeleteColumn}>
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
      <ListCard cards={orderCard}  />

      {/* column footer */}
      <Box
        sx={{
          px: 2,
          pb: 1,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Collapse in={!openInput} timeout={200} unmountOnExit>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button 
            startIcon={<AddCardIcon />}
            onClick={() => setOpenInput(true)}
            className="interceptor-loading"
            >Add new card</Button>
            <Tooltip title="Drag to move">
              <DragHandleIcon sx={{ cursor: "pointer" }} />
            </Tooltip>
          </Box>
        </Collapse>

        <Collapse in={openInput} timeout={200} unmountOnExit>
          <Box sx={{ width: "100%", boxSizing: "border-box" }}>
            <TextField
              autoFocus
              id="outlined-new-card"
              label="Title card"
              variant="outlined"
              size="small"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && valueInput.trim()) {
                  createNewCard({ title: valueInput.trim(), columnId: column._id });
                }
                if (e.key === 'Escape') {
                  setOpenInput(false);
                  setValueInput('');
                }
              }}
              sx={{ width: "100%", mb: 1, boxSizing: "border-box" }}
            />
            <Box sx={{ display: 'flex', gap: 1, width: "100%", boxSizing: "border-box" }}>
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
                onClick={() => valueInput.trim() && createNewCard({ title: valueInput.trim(), columnId: column._id })}
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
  );
}

export default Column;
