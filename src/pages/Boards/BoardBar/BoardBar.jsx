import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SyncLockIcon from '@mui/icons-material/SyncLock';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { capitalizeFirstLetter } from '~/utils/formatter';
import {GroupUserAvatar} from '../../../components/Boards/UerGroupAvatar';
import {FormInvite} from '../../../components/Boards/FormInvite'

const StyleChip = {
  borderRadius: '5px',
  border: 'none',
  paddingX: '5px',
  backgroundColor: 'transparent',
  '.MuiSvgIcon-root': {
    color: 'white',
  },
  '&:hover': {
    backgroundColor: 'primary.50',
  },
  color: 'white',
};

function BoardBar({ board }) {
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [email, setEmail] = useState('');

  const handleOpenInviteModal = () => setOpenInviteModal(true);
  const handleCloseInviteModal = () => {
    setOpenInviteModal(false);
    setEmail('');
  };

  const handleInvite = () => {
    if (!email.trim()) return;
    console.log('Invite email:', email);
    handleCloseInviteModal();
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: (theme) => theme.trelloCustom.boardBarHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          overflowX: 'auto',
          borderBottom: '1px solid #fff',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',

          padding: '0px 16px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<DashboardIcon />}
            label={board?.title}
            sx={StyleChip}
            clickable
          />
          <Chip
            icon={<CloudUploadIcon />}
            label={capitalizeFirstLetter(board?.type)}
            sx={StyleChip}
            clickable
          />
          <Chip
            icon={<SyncLockIcon />}
            label="Public/Private Workspace"
            sx={StyleChip}
            clickable
          />
          <Chip
            icon={<BoltIcon />}
            label="Automations"
            clickable
            sx={StyleChip}
          />
          <Chip
            icon={<FilterListIcon />}
            label="Filter"
            clickable
            sx={StyleChip}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
       
          <FormInvite/>
         
          <GroupUserAvatar  />
        </Box>
      </Box>

  
    </>
  );
}

export default BoardBar;
