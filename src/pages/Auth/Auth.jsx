import React, { useState, useEffect } from "react";
import { Grid, Paper, Tabs, Tab, Box, Typography } from "@mui/material";
import { useLocation, useNavigate , Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import {useSelector} from 'react-redux'
import { selectUserData } from "~/redux/user/userSlice";

const Auth = () => {
  const userData = useSelector(selectUserData);
  const [tab, setTab] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  console.log('userData', userData);
  if(userData) return <Navigate to="/" replace={true} />;
  useEffect(() => {
    // Sync tab with current pathname
    if (location.pathname && location.pathname.includes("/register")) setTab(1);
    else setTab(0);
  }, [location.pathname]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
      <Paper elevation={8} sx={{ width: "100%", overflow: "hidden", minHeight: "70vh", width:{ xs: "100%", md: 900 } }}>
        <Grid container justifyContent="center" sx={{ width: "100%" }}>
          <Grid item xs={12} md={6} sx={{ p: 4, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", mx: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Typography variant="h4" color="primary" fontWeight={700}>
                Trello Clone
              </Typography>
            </Box>
            <Box sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
              <Tabs centered value={tab} onChange={(e, v) => { if (v === 0) navigate('/login'); else navigate('/register'); }} aria-label="auth tabs">
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>

              <Box sx={{ mt: 2 }}>{tab === 0 ? <Login onSwitch={() => navigate('/register')} /> : <Register onSwitch={() => navigate('/login')} />}</Box>
            </Box>
          </Grid>

          {/* <Grid item  md={6} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", justifyContent: "center", p: 4, backgroundColor: "primary.main", color: "#fff" }}>
            <Box sx={{ textAlign: "center", px: 4 }}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Welcome Back
              </Typography>
              <Typography>Organize your work and life with boards, lists, and cards.</Typography>
            </Box>
          </Grid> */}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Auth;
