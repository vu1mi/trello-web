import { useState } from 'react';
import { Box, Paper } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUserData } from '~/redux/user/userSlice';
import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ProfileForm from "./Formprofile";
import PasswordForm from "./FormChangePassword";
import AppBar from '~/components/AppBar/AppBar';


const pathname = {
  profile: 'PROFILE',
  changePassword: 'CHANGE_PASSWORD',
};

export default function SettingsPage() {
  const location = useLocation();
  const currentPath = location.pathname;

  const pathToValueMap = () => {
    if (currentPath.includes('profile')) return pathname.profile;
    if (currentPath.includes('change-password')) return pathname.changePassword;
    return '1';
  };
  const [locationdefault, setLocationDefault] = useState(pathToValueMap());
  const userData = useSelector(selectUserData);

  const handleChange = (event, newValue) => {
    setLocationDefault(newValue);
  };
 

  return (
   <Box>
    <AppBar />
     {!userData && <Navigate to="/login" replace={true} />}
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: (theme) => {
            return theme.palette.mode === 'dark' ? '#34495e' : '#1565c0';
          },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
   
      <Paper
        sx={{
          width: '100%',
          maxWidth: 700,
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          background:  (theme) => {
            return theme.palette.mode === 'dark' ? '#1d3145' : '#fff';
          },
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            component="h1"
            sx={{
              fontSize: { xs: '24px', md: '32px' },
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
            }}
          >
            SETTING
          </Box>
          <Box
            sx={{
              height: 4,
              width: 60,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              mx: 'auto',
              borderRadius: 2,
            }}
          />
        </Box>

        <TabContext value={locationdefault}>
          <TabList
            onChange={handleChange}
            centered
            sx={{
              borderBottom: '2px solid #e0e0e0',
              '& .MuiTab-root': {
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 600,
                textTransform: 'none',
                color: 'text.secondary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color:  (theme) => {
                  return theme.palette.mode === 'dark' ? '#6d73f5' : '#667eea ';
                },
                },
              },
              '& .Mui-selected': {
                 color:  (theme) => {
                  return theme.palette.mode === 'dark' ? '#6d73f5' : '#667eea ';
                },
              },
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                height: 3,
                borderRadius: 2,
              },
            
            }}
          >
            <Tab
              label="Hồ sơ"
              value={pathname.profile}
              component={Link}
              to={'/settings/profile'}
            />
            <Tab
              label="Đổi mật khẩu"
              value={pathname.changePassword}
              component={Link}
              to={'/settings/change-password'}
            />
          </TabList>

          <TabPanel value={pathname.profile} sx={{ mt: 3 }}>
            <ProfileForm />
          </TabPanel>

          <TabPanel value={pathname.changePassword} sx={{ mt: 3 }}>
            <PasswordForm />
          </TabPanel>
        </TabContext>
      </Paper>
    </Box>
    </Box>
  );
}
