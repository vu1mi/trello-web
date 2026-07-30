import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizeAxios from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';
import { toast } from 'react-toastify';

const initialState = {
  cardActiveData: null,
};

export const fetchCardDetail = createAsyncThunk(
  'cardActive/fetchCardDetail',
  async (CardId) => {
    const response = await authorizeAxios.get(
      `${API_ROOT}/v1/card/${CardId}`,
    
    );
    return response.data;
  }
);

export const updateCardDetail = createAsyncThunk(
  'cardActive/updateCardDetail',
  async ({CardId , data}) => {
    console.log('card redux', data)
    const response = await authorizeAxios.patch(
      `${API_ROOT}/v1/card/${CardId}`,
      data
    
    );
    return response.data;
  }
);

// khởi tạo 1 clice trong kho lưu trữ
export const cardSlice = createSlice({
  name: 'cardActive',
  //   khởi tạo giá trị ban đầu của sllice
  initialState,
  // xử li dữ liệu đồng bộ
  reducers: {
    removeCardActive: (state, action) => {
      state.cardActiveData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCardDetail.fulfilled, (state, action) => {
      const cardActive = action.payload;
      state.cardActiveData = cardActive.data;
      
    });
    builder.addCase(updateCardDetail.fulfilled , (state, action)=>{
       const cardActive = action.payload;
      state.cardActiveData = cardActive.data;
    })
  },
});
export const { removeCardActive } = cardSlice.actions;

export const selectCardActive= (state) => state.cardActive.cardActiveData;

export const cardReducers = cardSlice.reducer;
