import { Card as MuiCard } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
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
import { useConfirm } from 'material-ui-confirm';
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
      }
    } catch (error) {
      toast.error('Failed to update card title. Please try again.');
      setTitleValue(card.title);
    }

    setEditMode(false);
  };

  const handleDelete = async () => {
    handleCloseMenu();
    const consfirmed = await confirm({
      title: 'Are you sure you want to delete this card?',
      description: 'This action cannot be undone.',
      confirmationText: 'Delete',
      cancellationText: 'Cancel',
    });

    if (!consfirmed) return;
    const response = await deleteCardApi(card._id);
    if (response.status === 204) {
      toast.success('Delete card successfully');
    }
    const newboard = cloneDeep(board);
    for (const column of newboard.columns) {
      if (column.cards.some((c) => c._id === card._id)) {
        column.cards = column.cards.filter((c) => c._id !== card._id);
        column.cardOrderIds = column.cardOrderIds.filter(
          (id) => id !== card._id
        );
        break;
      }
    }
    dispatch(updateCurrentActiveBoard(newboard));
  };
  const fetchCardActive= async () =>{
    try{

      const cardActive = await dispatch(fetchCardDetail(card._id))
      const commentCard = await dispatch(fetchAllcomment(card._id))
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
         
          </Box>
        </Collapse>

      </CardContent>

    </MuiCard>
  );
}

export default Card;
