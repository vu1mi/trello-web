import { Box } from "@mui/material"
import {useState} from "react"
import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

export const GroupUserAvatar = ({ boardusers  , limit = 8   }) => {
    const [showAll, setShowAll] = useState(false);
    const isOpenpopover = Boolean(showAll);
    const popoverId = isOpenpopover ? 'simple-popover' : undefined;
    const handleTogglePopover = (even) => {
        if (!showAll) {
            setShowAll(even.currentTarget);
        }else {
            setShowAll(null);
        }
    }
    return (
        <Box
            sx={{
              display: 'flex',
              gap: 4,
            }}
        >
        {boardusers.slice(0, limit).map((user, index) => {
            return (
            <Tooltip title="Notifigation" key={index}>
              <Avatar
                alt="Remy Sharp"
                src={user.avatar}
                sx={{ border: 'none' }}
              />
            </Tooltip>  )}
            )}

        {boardusers.length > limit && (
            <Tooltip title="Show more users">
              <Avatar>
                +{boardusers.length - limit}
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
                >
                <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
        </Popover>

        </Box>
    );
};
