import { Container } from "@mui/material";
import AppBar from "../../components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { mockData } from "~/apis/mock-data";
import {  createColumnAPI, createCardAPI, deleteColumnAPI, deleteCardApi , updateCardAPI } from "~/apis/index.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fectchBoardDetailAPI, selectCurrentActiveBoard, updateCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { cloneDeep } from "lodash";
import { useParams } from "react-router-dom";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
function Board() {
  // const idboard = "69a858057ac4cb4c68b3213b";
  const { boardId } = useParams(); 
  const board = useSelector(selectCurrentActiveBoard);
  const dispatch = useDispatch();
  const currentActiveBoard = useSelector(selectCurrentActiveBoard);
  useEffect(  () => {
    const fetchBoardDetail = async () => {
    const respone = await dispatch(fectchBoardDetailAPI(boardId));
    const newboard = respone.payload 
     dispatch(updateCurrentActiveBoard(newboard))
    console.log("Board detail data:", respone);
    }
    fetchBoardDetail()
  }, [dispatch, boardId]);

  if (!board) {
    return <PageLoadingSpinner caption="Loading board details..." />;
  }



  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: "100vh", backgroundColor: "primary.main" }}
    >
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board}   />
    </Container>
  );
}

export default Board;
