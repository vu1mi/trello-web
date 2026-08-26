import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import authorizeAxios from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';
import { toast } from 'react-toastify';

const initialState = {
  userData: null,
};

export const fetchUserDataAPI = createAsyncThunk(
  'user/fetchUserData',
  async (userInfo, { rejectWithValue }) => {
    try {
      const response = await authorizeAxios.post(
        `${API_ROOT}/v1/user/login`,
        userInfo
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message || error.message,
        code: error.code,
      });
    }
  }
);
export const updateUserDataByTokenAPI = createAsyncThunk(
  'user/fetchUserDataByToken',
  async (data) => {
    const response = await authorizeAxios.patch(`${API_ROOT}/v1/user/profile`, data);
    return response.data;
  }
);
export const logout = createAsyncThunk('user/logout', async () => {
  const response = await authorizeAxios.delete(`${API_ROOT}/v1/user/logout`);
  if(toast){
    toast.success('Logout successful');
  }
  return response.data;
});

// khởi tạo 1 clice trong kho lưu trữ
export const userSlice = createSlice({
  name: 'user',
  //   khởi tạo giá trị ban đầu của sllice
  initialState,
  // xử li dữ liệu đồng bộ
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserDataAPI.fulfilled, (state, action) => {
      const userData = action.payload;
      state.userData = userData;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.userData = null;
    });
    builder.addCase(updateUserDataByTokenAPI.fulfilled, (state, action) => {
      const userData = action.payload;
      state.userData = userData;
    });
  },
});

// actions la noi danh cho cac component ben duoi goi bang distpatch de thay doi state
// nhung action duoc redux tao tu dong theo ten reducer va duoc export ra de su dung o cac component khac
// export const {} = userSlice.actions;

// selector dung de lay du lieu tu state, o day la lay userData tu state.user
export const selectUserData = (state) => state.user.userData;

export const userReducer = userSlice.reducer;
