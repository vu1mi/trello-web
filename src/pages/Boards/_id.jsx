import { Container } from "@mui/material";
import AppBar from "../../components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { mockData } from "~/apis/mock-data";
import { use } from "react";
import { fetchBoardDetailAPI, createColumnAPI, createCardAPI } from "~/apis";
import { useEffect, useState } from "react";
function Board() {
  const [board, setBoard] = useState(null);
  useEffect(async () => {
    const respone = await fetchBoardDetailAPI("69a858057ac4cb4c68b3213b");
    setBoard(respone);
    console.log("Board detail data:", respone);
  }, []);

  const createColumn = async (newColumn) => {
    const createdColumn = await createColumnAPI({ ...newColumn, boardId: board._id })

    const newboard = { ...board }
    newboard.columns.push(createdColumn)
    newboard.columnOrderIds.push(createdColumn._id)
    setBoard(newboard)
  }
  const createCard = async (newCard) => {
    const createdCard = await createCardAPI({ ...newCard, boardId: board._id })

    const newboard = { ...board }
    const columnToupdate = board.columns.find(c => c._id === newCard.columnId)
    columnToupdate.cards.push(createdCard)
    columnToupdate.cardOrderIds.push(createdCard._id)
    setBoard(newboard)
  }
  // console.log("board data:", board)

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: "100vh", backgroundColor: "primary.main" }}
    >
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} createColumn={createColumn} createCard={createCard} />
    </Container>
  );
}

export default Board;
