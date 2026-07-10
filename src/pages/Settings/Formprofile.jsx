import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";
import { useSelector } from 'react-redux';
import { selectUserData } from '~/redux/user/userSlice';
import { 
  ROLE_REGEX_EMAIL,
  ROLE_ERRORS_EMAIL,
  ROLE_REGEX_FULLNAME,
  ROLE_ERRORS_FULLNAME, } from "~/utils/validation";
  import { useDispatch } from "react-redux";
import { fetchUserDataByTokenAPI } from '~/redux/user/userSlice';
import { toast } from "react-toastify";
import { validateImage } from "~/utils/validation";

export default function ProfileForm() {
  const dispatch = useDispatch();
 
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
    const userData = useSelector(selectUserData);
    console.log('userData', userData);

  const [preview, setPreview] = useState(null);

  const setavt = (e) => {
    const file = e.target.files[0];
    const validationResult = validateImage(file);
    if (!validationResult.isValid) {
      toast.error(validationResult.message);
      return;
    }
     const formData = new FormData();
     formData.append('avatar', file);
      console.log('file', formData.get('avatar'));

       toast.promise(dispatch(fetchUserDataByTokenAPI(formData)).unwrap(), {
      pending: 'Updating profile...',
      success: 'Profile updated successfully!',
    }).then(() => {
      e.target.value = ''; // Reset the file input
    }).catch((err) => {
      console.error('Update profile error:', err);
    });

  }

  const onSubmit = (data) => {
    toast.promise(dispatch(fetchUserDataByTokenAPI(data)).unwrap(), {
      pending: 'Updating profile...',
      success: 'Profile updated successfully!',
      error: 'Failed to update profile. Please try again.',
    }).then(() => {
    }).catch((err) => {
      console.error('Update profile error:', err);
    });
    console.log("Profile data:", data);
  };

  // const handleAvatarChange = (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     setValue("avatar", file);
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };
  

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Typography variant="h6" mb={2}>
        Thông tin cá nhân
      </Typography>

      <Stack spacing={2} alignItems="center">
        <Avatar src={userData.avatar} sx={{ width: 80, height: 80 }} />

        <Button variant="outlined" component="label" onChange={setavt}>
          Upload avatar
          <input hidden type="file" onChange={setavt} />
        </Button>

        <TextField
          label="Username"
          fullWidth
          // onChange={(e) => setValue("name", e.target.value)}
          defaultValue={userData?.user?.username || ''}
          InputLabelProps={{ shrink: true }}
          {...register("username", {
            required: "Nhập tên",
            pattern: {
              value: ROLE_REGEX_FULLNAME,
              message: ROLE_ERRORS_FULLNAME,
            },
          })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          label="Email"
          fullWidth
          value={userData?.user?.email || ''}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled
        />

        <Button type="submit" variant="contained">
          Lưu
        </Button>
      </Stack>
    </Box>
  );
}