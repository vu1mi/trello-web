import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import {
  ROLE_MESSAGES,
  ROLE_REGEX_EMAIL,
  ROLE_ERRORS_EMAIL,
  ROLE_REGEX_PASSWORD,
  ROLE_ERRORS_PASSWORD,
} from '../../utils/validation';
import FieldErrorAlert from '../../components/Form/FileErrorAlet';
import { useSearchParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDataAPI } from '../../redux/user/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = ({ onSwitch = () => {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [blockedSeconds, setBlockedSeconds] = useState(0);
  // const userData = useSelector((state) => state.user.userData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [searchParams] = useSearchParams();
  const verifiedEmail = searchParams.get('verifiedEmail');
  const registeredEmail = searchParams.get('registeredEmail');
  useEffect(() => {
    if (blockedSeconds <= 0) return undefined;

    const timerId = window.setInterval(() => {
      setBlockedSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [blockedSeconds]);

  const formattedBlockedTime = `${String(Math.floor(blockedSeconds / 60)).padStart(2, '0')}:${String(blockedSeconds % 60).padStart(2, '0')}`;

  const onSubmit = (data) => {
    if (blockedSeconds > 0) return;

    toast
      .promise(dispatch(fetchUserDataAPI(data)).unwrap(), {
        pending: 'Logging in...',
        success: 'Login successful!',
        error: 'Login failed. Please check your credentials and try again.',
      })
      .then((res) => {
        if (!res.error) navigate('/');
      })
      .catch((err) => {
        console.log('Login error:', err);
            if (err?.status === 429) {
          setBlockedSeconds(120);
        }
        console.error('Login error:', err);
      });
    console.log('Login form data:', data);
  };


  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: '100%',
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <Box sx={{ mt: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
        </Box>

        <Typography variant="h5" align="center" gutterBottom>
          Sign in
        </Typography>
        <Stack sx={{ width: '100%' }} spacing={2}>
          {blockedSeconds > 0 && (
            <Alert variant="outlined" severity="warning">
              Tạm thời không thể đăng nhập. Vui lòng thử lại sau {formattedBlockedTime}.
            </Alert>
          )}
          {verifiedEmail && (
            <Alert variant="outlined" severity="success">
              Email {verifiedEmail} has been successfully verified. Please log
              in to your account.
            </Alert>
          )}
          {registeredEmail && (
            <Alert variant="outlined" severity="info">
              Account registered successfully with email {registeredEmail}.
              Please check your email to verify your account before logging in.
            </Alert>
          )}
        </Stack>

        <TextField
          // required
          fullWidth
          label="Email"
          margin="normal"
          error={!!errors.email}
          {...register('email', {
            required: ROLE_MESSAGES,
            pattern: {
              value: ROLE_REGEX_EMAIL,
              message: ROLE_ERRORS_EMAIL,
            },
          })}
        />
        <FieldErrorAlert errors={errors} fieldName="email" />

        <TextField
          // required
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          error={!!errors.password}
          {...register('password', {
            required: ROLE_MESSAGES,
            pattern: {
              value: ROLE_REGEX_PASSWORD,
              message: ROLE_ERRORS_PASSWORD,
            },
          })}
        />
        <FieldErrorAlert errors={errors} fieldName="password" />

        {/* <FormControlLabel control={<Checkbox />} label="Remember me" /> */}

        <Typography>
          <Link
            component="button"
            type="button"
            onClick={() => navigate('/reset-password')}
          >
            Forgot password?
          </Link>
        </Typography>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          className="interceptor-loading"
          disabled={blockedSeconds > 0}
        >
          {blockedSeconds > 0 ? `Try again in ${formattedBlockedTime}` : 'Sign In'}
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link component="button" onClick={onSwitch}>
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
