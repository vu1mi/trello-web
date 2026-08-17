import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FieldErrorAlert from '../../components/Form/FileErrorAlet';
import {
  ROLE_ERRORS_EMAIL,
  ROLE_ERRORS_PASSWORD,
  ROLE_MESSAGES,
  ROLE_REGEX_EMAIL,
  ROLE_REGEX_PASSWORD,
} from '../../utils/validation';
import {fetchOtpForgotPassword, checkOtpForgotPassword, resetPasswordAPI} from '../../apis/index';

const OTP_DURATION_SECONDS = 300;

const ResetPassWord = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  // const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [otpExpiryAt, setOtpExpiryAt] = useState(null);
  const [otpCountdown, setOtpCountdown] = useState(OTP_DURATION_SECONDS);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const otpRefs = useRef([]);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    reset: resetEmail,
    formState: { errors: emailErrors },
  } = useForm({
    defaultValues: { email: '' },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const currentStepLabel = useMemo(() => {
    if (step === 0) return 'Nhận mã OTP';
    if (step === 1) return 'Xác minh OTP';
    return 'Đặt lại mật khẩu';
  }, [step]);

  useEffect(() => {
    if (step !== 1 || !otpExpiryAt) return;

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((otpExpiryAt - Date.now()) / 1000));
      setOtpCountdown(remaining);

      if (remaining <= 0) {
        setOtpDigits(Array(6).fill(''));
      }
    };

    updateCountdown();
    const timerId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timerId);
  }, [step, otpExpiryAt]);

  const handleSendOtp = async (data) => {
    try {
      const result = await fetchOtpForgotPassword(data.email);
      // setGeneratedOtp(result?.otp || '');
      setUserEmail(data.email);
      setOtpDigits(Array(6).fill(''));
      setOtpExpiryAt(Date.now() + OTP_DURATION_SECONDS * 1000);
      setOtpCountdown(OTP_DURATION_SECONDS);
      setStep(1);
      resetPassword();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể gửi mã OTP.');
    }
  };

  const handleOtpDigitChange = (index, value) => {
    const sanitizedValue = value.replace(/\D/g, '').slice(-1);

    setOtpDigits((prevDigits) => {
      const nextDigits = [...prevDigits];
      nextDigits[index] = sanitizedValue;
      return nextDigits;
    });

    if (sanitizedValue && index < otpDigits.length - 1) {
      requestAnimationFrame(() => {
        otpRefs.current[index + 1]?.focus();
      });
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      if (otpDigits[index]) {
        event.preventDefault();
        setOtpDigits((prevDigits) => {
          const nextDigits = [...prevDigits];
          nextDigits[index] = '';
          return nextDigits;
        });
        return;
      }

      if (index > 0) {
        event.preventDefault();
        otpRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      setOtpDigits((prevDigits) => {
        const nextDigits = [...prevDigits];
        nextDigits[index] = '';
        return nextDigits;
      });
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index < otpDigits.length - 1) {
      event.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (index, event) => {
    event.preventDefault();
    const pastedText = (event.clipboardData.getData('text') || '').replace(/\D/g, '');

    if (!pastedText) return;

    const digitsToFill = pastedText.slice(0, otpDigits.length - index).split('');

    setOtpDigits((prevDigits) => {
      const nextDigits = [...prevDigits];
      digitsToFill.forEach((digit, offset) => {
        const targetIndex = index + offset;
        if (targetIndex < nextDigits.length) {
          nextDigits[targetIndex] = digit;
        }
      });
      return nextDigits;
    });

    const nextIndex = Math.min(index + digitsToFill.length, otpDigits.length - 1);
    requestAnimationFrame(() => {
      otpRefs.current[nextIndex]?.focus();
    });
  };

  const handleResendOtp = async () => {
    try {
      await fetchOtpForgotPassword(userEmail);
      setOtpDigits(Array(6).fill(''));
      setOtpExpiryAt(Date.now() + OTP_DURATION_SECONDS * 1000);
      setOtpCountdown(OTP_DURATION_SECONDS);
      toast.success('Mã OTP mới đã được gửi tới email của bạn.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể gửi mã OTP mới.');
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    const otpCode = otpDigits.join('');

    if (otpCode.length !== 6) {
      toast.error('Vui lòng nhập đủ 6 chữ số.');
      return;
    }

    if (otpCountdown <= 0) {
      toast.error('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
      setStep(0);
      return;
    }

    try {
      await checkOtpForgotPassword(userEmail, otpCode);
      toast.success('Xác minh OTP thành công.');
      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Mã OTP không chính xác.');
    }
  };

  const handleSaveNewPassword = async (data) => {
    try {
      await resetPasswordAPI(userEmail, data.newPassword);
      toast.success('Mật khẩu đã được cập nhật thành công.');
      resetEmail();
      setOtpDigits(Array(6).fill(''));
      setUserEmail('');
      setOtpExpiryAt(null);
      setOtpCountdown(OTP_DURATION_SECONDS);
      resetPassword();
      setStep(0);
      navigate('/login');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật mật khẩu.');
    }
  };

  const handleCancel = () => {
    resetEmail();
    setOtpDigits(Array(6).fill(''));
    setUserEmail('');
    setOtpExpiryAt(null);
    setOtpCountdown(OTP_DURATION_SECONDS);
    resetPassword();
    setStep(0);
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background:
          'linear-gradient(135deg, rgba(25, 118, 210, 0.08), rgba(25, 118, 210, 0.2))',
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 500, borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Quên mật khẩu
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Bước {step + 1}: {currentStepLabel}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {step === 0 && (
            <Box component="form" onSubmit={handleEmailSubmit(handleSendOtp)}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Nhập email để nhận mã xác minh OTP.
              </Alert>

              <TextField
                fullWidth
                label="Email"
                margin="normal"
                error={!!emailErrors.email}
                {...registerEmail('email', {
                  required: ROLE_MESSAGES,
                  pattern: {
                    value: ROLE_REGEX_EMAIL,
                    message: ROLE_ERRORS_EMAIL,
                  },
                })}
              />
              <FieldErrorAlert errors={emailErrors} fieldName="email" />

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Nhận mã OTP
              </Button>
            </Box>
          )}

          {step === 1 && (
            <Box component="form" onSubmit={handleVerifyOtp}>
              <Alert severity={otpCountdown <= 0 ? 'warning' : 'info'} sx={{ mb: 2 }}>
                {otpCountdown <= 0
                  ? 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.'
                  : `Mã OTP đã được gửi tới ${userEmail}.`}
              </Alert>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mb: 2,
                  color: otpCountdown <= 30 ? 'error.main' : 'text.secondary',
                  fontWeight: 700,
                }}
              >
                {otpCountdown <= 0
                  ? 'Đã hết thời gian'
                  : `Mã sẽ hết hạn trong ${Math.floor(otpCountdown / 60)}:${String(
                      otpCountdown % 60,
                    ).padStart(2, '0')}`}
              </Typography>

                
            

              <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 2 }}>
                {otpDigits.map((digit, index) => (
                  <TextField
                    key={index}
                    value={digit}
                    inputRef={(element) => {
                      otpRefs.current[index] = element;
                    }}
                    onFocus={(event) => event.target.select()}
                    onChange={(event) => handleOtpDigitChange(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={(event) => handleOtpPaste(index, event)}
                    inputProps={{
                      maxLength: 1,
                      inputMode: 'numeric',
                      style: {
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        padding: 0,
                      },
                    }}
                    sx={{
                      width: 48,
                      '& .MuiInputBase-root': {
                        height: 56,
                        borderRadius: 2,
                      },
                    }}
                  />
                ))}
              </Stack>

              {otpCountdown <= 0 && (
                <Button
                  type="button"
                  variant="contained"
                  fullWidth
                  onClick={handleResendOtp}
                  sx={{ mb: 2, backgroundColor: '#ff9800' }}
                >
                  Lấy mã OTP mới
                </Button>
              )}

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button type="button" variant="outlined" fullWidth onClick={() => setStep(0)}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" fullWidth disabled={otpCountdown <= 0}>
                  Xác minh OTP
                </Button>
              </Stack>
            </Box>
          )}

          {step === 2 && (
            <Box component="form" onSubmit={handlePasswordSubmit(handleSaveNewPassword)}>
              <Alert severity="success" sx={{ mb: 2 }}>
                OTP hợp lệ. Hãy nhập mật khẩu mới.
              </Alert>

              <TextField
                fullWidth
                label="Mật khẩu mới"
                type={showNewPassword ? 'text' : 'password'}
                margin="normal"
                error={!!passwordErrors.newPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...registerPassword('newPassword', {
                  required: ROLE_MESSAGES,
                  pattern: {
                    value: ROLE_REGEX_PASSWORD,
                    message: ROLE_ERRORS_PASSWORD,
                  },
                })}
              />
              <FieldErrorAlert errors={passwordErrors} fieldName="newPassword" />

              <TextField
                fullWidth
                label="Nhập lại mật khẩu mới"
                type={showConfirmPassword ? 'text' : 'password'}
                margin="normal"
                error={!!passwordErrors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...registerPassword('confirmPassword', {
                  required: ROLE_MESSAGES,
                  validate: (value) =>
                    value === watchPassword('newPassword') || 'Mật khẩu không khớp.',
                })}
              />
              <FieldErrorAlert errors={passwordErrors} fieldName="confirmPassword" />

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button type="button" variant="outlined" fullWidth onClick={() => setStep(1)}>
                  Quay lại
                </Button>
                <Button type="submit" variant="contained" fullWidth>
                  Lưu mật khẩu mới
                </Button>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassWord;
