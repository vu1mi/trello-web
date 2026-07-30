import { Container } from '@mui/material';
import AppBar from '../../components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import { mockData } from '~/apis/mock-data';
import {
  createColumnAPI,
  createCardAPI,
  deleteColumnAPI,
  deleteCardApi,
  updateCardAPI,
} from '~/apis/index.js';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBoardDetailAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import { cloneDeep } from 'lodash';
import { useParams } from 'react-router-dom';
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner';

import { CardActions } from '~/components/model/CardActive/CardActivity';
function Board() {

  const { boardId } = useParams();
  const board = useSelector(selectCurrentActiveBoard);
  const dispatch = useDispatch();
  const currentActiveBoard = useSelector(selectCurrentActiveBoard);
  useEffect(() => {
    const fetchBoardDetail = async () => {
      const respone = await dispatch(fetchBoardDetailAPI(boardId));
      const newboard = respone.payload;
      dispatch(updateCurrentActiveBoard(newboard));
      console.log('Board detail data:', respone);
    };
    fetchBoardDetail();
  }, [dispatch, boardId]);

  if (!board) {
    return <PageLoadingSpinner caption="Loading board details..." />;
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: 'primary.main' }}
    >
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
      <CardActions/>
    </Container>
  );
}

export default Board;
