import Box from "@mui/material/Box";
import ModeSelect from "~/components/ModeSelect";
import AppsIcon from "@mui/icons-material/Apps";
import { ReactComponent as Trello } from "~/assets/trello.svg";
import SvgIcon from "@mui/material/SvgIcon";
import { Typography } from "@mui/material";
import Workspace from "./Menus/Workspace";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Template from "./Menus/Templates";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Profiles from "./Menus/Profiles";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

function AppBar() {
  return (
    <>
      <Box
        px={2}
        sx={{
          width: "100%",
          height: (theme) => theme.trelloCustom.appBarHeight,
          backgroundColor: "secondary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          overflowX: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AppsIcon sx={{ color: "primary.main" }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <SvgIcon
              component={Trello}
              inheritViewBox
              sx={{ color: "primary.main" }}
            />
            <Typography
              variant="span"
              sx={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              Trello
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <Workspace />
            <Recent />
            <Starred />
            <Template />
            <Button variant="outlined">Create</Button>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            id="outlined-search"
            label="Search field"
            type="search"
            size="small"
            sx={{ minWidth: 120 }}
          />
          <ModeSelect />
          <Tooltip title="Notifigation">
            <Badge
              color="third"
              variant="dot"
              sx={{ cursor: "pointer", color: "primary.main" }}
            >
              <NotificationsNoneIcon />
            </Badge>
          </Tooltip>
          <Tooltip title="Help">
            <Badge
              color="secondary"
              variant="dot"
              sx={{ cursor: "pointer", color: "primary.main" }}
            >
              <HelpOutlineIcon />
            </Badge>
          </Tooltip>
          <Profiles />
        </Box>
      </Box>
    </>
  );
}

export default AppBar;
