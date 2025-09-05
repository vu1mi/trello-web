import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { capitalizeFirstLetter } from "~/utils/formatter";
const StyleChip = {
  borderRadius: "5px",
  border: "none",
  paddingX: "5px",
  backgroundColor: "transparent",
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    backgroundColor: "primary.50",
  },
  color: "white",
};

function BoardBar({ board }) {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: (theme) => theme.trelloCustom.boardBarHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          overflowX: "auto",
          borderBottom: "1px solid #fff",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",

          padding: "0px 16px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            sx={{
              color: "white",
              borderColor: "white",
            }}
          >
            Invite
          </Button>
          <AvatarGroup
            max={4}
            sx={{
              "& .MuiAvatar-root": {
                width: 34,
                height: 34,
                border: "none",
                color: "white",
                backgroundColor: "#a4b0be",
              },
              gap: 1,
            }}
          >
            <Tooltip title="Notifigation">
              <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                sx={{ border: "none" }}
              />
            </Tooltip>
            <Tooltip title="Notifigation">
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            </Tooltip>
            <Tooltip title="Notifigation">
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            </Tooltip>
            <Tooltip title="Notifigation">
              <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
            </Tooltip>
            <Tooltip title="Notifigation">
              <Avatar
                alt="Trevor Henderson"
                src="/static/images/avatar/5.jpg"
              />
            </Tooltip>
          </AvatarGroup>
        </Box>
      </Box>
    </>
  );
}

export default BoardBar;
