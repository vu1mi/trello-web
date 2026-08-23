import Box from '@mui/material/Box';
import ListColumn from './ListColumn/ListColumn';
import { mapOrder } from '~/utils/sorts';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import cloneDeep from 'lodash/cloneDeep';
import { useState, useEffect, useRef } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './ListColumn/Column/Column';
import Card from './ListColumn/Column/ListCard/Card/Card';
import { updateCardPositionAPI, updateColumnAPI } from '~/apis/index.js';
import { useDispatch, useSelector } from 'react-redux';
import { socketInstance } from '~/main';
import {
  updataCardOrderIds,
  updateBoardAPI,
  updateCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
function BoardContent({ board }) {
    const dispatch = useDispatch();
  const TYPE_ELEMENT_DRANGGING = {
    COLUMN: 'COLUMN',
    CARD: 'CARD',
  };
  const [typeElementDrangging, setTypeElementDrangging] = useState('');
  const [dataElementDrangging, setDataElementDrangging] = useState(null);
  const [idColumnDrangging, setIdColumnDrangging] = useState(null);
  const [orderedColumns, setorderedColumns] = useState([]);
  const [oldcolumnactive, setOldColumnActive] = useState([]);
  const[columnChanged, setColumnChanged] = useState(false)
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const findIndexColumn = (cardId) => {
    return orderedColumns.find((c) =>
      c.cards.map((card) => card._id).includes(cardId)
    );
  };
  const lastOverId = useRef(null);

  useEffect(() => {
    setorderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  const handleDrangStart = (event) => {
    const { active } = event;

    const typeElement = active.data.current?.columnId
      ? TYPE_ELEMENT_DRANGGING.CARD
      : TYPE_ELEMENT_DRANGGING.COLUMN;
    setTypeElementDrangging(typeElement);
    setDataElementDrangging(active?.data?.current);
    setIdColumnDrangging(active.id);
    if (typeElement === TYPE_ELEMENT_DRANGGING.CARD) {
      setOldColumnActive(findIndexColumn(active.id));
    }
    console.log(event);
  };
  const handleDrangOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (typeElementDrangging === TYPE_ELEMENT_DRANGGING.COLUMN) return;

    const idCardOver = over?.id;
    const idCardDrangging = active?.id;

    const columnactive = findIndexColumn(idCardDrangging);
    let columnover = findIndexColumn(idCardOver);
    if (columnover === undefined) {
      columnover = orderedColumns.find((c) => c._id === idCardOver);
    }

    if (!columnactive || !columnover) return;
    if (columnactive._id === columnover._id) return;

    setorderedColumns((prevColumns) => {
      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (c) => c._id === columnactive._id
      );
      const nextOverColumn = nextColumns.find((c) => c._id === columnover._id);

      if (!nextActiveColumn || !nextOverColumn) return prevColumns; // ✅ guard
 
      // ✅ Lấy card đang kéo từ nextActiveColumn (đã cloneDeep) thay vì dùng dataElementDrangging
      const draggingCard = nextActiveColumn.cards.find(
        (c) => c._id === idCardDrangging
      );
      if (!draggingCard) return prevColumns;

      // ✅ Xóa card khỏi column cũ
      nextActiveColumn.cards = nextActiveColumn.cards.filter(
        (c) => c._id !== idCardDrangging
      );
      nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((c) => c._id);

      // ✅ Tính index chèn vào column mới
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modify = isBelowOverItem ? 1 : 0;

      const indexCardOver = nextOverColumn.cards.findIndex(
        (c) => c._id === idCardOver
      );

      // ✅ Sửa lỗi: dùng >= 0 thay vì > 0
      const newCardIndex =
        indexCardOver >= 0
          ? indexCardOver + modify
          : nextOverColumn.cards.length;

      // ✅ Xóa nếu đã tồn tại, rồi splice vào đúng vị trí
      nextOverColumn.cards = nextOverColumn.cards.filter(
        (c) => c._id !== idCardDrangging
      );
      nextOverColumn.cards.splice(newCardIndex, 0, draggingCard);
      nextOverColumn.cardOrderIds = nextOverColumn.cards.map((c) => c._id);

      return nextColumns;
    });
  };

  const handleDrangEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    if (typeElementDrangging === TYPE_ELEMENT_DRANGGING.CARD) {
      const idCardOver = over.id;
      const idCardDrangging = active.id;

      const nextColumns = cloneDeep(orderedColumns);
      const oldColumnId = oldcolumnactive?._id;
      const activeColumn = nextColumns.find((column) =>
        column.cards.some((card) => card._id === idCardDrangging)
      );
      const overColumn =
        nextColumns.find((column) =>
          column.cards.some((card) => card._id === idCardOver)
        ) || nextColumns.find((column) => column._id === idCardOver);

      if (!activeColumn || !overColumn || !oldColumnId) return;

      if (activeColumn._id === overColumn._id) {
        const oldIndex = activeColumn.cards.findIndex(
          (card) => card._id === idCardDrangging
        );
        const overIndex = overColumn.cards.findIndex(
          (card) => card._id === idCardOver
        );
        if (overIndex >= 0 && oldIndex !== overIndex) {
          activeColumn.cards = arrayMove(activeColumn.cards, oldIndex, overIndex);
          activeColumn.cardOrderIds = activeColumn.cards.map((card) => card._id);
        }
      }

      const oldColumn = nextColumns.find((column) => column._id === oldColumnId);
      const changedColumnIds = new Set([oldColumnId, overColumn._id]);
      await Promise.all([
        ...nextColumns
          .filter((column) => changedColumnIds.has(column._id))
          .map((column) =>
            updateColumnAPI(column._id, { cardOrderIds: column.cardOrderIds })
          ),
        ...(oldColumnId !== overColumn._id
          ? [updateCardPositionAPI(idCardDrangging, overColumn._id)]
          : []),
      ]);

      const updatedBoard = cloneDeep(board);
      updatedBoard.columns = nextColumns;
      dispatch(updateCurrentActiveBoard(updatedBoard));
      setorderedColumns(nextColumns);
      socketInstance.emit('FE_BOARD_ORDER_UPDATED', {
        boardId: board._id,
        columnOrderIds: board.columnOrderIds,
        columns: nextColumns.filter((column) => changedColumnIds.has(column._id)),
      });
    }


    // xu li keo tha column
    if (
      typeElementDrangging === TYPE_ELEMENT_DRANGGING.COLUMN &&
      active.id !== over.id
    ) {
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
      const dndorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      setorderedColumns(dndorderedColumns);
      dispatch(updateBoardAPI({
        boardId: board._id,
        updateData: {
          columnOrderIds: dndorderedColumns.map((c) => c._id),
        },
      }));
      socketInstance.emit('FE_BOARD_ORDER_UPDATED', {
        boardId: board._id,
        columnOrderIds: dndorderedColumns.map((column) => column._id),
      });
    }
    setTypeElementDrangging(null);
    setDataElementDrangging(null);
    setIdColumnDrangging(null);
    setOldColumnActive(null);
  };

  const dropanimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };
  return (
    <DndContext
      onDragEnd={handleDrangEnd}
      onDragStart={handleDrangStart}
      onDragOver={handleDrangOver}
      sensors={sensors}
    >
      <Box
        sx={{
          p: 2,
          width: '100%',
          height: (theme) => theme.trelloCustom.boardContentHeight,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          display: 'flex',
        }}
      >
        <ListColumn columns={orderedColumns} />
        <DragOverlay dropAnimation={dropanimation}>
          {!idColumnDrangging && null}
          {typeElementDrangging === TYPE_ELEMENT_DRANGGING.CARD && (
            <Card card={dataElementDrangging} />
          )}
          {typeElementDrangging === TYPE_ELEMENT_DRANGGING.COLUMN && (
            <Column column={dataElementDrangging} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
