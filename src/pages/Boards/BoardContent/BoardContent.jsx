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
import { useState, useEffect, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./ListColumn/Column/Column";
import Card  from "./ListColumn/Column/ListCard/Card/Card";
function BoardContent({ board }) {
  const TYPE_ELEMENT_DRANGGING ={
    COLUMN: "COLUMN",
    CARD: "CARD"
  }
  const [typeElementDrangging, setTypeElementDrangging] = useState("");
  const [dataElementDrangging, setDataElementDrangging] = useState(null);
  const [idColumnDrangging, setIdColumnDrangging] = useState(null);
  const [orderedColumns, setorderedColumns] = useState([]); 
  const [oldcolumnactive, setOldColumnActive] = useState([]); 
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
  const lastOverId = useRef(null)

  useEffect(() => {
    setorderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);
 


  const handleDrangStart = (event) => {
    const { active } = event;

    const typeElement = active.data.current?.columnId ? TYPE_ELEMENT_DRANGGING.CARD : TYPE_ELEMENT_DRANGGING.COLUMN;
    setTypeElementDrangging(typeElement);
    setDataElementDrangging(active?.data?.current);
    setIdColumnDrangging(active.id);
    if(typeElement === TYPE_ELEMENT_DRANGGING.CARD){
      setOldColumnActive(findIndexColumn(active.id))
    }
    console.log(event)
  };
  // const handleDrangOver = (event) => {
  //   const { active, over } = event;
  //   const overId = over?.id || lastOverId.current;
  //   if (!overId) return;
  //   lastOverId.current = overId;
  //   if (!over) return;
  //   if(typeElementDrangging === TYPE_ELEMENT_DRANGGING.COLUMN){
  //     return
  //   }
  
  //   const idCardOver = over?.id;
  //   const idCardDrangging = active?.id;
  //   const columnactive = findIndexColumn(idCardDrangging);
  //   let columnover =  findIndexColumn(idCardOver) ;
  //   if(columnover === undefined){
  //     columnover = orderedColumns.find(c => c._id === idCardOver)
  //   }
  //   console.log("columnactive:", columnactive)
  //   console.log("columnover:", columnover)

  //   if (!columnactive || !columnover) return
  //   if (columnactive._id === columnover._id) return;

  //   // trường hợp kéo thả card sang 2 column khác nhau 
  //   if (columnactive._id !== columnover._id) {

  //   setorderedColumns(prevColumns => {
 
  //     const isBelowOverItem = active.rect.current.translated &&
  //       active.rect.current.translated.top > over.rect.top + over.rect.height
 
    

  //    const nextColumns = cloneDeep(prevColumns)
  //     const nextActiveColumn = nextColumns.find(c => c._id === columnactive._id)
  //     const nextOverColumn = nextColumns.find(c => c._id === columnover._id)
  //        const modify = isBelowOverItem ? 1 : 0
  //   const indexCardOver = nextOverColumn.cards.findIndex(c => c._id === idCardOver)
  //   const newCardIndex = indexCardOver >= 0 ? indexCardOver + modify : nextOverColumn?.cards?.length + 1
     
  //       if (nextActiveColumn) {
  //       // Lọc card đang kéo ra khỏi mảng cards của cột cũ
  //       nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== idCardDrangging)
  //       // Cập nhật lại mảng ID cardOrderIds chuẩn dữ liệu [15]
  //       nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
  //     }
  //     console.log("nextOverColumn:", nextOverColumn)
  //     // Column mới (nextOverColumn): Thêm card đang kéo vào column mới theo index đã tính toán [16]
  //     if (nextOverColumn) {
  //       // Kiểm tra xem card đang kéo đã tồn tại ở overColumn chưa, nếu có thì xóa nó trước (tránh trùng lặp) [16]
  //       nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== idCardDrangging)
  //       // Chèn card đang kéo vào vị trí index mới [17]
  //       // Sử dụng toSpliced (hoặc splice nếu đã cloneDeep) để thêm dữ liệu card vào [17]
  //       nextOverColumn.cards.splice(newCardIndex, 0, dataElementDrangging)
        
  //       // Cập nhật lại mảng ID cardOrderIds cho cột mới [18]
  //       nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
  //     }

  //     return nextColumns
  //   })  
  // }

  // }
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
    const nextActiveColumn = nextColumns.find((c) => c._id === columnactive._id);
    const nextOverColumn = nextColumns.find((c) => c._id === columnover._id);

    if (!nextActiveColumn || !nextOverColumn) return prevColumns; // ✅ guard

    // ✅ Lấy card đang kéo từ nextActiveColumn (đã cloneDeep) thay vì dùng dataElementDrangging
    const draggingCard = nextActiveColumn.cards.find((c) => c._id === idCardDrangging);
    if (!draggingCard) return prevColumns;

    // ✅ Xóa card khỏi column cũ
    nextActiveColumn.cards = nextActiveColumn.cards.filter((c) => c._id !== idCardDrangging);
    nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((c) => c._id);

    // ✅ Tính index chèn vào column mới
    const isBelowOverItem =
      active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height;
    const modify = isBelowOverItem ? 1 : 0;

    const indexCardOver = nextOverColumn.cards.findIndex((c) => c._id === idCardOver);

    // ✅ Sửa lỗi: dùng >= 0 thay vì > 0
    const newCardIndex =
      indexCardOver >= 0
        ? indexCardOver + modify
        : nextOverColumn.cards.length;

    // ✅ Xóa nếu đã tồn tại, rồi splice vào đúng vị trí
    nextOverColumn.cards = nextOverColumn.cards.filter((c) => c._id !== idCardDrangging);
    nextOverColumn.cards.splice(newCardIndex, 0, draggingCard);
    nextOverColumn.cardOrderIds = nextOverColumn.cards.map((c) => c._id);

    return nextColumns;
  });
};

  const handleDrangEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if(typeElementDrangging === TYPE_ELEMENT_DRANGGING.CARD){
  
      const idCardOver = over?.id;
      const idCardDrangging = active?.id;
      const columnactive = findIndexColumn(idCardDrangging);
      let columnover =  findIndexColumn(idCardOver) ;

      // trường hợp kéo thả card sang 2 column khác nhau 
      if (oldcolumnactive._id !== columnover._id) {
        console.log("drag end card between 2 column")
    
      }else {
        const oldIndex = oldcolumnactive.cards.findIndex(c => c._id === idCardDrangging)
        const newIndex = oldcolumnactive.cards.findIndex(c => c._id === idCardOver)
        const newCards = arrayMove(oldcolumnactive.cards, oldIndex, newIndex)
        setorderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(c => c._id === oldcolumnactive._id)
          targetColumn.cards = newCards
          targetColumn.cardOrderIds = newCards.map(c => c._id)
          return nextColumns;
        })
      }
  }

    // xu li keo tha column
    if(typeElementDrangging === TYPE_ELEMENT_DRANGGING.COLUMN && active.id !== over.id){
      
        const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
        const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
        const dndorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
        setorderedColumns(dndorderedColumns);
      
  };
  setTypeElementDrangging(null)
  setDataElementDrangging(null)
  setIdColumnDrangging(null)
  setOldColumnActive(null)
  }
  
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
        <ListColumn columns={orderedColumns}     />
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
