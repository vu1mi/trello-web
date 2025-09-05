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
} from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
function BoardContent({ board }) {
  const [orderedColumns, setorderedColumns] = useState([]);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    setorderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);
  const handleDrangEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    console.log(event);
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
      const dndorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      setorderedColumns(dndorderedColumns);
    }
  };
  return (
    <DndContext onDragEnd={handleDrangEnd} sensors={sensors}>
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
        <ListColumn columns={orderedColumns} />
      </Box>
    </DndContext>
  );
}

export default BoardContent;
