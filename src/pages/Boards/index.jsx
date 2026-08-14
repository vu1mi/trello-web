// pages/BoardsPage.jsx
import { Box, Typography } from "@mui/material";
import BoardList from "../../components/Boards/BoardList";
import {useState, useEffect} from "react";
import { PAGE_DEFAULT_LIMIT, PAGE_DEFAULT_PAGE } from "../../utils/constants";
import {CreateBoardModal} from "../../components/Boards/FormCreateBoard";
import { 
  Link, 
  useLocation 
} from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import {getAllBoardsAPI,createBoardAPI} from "../../apis/index";
import AppBar from "../../components/AppBar/AppBar";
import {   List, ListItemButton, ListItemText } from "@mui/material";
import theme from "../../theme";
import { toast } from "react-toastify";


export default function BoardsPage() {
    const [page, setPage] = useState(PAGE_DEFAULT_PAGE);
    const [boards, setBoards] = useState([]);
    const [totalBoards, setTotalBoards] = useState(100);
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const pageParam = parseInt(queryParams.get('page')) || PAGE_DEFAULT_PAGE;

    

      const handleCreateBoard = async (data) => {
       try {
        const newData = await createBoardAPI(data);
        console.log('Board created successfully:', newData);
        setOpen(false);
        // Refresh the board list after creating a new board
        const searchPath = `?page=${pageParam}&pageSize=${PAGE_DEFAULT_LIMIT}`;
         getAllBoardsAPI( searchPath).then(response => {
          console.log('Fetched boards:', response);
          setBoards(response.data);
            setTotalBoards(response.totalCount[0]?.count || 0);
        })
       toast.success('Board created successfully!');
       } catch (error) {
        console.error('Error creating board:', error);
       }
      }

    useEffect(() => {
     
        console.log('pageParam and query', pageParam, location.search);
        setPage(pageParam);
        const searchPath = `?page=${pageParam}&pageSize=${PAGE_DEFAULT_LIMIT}`;
        getAllBoardsAPI(searchPath)
        .then(response => {
          console.log('Fetched boards:', response);
          setBoards(response.data);
          setTotalBoards(response.totalCount[0]?.count || 0);
        })
        .catch(error => {
            console.error('Error fetching boards:', error);
        });
    }, [location.search]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar />

      <CreateBoardModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateBoard}
      />
      <Box sx={{ display: "flex" }}>
      
        <Box
          sx={{
            width: 220,
            height: `calc(100vh - ${theme.trelloCustom.appBarHeight})`,
            borderRight: "1px solid #ddd",
            p: 2,
            background: (theme) => {
              return theme.palette.mode === 'dark' ? '#313a43' : '#f5f5f5';
            }
          }}
        >
          <Typography variant="h6" mb={2}>
            Boards
          </Typography>

          <List>
            <ListItemButton>
              <ListItemText primary="Templates" />
            </ListItemButton>

            <ListItemButton>
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton onClick={() => setOpen(true)}>
              <ListItemText primary="Create a new board" />
            </ListItemButton>
          </List>
        </Box>

        <Box sx={{ flex: 1, p: 3,  background: (theme) => {
              return theme.palette.mode === 'dark' ? '#34495e' : '#f5f5f5';
            } }}>
          <Typography variant="h5" mb={2} >
            Your boards:
          </Typography>

          <BoardList boardsData={boards} />

          <Box mt={4} display="flex" justifyContent="center" position="fixed" bottom={20} left={0} right={0}>
            <Pagination
              count={Math.ceil(totalBoards / PAGE_DEFAULT_LIMIT)}
              page={page}
              color="primary"
              renderItem={(item) => (
                  <PaginationItem
                  component={Link}
                  to={`/boards${item.page === 1 ? '' : `?page=${item.page}`}`}
                  {...item}
                  />
              )}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}