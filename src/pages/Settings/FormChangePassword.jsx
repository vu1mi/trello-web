import { useForm } from "react-hook-form";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";
import { ROLE_REGEX_PASSWORD, ROLE_ERRORS_PASSWORD } from "~/utils/validation";
import { useSelector , useDispatch } from 'react-redux';
import { selectUserData } from '~/redux/user/userSlice';
import { fetchUserDataByTokenAPI } from '~/redux/user/userSlice';
import {toast} from 'react-toastify';

export default function PasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    const payload = {
      password: data.password,
      newPassword: data.newPassword,
    };
   toast.promise(dispatch(fetchUserDataByTokenAPI(payload)).unwrap(), {
      pending: 'Updating password...',
      success: 'Password updated successfully!',
      error: 'Failed to update password. Please try again.',
    }).then(() => {
      
    }).catch((err) => {
      console.error('Update password error:', err);
    });

    console.log("Password data:", data);
  };

  const newPassword = watch("newPassword");

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Typography variant="h6" mb={2}>
        Đổi mật khẩu
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Mật khẩu hiện tại"
          type="password"
          {...register("password", {
            required: "Nhập mật khẩu hiện tại",
            pattern: {
              value: ROLE_REGEX_PASSWORD,
              message: ROLE_ERRORS_PASSWORD,
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <TextField
          label="Mật khẩu mới"
          type="password"
          {...register("newPassword", {
            required: "Nhập mật khẩu mới",
            pattern: {
              value: ROLE_REGEX_PASSWORD,
              message: ROLE_ERRORS_PASSWORD,
            },
          })}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
        />

        <TextField
          label="Xác nhận mật khẩu"
          type="password"
          {...register("confirmPassword", {
            required: "Nhập lại mật khẩu",
            validate: (value) =>
              value === watch("newPassword") || "Mật khẩu không khớp",
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <Button type="submit" variant="contained">
          Cập nhật
        </Button>
      </Stack>
    </Box>
  );
}