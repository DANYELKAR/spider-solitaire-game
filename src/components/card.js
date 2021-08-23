import React from "react";

const Card = ({
  card,
  onDragStart = () => {},
  onDragEnter = () => {},
  onDragEnd = () => {},
}) => {
  const { suit, rank, isFaceUp } = card;
  let suitIcon;

  switch (suit) {
    case "s":
      suitIcon = <>&#9824;</>;
      break;
    case "h":
      suitIcon = <>&#9829;</>;
      break;
    case "c":
      suitIcon = <>&#9827;</>;
      break;
    case "d":
      suitIcon = <>&#9830;</>;
      break;
    default:
      suitIcon = null;
  }

  return (
    <div className="card">
      {isFaceUp ? (
        <>
          <div
            className="card_faceUp"
            draggable
            data-column_index={card.columnIndex}
            onDragStart={() => {
              onDragStart(card);
            }}
            onDragEnter={(e) => {
              onDragEnter(e);
            }}
            onDragEnd={(e) => {
              onDragEnd(e);
            }}
          >
            <div
              className="card_faceUp--header"
              data-column_index={card.columnIndex}
            >
              <p data-column_index={card.columnIndex}>{rank}</p>
              <div
                className="card_faceUp--header-icon"
                data-column_index={card.columnIndex}
              >
                {suitIcon}
              </div>
            </div>
            <div
              className="card_faceUp--body"
              data-column_index={card.columnIndex}
            >
              <p data-column_index={card.columnIndex}>{rank}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="card_faceDown"></div>
      )}
    </div>
  );
};

export default Card;
