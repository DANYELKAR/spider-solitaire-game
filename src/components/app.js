import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Column from "./column";
import CompletedColumns from "./completedColumns";
import {
  populateCards,
  canBeDropped,
  canBeDragged,
  haveEmptyColumn,
  getInitialCompletedCoulmns,
  isColumnCompleted,
} from "../utils";

const App = () => {
  const [state, setState] = useState(() => {
    const { deck, columns } = populateCards();
    return {
      deck,
      columns,
      completedColumns: getInitialCompletedCoulmns(),
      selectedCardIndex: -1,
      sourceColumnIndex: -1,
      destinationColumnIndex: -1,
      score: 0,
      higestScore: 0,
      steps: 0,
    };
  });

  const _setState = (newState) => {
    setState((oldState) => ({
      ...oldState,
      ...newState,
    }));
  };

  const handleDragStart = (card) => {
    if (canBeDragged(card, state.columns[card.columnIndex])) {
      _setState({
        selectedCardIndex: card.index,
        sourceColumnIndex: card.columnIndex,
      });
    }
  };

  const handleDragEnd = (card) => {
    if (
      state.sourceColumnIndex !== -1 &&
      state.destinationColumnIndex !== state.sourceColumnIndex
    ) {
      if (canBeDropped(card, state.columns[state.destinationColumnIndex])) {
        const sourceColumn = [...state.columns[state.sourceColumnIndex]];
        const destinationColumn = [
          ...state.columns[state.destinationColumnIndex],
        ];

        // remove selected cards from the source column
        const removedItems = sourceColumn.splice(state.selectedCardIndex);

        // check if the item exists after removing -> if exists than turn it up
        if (sourceColumn.length > 0) {
          sourceColumn[sourceColumn.length - 1].isFaceUp = true;
        }

        // add selected card to the destination column
        const newDestinationItems = [...destinationColumn, ...removedItems];

        // update added items index and columnIndex
        const newDestinationColumn = newDestinationItems.map((i, index) => {
          return {
            ...i,
            index,
            columnIndex: state.destinationColumnIndex,
          };
        });

        let newColumns = [...state.columns];

        newColumns[state.sourceColumnIndex] = sourceColumn;

        const completeSequenceIndex = isColumnCompleted(newDestinationColumn);

        if (completeSequenceIndex !== -1) {
          // remove that sequence from the destination column
          const removedSequence = newDestinationColumn.splice(
            completeSequenceIndex,
            13
          );

          // If the last element is face down than turn it
          if (
            newDestinationColumn.length > 0 &&
            !newDestinationColumn[newDestinationColumn.length - 1].isFaceUp
          ) {
            newDestinationColumn[
              newDestinationColumn.length - 1
            ].isFaceUp = true;
          }

          newColumns[state.destinationColumnIndex] = newDestinationColumn;

          const newCompletedColumns = [...state.completedColumns];

          // Find the empty index in completed columns and update it
          const emptyIndex = state.completedColumns.findIndex(
            (i) => i.isCompleted === false
          );
          newCompletedColumns[emptyIndex].columnIndex =
            state.destinationColumnIndex;
          newCompletedColumns[emptyIndex].isCompleted = true;
          newCompletedColumns[emptyIndex].column = removedSequence;

          const score = state.score + 65;

          localStorage.setItem("score", `${score}`);

          const steps = state.steps + 1;

          _setState({
            selectedCardIndex: -1,
            sourceColumnIndex: -1,
            destinationColumnIndex: -1,
            columns: newColumns,
            completedColumns: newCompletedColumns,
            score,
            steps,
          });
        } else {
          const steps = state.steps + 1;
          newColumns[state.destinationColumnIndex] = newDestinationColumn;
          _setState({
            selectedCardIndex: -1,
            sourceColumnIndex: -1,
            destinationColumnIndex: -1,
            columns: newColumns,
            steps,
          });
        }
      }
    }
  };

  const handleDragEnter = (e) => {
    const destinationColumnIndex = Number(e.target.dataset["column_index"]);
    _setState({
      destinationColumnIndex,
    });
  };

  const addCardFromDeck = () => {
    if (!haveEmptyColumn(state.columns)) {
      const newDeck = [...state.deck];

      const cardsToAdd = newDeck.splice(0, state.columns.length);

      const newColumns = state.columns.map((column, index) => {
        const newColumn = column.map((i) => ({ ...i }));
        if (cardsToAdd[index]) {
          newColumn.push({
            ...cardsToAdd[index],
            index: newColumn.length,
            columnIndex: index,
            isFaceUp: true,
          });
        }
        return newColumn;
      });

      _setState({
        deck: newDeck,
        columns: newColumns,
      });
    }
  };

  const handleRestart = () => {
    const { deck, columns } = populateCards();
    const newState = {
      deck,
      columns,
      completedColumns: getInitialCompletedCoulmns(),
      selectedCardIndex: -1,
      sourceColumnIndex: -1,
      destinationColumnIndex: -1,
      steps: 0,
      score: 0,
    };

    _setState(newState);
  };

  useEffect(() => {
    const higestScore = Number(localStorage.getItem("score"));

    _setState({
      higestScore,
    });
  }, []);

  const noOfDecks = Math.floor(state.deck.length / state.columns.length);
  let decksJsx = new Array(noOfDecks).fill(0, 0).map((_, index) => {
    let jsx = null;

    if (index === noOfDecks - 1) {
      jsx = (
        <button
          className="cardDeck cardDeckButton"
          onClick={addCardFromDeck}
          style={{
            position: "absolute",
            top: 0,
            left: `${(index + 1) * 25}px`,
          }}
        />
      );
    } else {
      jsx = (
        <div
          className="cardDeck"
          style={{
            position: "absolute",
            top: 0,
            left: `${(index + 1) * 25}px`,
          }}
        />
      );
    }

    return jsx;
  });

  return (
    <div className="app">
      <Navbar
        onRestart={handleRestart}
        score={state.score}
        highScore={state.higestScore}
        steps={state.steps}
      />
      <div className="main">
        <div className="firstSection">
          <div className="cardsDeckRoot">{decksJsx}</div>

          <div>
            <CompletedColumns columns={state.completedColumns} />
          </div>
        </div>
        <div className="columns">
          {state.columns.map((column, index) => (
            <div className="column_item">
              <Column
                column={column}
                columnIndex={index}
                state={state}
                setState={setState}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
