import shuffle from "lodash/shuffle";
import chunk from "lodash/chunk";

export const makeDeck = () => {
  /**
   * Suits
   * Contains only one suit which spades
   */

  /**
   * Ranks
   * a: Ace
   * j: Jack
   * q: Queen
   * k: King
   * 2 - 10
   */
  const ranks = [
    "a",
    "j",
    "q",
    "k",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
  ];

  const deck = [];
  const emptyArray = new Array(8).fill(0, 0);

  ranks.forEach((rank) => {
    emptyArray.forEach(() => {
      deck.push({
        suit: "s",
        rank: rank,
      });
    });
  });

  return deck;
};

export const populateCards = () => {
  const cards = makeDeck(); // [0 - 103]

  const shuffledCards = shuffle(cards);

  const decks = chunk(shuffledCards, 54); // [[0 - 53], [54 - 104]]

  const twoDecks = chunk(decks[0], 30); // from deck[0] -> [[0 - 29], [30 - 53]]

  const rightColumns = chunk(twoDecks[0], 5); //  6 columns of 5 rows

  const leftColumns = chunk(twoDecks[1], 6); // four columns of 6 rows

  const columns = [];
  let columnIndex = 0;

  leftColumns.forEach((leftColumn) => {
    const newColumn = [];

    leftColumn.forEach((item, itemIndex) => {
      newColumn.push({
        ...item,
        index: itemIndex,
        columnIndex,
        isFaceUp: itemIndex + 1 === leftColumn.length,
      });
    });

    columnIndex++;
    columns.push(newColumn);
  });

  rightColumns.forEach((rightColumn) => {
    const newColumn = [];

    rightColumn.forEach((item, itemIndex) => {
      newColumn.push({
        ...item,
        index: itemIndex,
        columnIndex,
        isFaceUp: itemIndex + 1 === rightColumn.length,
      });
    });
    columnIndex++;
    columns.push(newColumn);
  });
  return {
    deck: decks[1],
    columns,
  };
};

const getRank = (card) => {
  let newRank;

  switch (card.rank) {
    case "k":
      newRank = "13";
      break;

    case "q":
      newRank = "12";
      break;

    case "j":
      newRank = "11";
      break;

    case "a":
      newRank = "1";
      break;

    default: {
      newRank = card.rank;
    }
  }

  return Number(newRank);
};

export const canBeDropped = (card, destinationColumn) => {
  if (destinationColumn?.length <= 0) return true;
  const sourceCardRank = getRank(card);
  const destinationCardRank = getRank(
    destinationColumn[destinationColumn.length - 1]
  );

  if (sourceCardRank === destinationCardRank - 1) return true;
  return false;
};

const haveValidRank = (cards) => {
  let prevRank = getRank(cards[0]);

  for (let i = 1; i < cards.length; i++) {
    const rank = getRank(cards[i]);

    if (rank < prevRank) {
      prevRank = rank;
    } else {
      return false;
    }
  }

  return true;
};

export const canBeDragged = (card, sourceColumn) => {
  const draggedItems = sourceColumn.slice(card.index);

  if (draggedItems.length === 1) {
    return true;
  }

  if (haveValidRank(draggedItems)) {
    return true;
  }

  return false;
};

export const haveEmptyColumn = (columns) => {
  let haveEmpty = false;

  columns.forEach((column) => {
    if (column.length <= 0) {
      haveEmpty = true;
    }
  });

  return haveEmpty;
};

export const getInitialCompletedCoulmns = () => {
  const emptyArray = [0, 1, 2, 3, 4, 5, 6, 7];
  return emptyArray.map(() => ({
    columnIndex: -1,
    isCompleted: false,
  }));
};

export const isColumnCompleted = (column) => {
  const completeSequence = "kqj1098765432a";

  let sequenceIndex = -1;

  if (column.length >= 13) {
    // find the first faceup card index
    const index = column.findIndex((card) => card.isFaceUp);
    if (index !== -1) {
      const subArray = column.slice(index);

      let outputSequence = "";

      subArray.forEach((card) => {
        outputSequence += card.rank;
      });

      sequenceIndex = outputSequence.indexOf(completeSequence);

      if (sequenceIndex !== -1) {
        sequenceIndex += index;
      }
    }
  }

  return sequenceIndex;
};
