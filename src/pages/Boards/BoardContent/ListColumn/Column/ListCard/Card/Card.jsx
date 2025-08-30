import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import AttachmentIcon from "@mui/icons-material/Attachment";

function Card() {
  return (
    <MuiCard sx={{ boxShadow: "0 1px 1px rgba(0,0,0,0.2)", overflow: "unset" }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://statictuoitre.mediacdn.vn/thumb_w/640/2017/7-1512755474943.jpg"
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5 }}>
        <Typography>Vu1missss</Typography>
      </CardContent>
      <CardActions sx={{ p: "0 4px 8px 4px" }}>
        <Button size="small" startIcon={<GroupIcon />}>
          20
        </Button>
        <Button size="small" startIcon={<ChatBubbleIcon />}>
          15
        </Button>
        <Button size="small" startIcon={<AttachmentIcon />}>
          10
        </Button>
      </CardActions>
    </MuiCard>
  );
}

export default Card;
