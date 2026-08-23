import { Card as MuiCard } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  Typography,
  Box,
  Collapse,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import { updateCardAPI, deleteCardApi } from '~/apis/index.js';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import { socketInstance } from '~/main';
import { useConfirm } from 'material-ui-confirm';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {fetchCardDetail} from '~/redux/CardActivity/cardActiveSlice'
import {fetchAllcomment} from '~/redux/CommentCard/commentCardSlice'
function Card({ card }) {
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);
  const confirm = useConfirm();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [titleValue, setTitleValue] = useState(card?.title || '');

  const showCardActions = () =>
    !!card?.memberIds?.length ||
    !!card?.conmemnts?.length ||
    !!card?.attachments?.length;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id, data: { ...card } });

  const dndKitCardStyles = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #32e33b' : undefined,
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

    try {
      const response = await updateCardAPI(card._id, titleValue.trim());
      if (response.status === 200) {
        toast.success('Update card title successfully');
        const newboard = cloneDeep(board);
        for (const column of newboard.columns) {
          const cardToupdate = column.cards.find((c) => c._id === card._id);
          if (cardToupdate) {
            cardToupdate.title = titleValue.trim();
            break;
          }
        }
        dispatch(updateCurrentActiveBoard(newboard));
        const updatedColumn = newboard.columns.find((column) =>
          column.cards.some((boardCard) => boardCard._id === card._id)
        );
        if (updatedColumn) {
          socketInstance.emit('FE_BOARD_ORDER_UPDATED', {
            boardId: board._id,
            columnOrderIds: newboard.columnOrderIds,
            columns: [updatedColumn],
          });
        }
      }
    } catch (error) {
      toast.error('Failed to update card title. Please try again.');
      setTitleValue(card.title);
    }

    setEditMode(false);
  };

  const handleDelete = async () => {
    handleCloseMenu();
    try {
      const { confirmed } = await confirm({
        title: 'Are you sure you want to delete this card?',
        description: 'This action cannot be undone.',
        confirmationText: 'Delete',
        cancellationText: 'Cancel',
      });

      if (!confirmed) return;

      const response = await deleteCardApi(card._id);
      if (response.status !== 204) return;

      const newboard = cloneDeep(board);
      const deletedFromColumn = newboard.columns.find((column) =>
        column.cards.some((boardCard) => boardCard._id === card._id)
      );
      if (!deletedFromColumn) return;

      deletedFromColumn.cards = deletedFromColumn.cards.filter(
        (boardCard) => boardCard._id !== card._id
      );
      deletedFromColumn.cardOrderIds = deletedFromColumn.cardOrderIds.filter(
        (id) => id !== card._id
      );
      dispatch(updateCurrentActiveBoard(newboard));
      socketInstance.emit('FE_BOARD_ORDER_UPDATED', {
        boardId: board._id,
        columnOrderIds: newboard.columnOrderIds,
        columns: [deletedFromColumn],
      });
      toast.success('Delete card successfully');
    } catch (error) {
      if (error?.confirmed === false) return;
      toast.error('Delete card failed');
    }
  };
  const fetchCardActive= async () =>{
    try{

      const cardActive = await dispatch(fetchCardDetail(card._id)).unwrap()
      const commentCard = await dispatch(fetchAllcomment(card._id)).unwrap()
    }catch(error){
      throw error
    }
  }

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        position: 'relative',
        '&:hover': {
      cursor: 'pointer'
    }
        
      }}
      
      onClick={fetchCardActive}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}

      <CardContent sx={{ p: 1.5, pb: '8px !important' }}>
        <Collapse in={!editMode} timeout={150} unmountOnExit>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ flexGrow: 1 }}>{card?.title}</Typography>
            <Tooltip title="Delete card">
              <IconButton
                size="small"
                aria-label="Delete card"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDelete();
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
         
          </Box>
        </Collapse>

      </CardContent>

    </MuiCard>
  );
}

export default Card;
