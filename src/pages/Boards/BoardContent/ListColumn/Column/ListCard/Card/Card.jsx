
import Button from "@mui/material/Button";
import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import AttachmentIcon from "@mui/icons-material/Attachment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Typography, Menu, MenuItem, ListItemIcon, ListItemText, IconButton, Box, TextField, Collapse } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { updateCardAPI, deleteCardApi } from "~/apis/index.js";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";
import { useConfirm } from "material-ui-confirm";

function Card({ card}) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const confirm = useConfirm()
  const [anchorEl, setAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [titleValue, setTitleValue] = useState(card?.title || "");

  const openMenu = Boolean(anchorEl);

  const showCardActions = () =>
    !!card?.memberIds?.length ||
    !!card?.conmemnts?.length ||
    !!card?.attachments?.length;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card._id, data: { ...card } });

  const dndKitCardStyles = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #32e33b" : undefined,
  };

  const handleOpenMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  const handleEdit = () => {
    handleCloseMenu();
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!titleValue.trim() || titleValue.trim() === card.title) {
      setEditMode(false);
      setTitleValue(card.title);
      return;
    }
    
    try{

      const response = await updateCardAPI(card._id, titleValue.trim());
      if (response.status === 200) {
        toast.success("Update card title successfully")
        const newboard = cloneDeep(board)
        for (const column of newboard.columns) {
          const cardToupdate = column.cards.find(c => c._id === card._id)
          if (cardToupdate) {
            cardToupdate.title = titleValue.trim()
            break
          }
        }
        dispatch(updateCurrentActiveBoard(newboard))
      }

    }catch(error){
      toast.error("Failed to update card title. Please try again.")
      setTitleValue(card.title);
    }

    setEditMode(false);
  };

  const handleDelete = async () => {
    handleCloseMenu();
      const consfirmed = await confirm({
        title: "Are you sure you want to delete this card?",
        description: "This action cannot be undone.",
        confirmationText: "Delete",
         cancellationText: 'Cancel',
       })

      if (!consfirmed) return;
      const response = await deleteCardApi(card._id)
      if (response.status === 204) {
        toast.success("Delete card successfully")
      }
      const newboard = cloneDeep(board)
      for (const column of newboard.columns) {
        if (column.cards.some(c => c._id === card._id)) {
          column.cards = column.cards.filter(c => c._id !== card._id)
          column.cardOrderIds = column.cardOrderIds.filter(id => id !== card._id)
          break
        }      }
      dispatch(updateCurrentActiveBoard(newboard))

  };

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{ boxShadow: "0 1px 1px rgba(0,0,0,0.2)", overflow: "unset", position: "relative" }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}

      <CardContent sx={{ p: 1.5, pb: "8px !important" }}>
        <Collapse in={!editMode} timeout={150} unmountOnExit>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ flexGrow: 1 }}>{card?.title}</Typography>
            <IconButton
              size="small"
              onClick={handleOpenMenu}
              sx={{ ml: 0.5, opacity: 0.6, "&:hover": { opacity: 1 } }}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Box>
        </Collapse>

        <Collapse in={editMode} timeout={150} unmountOnExit>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <TextField
              autoFocus
              size="small"
              variant="outlined"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") { setEditMode(false); setTitleValue(card.title); }
              }}
              sx={{ width: "100%" }}
            />
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Button
                size="small"
                onClick={() => { setEditMode(false); setTitleValue(card.title); }}
                sx={{
                  flex: 1, py: 0.5, color: "white", backgroundColor: "#e95151",
                  transition: "background-color 0.2s ease",
                  "&:hover": { backgroundColor: "#f06868" },
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                onClick={handleSaveEdit}
                disabled={!titleValue.trim()}
                sx={{
                  flex: 1, py: 0.5, color: "white", backgroundColor: "#5aac44",
                  transition: "background-color 0.2s ease",
                  "&:hover": { backgroundColor: "#77d25e" },
                  "&.Mui-disabled": { backgroundColor: "#a0c99a", color: "white" },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>

      {showCardActions() && (
        <CardActions sx={{ p: "0 4px 8px 4px" }}>
          {!!card?.memberIds?.length && (
            <Button size="small" startIcon={<GroupIcon />}>
              {card?.memberIds?.length}
            </Button>
          )}
          {!!card?.conmemnts?.length && (
            <Button size="small" startIcon={<ChatBubbleIcon />}>
              {card?.conmemnts?.length}
            </Button>
          )}
          {!!card?.attachments?.length && (
            <Button size="small" startIcon={<AttachmentIcon />}>
              {card?.attachments?.length}
            </Button>
          )}
        </CardActions>
      )}

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        slotProps={{ list: { dense: true } }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit title</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon><DeleteOutlineIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Delete card</ListItemText>
        </MenuItem>
      </Menu>
    </MuiCard>
  );
}

export default Card;
