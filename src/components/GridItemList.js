import React, { useCallback, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const ListItem = ({ index, text, moveCard }) => {
  const card = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "CARD",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!card.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = card.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: () => {
      return { text, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(card));

  return (
    <div
      className="item"
      ref={card}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      {text}
    </div>
  );
};

const GridItemList = ({ items, setitems }) => {
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    console.log(dragIndex, hoverIndex);

    setitems((prev) => {
      const updatedList = [...prev];

      const [removedItems] = updatedList.splice(dragIndex, 1);

      updatedList.splice(hoverIndex, 0, removedItems);
      return updatedList;
    });
  }, []);
  const renderCard = useCallback((card, index) => {
    return (
      <ListItem
        key={card.name}
        index={index}
        text={card.name}
        moveCard={moveCard}
      />
    );
  }, []);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid_items">
        {/* {items.map((el, i) => (
          <div key={i}>{el.name}</div>
        ))} */}
        {items.map((card, i) => renderCard(card, i))}
      </div>
    </DndProvider>
  );
};

export default GridItemList;
