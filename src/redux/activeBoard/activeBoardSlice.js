import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizeAxios from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';

const initialState = {
  currentActiveBoard: null,
};

export const fetchBoardDetailAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetail',
  async (boardId) => {
    console.log('apiroot', API_ROOT);
    const response = await authorizeAxios.get(
      `${API_ROOT}/v1/board/${boardId}`
    );
    return response.data;
  }
);

export const updateBoardAPI = createAsyncThunk(
  'activeBoard/updateBoard',
  async ({ boardId, updateData }) => {
    const response = await authorizeAxios.patch(
      `${API_ROOT}/v1/board/${boardId}`,
      updateData
    );
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
      const board = action.payload;
      state.currentActiveBoard = board;
    },
    updateCardAction:(state,action)=>{
      const cardData = action.payload
      const column = state.currentActiveBoard.columns.find(i => i._id == cardData.columnId)
      if(column){
        const card = column.cards.find(i => i._id == cardData.id)
        console.log(cardData.id)
        if(card){
          console.log('yessss', cardData)

          Object.keys(cardData).forEach(key =>{
            card[key] = cardData[key]
          })
        }
      }
    },
    updataCardOrderIds:(state,action)=>{
      const {columnId, cardOrderIds} = action.payload
      const column = state.currentActiveBoard.columns.find(i => i._id == columnId)
      if(column){
        column.cardOrderIds = cardOrderIds
      }
    },
    applyBoardOrderUpdate: (state, action) => {
      const { boardId, columnOrderIds, columns } = action.payload;
      const board = state.currentActiveBoard;

      if (!board || String(board._id) !== String(boardId)) return;

      if (columnOrderIds) board.columnOrderIds = columnOrderIds;
      if (columns) {
        const updatedColumns = new Map(
          columns.map((column) => [String(column._id), column])
        );
        const existingColumnIds = new Set(
          board.columns.map((column) => String(column._id))
        );

        board.columns = board.columns.map(
          (column) => updatedColumns.get(String(column._id)) || column
        );
        columns.forEach((column) => {
          if (!existingColumnIds.has(String(column._id))) {
            board.columns.push(column);
          }
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailAPI.fulfilled, (state, action) => {
      const board = action.payload;
      state.currentActiveBoard = board;
    });
    builder.addCase(updateBoardAPI.fulfilled, (state, action) => {
      const updatedBoard = action.payload;
      state.currentActiveBoard.columnOrderIds = updatedBoard.columnOrderIds;
    });
  },
});

// actions la noi danh cho cac component ben duoi goi bang distpatch de thay doi state
// nhung action duoc redux tao tu dong theo ten reducer va duoc export ra de su dung o cac component khac
export const {
  updateCurrentActiveBoard,
  updateCardAction,
  updataCardOrderIds,
  applyBoardOrderUpdate,
} = activeBoardSlice.actions;

// selector dung de lay du lieu tu state, o day la lay currentActiveBoard tu state.activeBoard
export const selectCurrentActiveBoard = (state) =>
  state.activeBoard.currentActiveBoard;

export const activeBoardReducer = activeBoardSlice.reducer;
