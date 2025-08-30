import Box from "@mui/material/Box";
import ModeSelect from "~/components/ModeSelect/ModeSelect";
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
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
function AppBar() {
  const [searchVAlue, setSearchValue] = useState("");
  return (
    <>
      <Box
        px={2}
        sx={{
          width: "100%",
          height: (theme) => theme.trelloCustom.appBarHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          overflowX: "auto",
          backgroundColor: (theme) => {
            return theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0";
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AppsIcon sx={{ color: "#fff" }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <SvgIcon component={Trello} inheritViewBox sx={{ color: "#fff" }} />
            <Typography
              variant="span"
              sx={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#fff",
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
            <Button
              variant="outlined"
              sx={{ color: "#fff", borderColor: "#fff" }}
            >
              Create
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            id="outlined-search"
            label="Search field"
            type="text"
            size="small"
            value={searchVAlue}
            onChange={(e) => setSearchValue(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#fff" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <CloseIcon
                    fontSize="small"
                    sx={{
                      color: searchVAlue ? "white" : "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => setSearchValue("")}
                  />
                ),
              },
            }}
            sx={{
              minWidth: 120,
              "& label": { color: "#fff" },
              "& input": { color: "#fff" },
              "& label.Mui-focused": { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "white" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
            }}
          />
          <ModeSelect />
          <Tooltip title="Notifigation">
            <Badge
              color="warning"
              variant="dot"
              sx={{ cursor: "pointer", color: "#fff" }}
            >
              <NotificationsNoneIcon />
            </Badge>
          </Tooltip>
          <Tooltip title="Help">
            <Badge
              // color="secondary"
              variant="dot"
              sx={{ cursor: "pointer", color: "#fff" }}
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
