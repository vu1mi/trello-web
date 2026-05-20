import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { API_ROOT } from '~/utils/constants';

const initialState = {
  currentActiveBoard: null
}

export const fectchBoardDetailAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetail',
  async (boardId) => {
     const response = await axios.get(`${API_ROOT}/v1/board/${boardId}`);
    return response.data;
  }
);

// khởi tạo 1 clice trong kho lưu trữ
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
//   khởi tạo giá trị ban đầu của sllice
  initialState,
  // xử li dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
   // action.payload là dữ liệu được truyền vào khi gọi action này
      const board = action.payload
      state.currentActiveBoard = board
    },
  
  },
  extraReducers: (builder) => {
    builder.addCase(fectchBoardDetailAPI.fulfilled, (state, action) => {
      const board = action.payload
       
      state.currentActiveBoard = board;
    });
  }
})

// actions la noi danh cho cac component ben duoi goi bang distpatch de thay doi state
// nhung action duoc redux tao tu dong theo ten reducer va duoc export ra de su dung o cac component khac
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// selector dung de lay du lieu tu state, o day la lay currentActiveBoard tu state.activeBoard
export const selectCurrentActiveBoard = (state) => state.activeBoard.currentActiveBoard 
  
export const activeBoardReducer = activeBoardSlice.reducer