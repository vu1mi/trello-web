// components/BoardCard.jsx
import { Card, CardContent, Typography, Box, Link } from "@mui/material";
import { Link as RouterLink  } from "react-router-dom";
import {
  fetchBoardDetailAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function BoardCard({ title, description, color ,id}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("Rendering BoardCard with props:", { title, description, color, id });

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, cursor: "pointer", width:'100%', 
    background: (theme) => {
      return theme.palette.mode === 'dark' ? '#11263a' : '#fff';
    } }}>
      {/* Thanh màu */}
      <Box
        sx={{
          height: 50,
          backgroundColor:  color,
        }}
      />

      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap>
          {description}
        </Typography>

        <Link  component={RouterLink} href={`/boards/${id}`} underline="hover" sx={{ fontSize: 14 }}>
          Go to board →
        </Link>
      </CardContent>
    </Card>
  );
}