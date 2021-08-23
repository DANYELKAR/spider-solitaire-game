import React from "react";
import Card from "./card";

const Column = ({
  column,
  onDragStart,
  onDragEnter,
  onDragEnd,
  columnIndex,
}) => {
  return (
    <>
      {column.length > 0 ? (
        <div className="column">
          {column.map((card, index) => (
            <div style={{ position: "absolute", top: `${(index + 1) * 25}px` }}>
              <Card
                card={card}
                onDragStart={onDragStart}
                onDragEnter={onDragEnter}
                onDragEnd={() => onDragEnd(card)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{ marginTop: "25px" }}
          onDragEnter={onDragEnter}
          className="column_placeholder"
          data-column_index={columnIndex}
        />
      )}
    </>
  );
};

export default Column;
