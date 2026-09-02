import { Box } from "@mui/material"
import { useState } from "react"
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentActiveBoard } from '../../redux/activeBoard/activeBoardSlice'

export const GroupUserAvatar = () => {
  const boardData = useSelector(selectCurrentActiveBoard)
  // const boardusers = new Array(16).fill(null);
  const limit = 4;
  const [showAll, setShowAll] = useState(false);
  const isOpenpopover = Boolean(showAll);
  const popoverId = isOpenpopover ? 'simple-popover' : undefined;
  const handleTogglePopover = (even) => {
    if (!showAll) {
      setShowAll(even.currentTarget);
    } else {
      setShowAll(null);
    }
  }
  return (
    <Box
      sx={{
        display: 'flex',

      }}
    >
      {boardData?.Fe_allUser.slice(0, limit).map((user, index) => {
        return (
          <Tooltip title={user.displayName} key={index}>
            <Avatar
              alt="Remy Sharp"
              src={user?.avatar}
              sx={{ border: 'none' }}
            />
          </Tooltip>)
      }
      )}

      {boardData?.Fe_allUser.length > limit && (
        <Tooltip title="Show more users" onClick={handleTogglePopover}>
          <Avatar>
            +{boardData?.Fe_allUser.length - limit}
          </Avatar>
        </Tooltip>
      )}

      <Popover
        id={popoverId}
        open={isOpenpopover}
        anchorEl={showAll}
        onClose={handleTogglePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            width: 300,
            maxHeight: 400,
            overflowY: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            p: 1,
            gap: 1,
          },
        }}
      >
        {boardData?.Fe_allUser.map((user, index) => {
          return (
            <Tooltip title="Notifigation" key={index}>
              <Avatar
                alt="Remy Sharp"
                src={user?.avatar}
                sx={{ border: 'none' }}
              />
            </Tooltip>)
        }
        )}

      </Popover>

    </Box>
  );
};
