import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizeAxios from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';
import { toast } from 'react-toastify';

const initialState = {
  commentCardata: null,
};

export const fetchAllcomment = createAsyncThunk(
  'commentCard/fetchAllcomment',
  async (CardId) => {
    const response = await authorizeAxios.get(
      `${API_ROOT}/v1/comment/${CardId}`,
    
    );
    console.log(response.data)
    return response.data;
  }
);
export const creatNewComment = createAsyncThunk(
  'commentCard/creatNewComment',
  async ({CardId , data}) => {
    console.log('redux' , data)
    const response = await authorizeAxios.post(
      `${API_ROOT}/v1/comment/${CardId}`,
      data
    
    );

    return response.data;
  }
);
// khởi tạo 1 clice trong kho lưu trữ
export const commentCardSlice = createSlice({
  name: 'commentCard',
  //   khởi tạo giá trị ban đầu của sllice
  initialState,
  // xử li dữ liệu đồng bộ
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllcomment.fulfilled, (state, action) => {
      const commentData = action.payload;
      console.log('fullfil' , commentData)
      state.commentCardata = commentData;
      
    });
    builder.addCase(creatNewComment.fulfilled , (state, action)=>{
      const newComment = action.payload;
        state.commentCardata.unshift(newComment);
    })
  },
});


export const selectAllcomment= (state) => state.commentCard.commentCardata
;

export const commentReducers = commentCardSlice.reducer;
