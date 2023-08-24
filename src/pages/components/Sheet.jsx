import React, { Fragment, useEffect, useContext } from "react";
import { SheetContext } from "../context/SheetData";
import Cell from "./Cell";
import { Sheet as StyledSheet } from "./styles";

const Sheet = () => {
  const {
    data,
    handleKeyDown,
    selectedCell,
    editCell,
    getColumnName,
    numberOfRow,
    numberOfColumn,
  } = useContext(SheetContext);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <StyledSheet numberofcolumns={numberOfColumn}>
      {Array(numberOfRow)
        .fill()
        .map((m, i) => {
          return (
            <Fragment key={i}>
              {Array(numberOfColumn)
                .fill()
                .map((n, j) => {
                  const columnName = getColumnName(j);
                  return (
                    <Cell
                      rowIndex={i}
                      columnIndex={j}
                      columnName={columnName}
                      currentValue={data[`${columnName}${i}`]}
                      isEditing={
                        editCell && editCell.row === i && editCell.column === j
                      }
                      selected={
                        i === selectedCell.row && j === selectedCell.column
                      }
                      key={`${columnName}${i}`}
                    />
                  );
                })}
            </Fragment>
          );
        })}
    </StyledSheet>
  );
};

export default Sheet;
