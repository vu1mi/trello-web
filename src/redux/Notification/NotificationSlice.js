import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizeAxios from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';

const initialState = {
  notificationData: null,
};

export const fetchAllNotification = createAsyncThunk(
  'Notification/fetchAllNotifi',
  async () => {
    const response = await authorizeAxios.get(
      `${API_ROOT}/v1/invitation/board`,
    
    );
    console.log(response.data)
    return response.data;
  }
);

export const updateNotification = createAsyncThunk(
  'Notification/updateNotification',
  async ({data,id}) => {
    console.log('redux' , id)
    const response = await authorizeAxios.patch(
      `${API_ROOT}/v1/invitation/${id}`,
    data
    );
    console.log(response.data)
    return response.data;
  }
)

// khởi tạo 1 clice trong kho lưu trữ
export const notificationSlice = createSlice({
  name: 'notification',
  //   khởi tạo giá trị ban đầu của sllice
  initialState,
  // xử li dữ liệu đồng bộ
  reducers: {
    addNotification:(state, action) => {
      const newInvitation = action.payload;
      if (Array.isArray(state.notificationData)) {
        state.notificationData.unshift(newInvitation);
      } else {
        state.notificationData = [newInvitation];
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllNotification.fulfilled, (state, action) => {
      const notifiData = action.payload;
      console.log('fullfil' , notifiData)
      state.notificationData = notifiData;
      
    });
     builder.addCase(updateNotification.fulfilled, (state, action) => {
      const updatedItem = action.payload;
      console.log(updatedItem._id)
      if (Array.isArray(state.notificationData)) {
          const index = state.notificationData.findIndex(item => item._id === updatedItem._id);
          console.log(index)
          if (index !== -1) {
            // Thay thế item cũ bằng item đã update mới nhất từ server
            state.notificationData[index] = updatedItem;
          }
        }
      
    });
    }
});


export const selectAllNotification= (state) => state.notification.notificationData

export const {addNotification} = notificationSlice.actions

export const notificationReducers = notificationSlice.reducer;
