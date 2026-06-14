import React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import {useSelector , useDispatch} from 'react-redux';
import {selectUserData ,logout} from '~/redux/user/userSlice';
import { useConfirm } from 'material-ui-confirm'

function Starred() {
  const userData = useSelector(selectUserData);
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout =  async () => {
      const {confirmed} = await  confirm({
      title: "Confirm Logout",
      message: "Are you sure you want to logout?",
      confirmationText: "Logout",
      cancellationText: "Cancel",
    });
    if(confirmed) {
      dispatch(logout());
    }
  
   
  };
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 0 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}
                  src={userData?.avatar || undefined}>
            {userData?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-starred"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button-starred",
          },
        }}
      >
        <MenuItem onClick={handleClose} sx={{'&:hover': {color: "success.light"}}}>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> Profile
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> My account
        </MenuItem> */}
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{'&:hover': {color: "red"} ,
                                              '&:hover .logout-item': {color: "red"}
        }}>
          <ListItemIcon>
            <Logout fontSize="small" className="logout-item" />
          </ListItemIcon >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Starred;
