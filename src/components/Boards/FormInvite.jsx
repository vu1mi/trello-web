import { Box,Button,TextField  } from "@mui/material"
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from "react";
import {invitationBoard} from '../../apis/index'
import { useSelector } from "react-redux";
import {selectCurrentActiveBoard} from "~/redux/activeBoard/activeBoardSlice"
import { toast } from "react-toastify";
import {socketInstance} from '~/main'



export const FormInvite = ()=>{
    const board = useSelector(selectCurrentActiveBoard)
    const [email , setEmail] = useState()
    const [anchorEl, setAnchorEl] = useState()


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);

    };

    const handleClose = () => {
        setEmail(null)
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handlerInvite = async ()=>{
       const data ={
            boardId: board._id,
            inviteeEmail:email

        }
        const result = await invitationBoard(data).then( invitation =>{
            toast.success('Send invite success')
            setEmail(null)
            setAnchorEl(null);
            console.log(email)
            socketInstance.emit('FE_USER_INVITED_TO_BOARD', invitation)
        })
       
    }

    return (
        <Box>
            <Button
                aria-describedby={id}  
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={handleClick}
                sx={{
                color: 'white',
                borderColor: 'white',
                }}
               
          >
            Invite
          </Button>
            <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            sx={{p:2}}
            fullWidth
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',   // 👈 lấy điểm phải của button
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',   // 👈 menu cũng lấy điểm phải
            }}
             PaperProps={{
                sx: {
                width: 300,        // 👈 set độ rộng
                maxWidth: 'none',  // 👈 bỏ giới hạn mặc định
                p: 2,
                mt:1
                },
            }}
            >
            <Box sx={{ fontWeight: 600 }}>Invite member</Box>
            <Box>
            <TextField
                autoFocus
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
            />
            </Box>
            <Box sx={{  pb: 2 , display:'flex', gap:2}}>
            <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                color: '#f06292',
                borderColor: '#f8bbd0',
                '&:hover': {
                    borderColor: '#f48fb1',
                    backgroundColor: '#fff5f7',
                },
                ml:'auto'
                }}
            >
                Cancel
            </Button>
            <Button
                onClick={handlerInvite}
                variant="contained"
                sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                    backgroundColor: '#1565c0',
                },
                }}
            >
                Invite
            </Button>
            </Box>
             </Popover>
        </Box>
    )
}