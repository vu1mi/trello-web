import Box from "@mui/material/Box";
import ListColumn from "./ListColumn/ListColumn";
import { mapOrder } from "~/utils/sorts";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import cloneDeep from 'lodash/cloneDeep';
import { useState, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./ListColumn/Column/Column";
import Card  from "./ListColumn/Column/ListCard/Card/Card";
function BoardContent({ board, createColumn, createCard }) {
  const TYPE_ELEMENT_DRANGGING ={
    COLUMN: "COLUMN",
    CARD: "CARD"
  }
  const [typeElementDrangging, setTypeElementDrangging] = useState("");
  const [dataElementDrangging, setDataElementDrangging] = useState(null);
  const [idColumnDrangging, setIdColumnDrangging] = useState(null);
  const [orderedColumns, setorderedColumns] = useState([]);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const findIndexColumn = (cardId) => {
    return orderedColumns.find((c) => c.cards.map((card) => card._id).includes(cardId));
  }

  useEffect(() => {
    setorderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);
  const handleDrangStart = (event) => {
    const { active } = event;
    const typeElement = active.data.current?.columnId ? TYPE_ELEMENT_DRANGGING.CARD : TYPE_ELEMENT_DRANGGING.COLUMN;
    setTypeElementDrangging(typeElement);
    setDataElementDrangging(active?.data?.current);
    setIdColumnDrangging(active.id);
    console.log(event)
  };
  const handleDrangOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    if(typeElementDrangging === TYPE_ELEMENT_DRANGGING.COLUMN){
      return
    }
    console.log("over:", over)
    const idCardOver = over?.id;
    const idCardDrangging = active?.id;
    const columnactive = findIndexColumn(idCardDrangging);
    const columnover = findIndexColumn(idCardOver);
    if (!columnactive || !columnover) return
    if (columnactive._id !== columnover._id) {
    setorderedColumns(prevColumns => {

    // const isbelow = active?.rect?.top > over?.rect?.top + over?.rect?.height ;
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
    console.log("isbelow:", isBelowOverItem)
    const modify = isBelowOverItem ? 1 : 0
    const indexCardOver = columnover.cards.findIndex(c => c._id === idCardOver)
    const newCardIndex = indexCardOver > 0 ? indexCardOver + modify : columnover?.cards?.length + 1
    
    console.log("nextindex:", newCardIndex)

     const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(c => c._id === columnactive._id)
      const nextOverColumn = nextColumns.find(c => c._id === columnover._id)
        if(!columnover){
          newCardIndex = 0
          nextOverColumn = nextColumns.find(c => c._id === idCardOver._id)

      
        }
        if (nextActiveColumn) {
        // Lọc card đang kéo ra khỏi mảng cards của cột cũ
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== idCardDrangging)
        // Cập nhật lại mảng ID cardOrderIds chuẩn dữ liệu [15]
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      console.log("nextOverColumn:", nextOverColumn)
      // Column mới (nextOverColumn): Thêm card đang kéo vào column mới theo index đã tính toán [16]
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo đã tồn tại ở overColumn chưa, nếu có thì xóa nó trước (tránh trùng lặp) [16]
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== idCardDrangging)
        console.log("nextOverColumn after filter:", nextOverColumn.cards)
        
        // Chèn card đang kéo vào vị trí index mới [17]
        // Sử dụng toSpliced (hoặc splice nếu đã cloneDeep) để thêm dữ liệu card vào [17]
        nextOverColumn.cards.splice(newCardIndex, 0, dataElementDrangging)
        
        // Cập nhật lại mảng ID cardOrderIds cho cột mới [18]
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })  
    }

  }

  const handleDrangEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    console.log(dataElementDrangging);
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
      const dndorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      setorderedColumns(dndorderedColumns);
    }
  };
  
  const dropanimation ={
    sideEffects: defaultDropAnimationSideEffects({
      styles:{
        active:{
          opacity:'0.5'
        }
      }
    })
  }
  return (
    <DndContext onDragEnd={handleDrangEnd} onDragStart={handleDrangStart} onDragOver={handleDrangOver} sensors={sensors}>
      
        
     
      <Box
        sx={{
          p: 2,
          width: "100%",
          height: (theme) => theme.trelloCustom.boardContentHeight,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          display: "flex",
        }}
      >
        <ListColumn columns={orderedColumns} createColumn={createColumn} createCard={createCard} />
        <DragOverlay dropAnimation={dropanimation}>
          {!idColumnDrangging && null }
          {(typeElementDrangging === TYPE_ELEMENT_DRANGGING.CARD)  && <Card card={dataElementDrangging} />}
          {(typeElementDrangging === TYPE_ELEMENT_DRANGGING.COLUMN)  && <Column column={dataElementDrangging} />}
          </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
