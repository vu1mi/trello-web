
import Button from "@mui/material/Button";
import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { Tooltip, Typography, Collapse } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Card({ card }) {
  const showCard = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.conmemnts?.length ||
      !!card?.attachments?.length
    );
  };
const { attributes, listeners, setNodeRef, transform, transition , isDragging } =
    useSortable({ id: card._id, data: { ...card } });
  const dndKitCardStyles = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border : isDragging ? "1px solid #32e33b" : undefined,
  };
  // console.log(showCard());

  return (
    <MuiCard ref={setNodeRef} style={dndKitCardStyles}
    {...attributes} {...listeners} sx={{ boxShadow: "0 1px 1px rgba(0,0,0,0.2)", overflow: "unset" }}>
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}

      <CardContent sx={{ p: 1.5 }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      {showCard() && (
        <CardActions sx={{ p: "0 4px 8px 4px" }}>
          {!!card?.memberIds?.length && (
            <Button size="small" startIcon={<GroupIcon />}>
              {card?.memberIds?.length}
            </Button>
          )}
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
    </MuiCard>
  );
}

export default Card;
