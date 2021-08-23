import React from "react";
import Card from "./card";

const CompletedColumns = ({ columns }) => {
  return (
    <div className="completedColumns">
      {columns.map((column) => (
        <div className="compltedColumnItem">
          <>
            {!column.isCompleted ? (
              <div className="notCompletedColumn" />
            ) : (
              <div className="completedColumn">
                {column.column.map((card, index) => (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                    }}
                  >
                    <Card card={card} />
                  </div>
                ))}
              </div>
            )}
          </>
        </div>
      ))}
    </div>
  );
};

export default CompletedColumns;
