import React, { useCallback, Fragment, useEffect, useContext } from "react";
import { SheetContext } from "./context/SheetData";
import Cell from "./Cell";
import { Sheet as StyledSheet } from "./styles";

const Sheet = () => {
  const {
    data,
    setData,
    selectedCell,
    setSelectedCell,
    editCell,
    setEditCell,
    originalCellValue,
    setOriginalCellValue,
    getColumnName,
    numberOfRow,
    numberOfColumn,
  } = useContext(SheetContext);

  const setCellValue = useCallback(
    ({ row, column, value }) => {
      const newData = { ...data };
      newData[`${column}${row}`] = value;
      setData(newData);
    },
    [data, setData]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      switch (key) {
        case "ArrowUp":
          if (!editCell) {
            setSelectedCell((prevSelectedCell) => ({
              row: Math.max(prevSelectedCell.row - 1, 1),
              column: prevSelectedCell.column,
            }));
          }
          break;
        case "ArrowDown":
          if (!editCell) {
            setSelectedCell((prevSelectedCell) => ({
              row: Math.min(prevSelectedCell.row + 1, numberOfRow - 1),
              column: prevSelectedCell.column,
            }));
          }
          break;
        case "ArrowLeft":
          if (!editCell) {
            setSelectedCell((prevSelectedCell) => ({
              row: prevSelectedCell.row,
              column: Math.max(prevSelectedCell.column - 1, 1),
            }));
          }
          break;
        case "ArrowRight":
          if (!editCell) {
            setSelectedCell((prevSelectedCell) => ({
              row: prevSelectedCell.row,
              column: Math.min(prevSelectedCell.column + 1, numberOfColumn - 1),
            }));
          }
          break;
        case "F2":
          setEditCell(selectedCell);
          setOriginalCellValue(
            data[`${getColumnName(selectedCell.column)}${selectedCell.row}`]
          );
          break;
        case "Escape":
          if (editCell) {
            setEditCell(null);
            setCellValue({
              row: selectedCell.row,
              column: getColumnName(selectedCell.column),
              value: originalCellValue,
            });
          }
          break;
        case "Enter":
          if (editCell) {
            const { row, column } = editCell;
            setCellValue({
              row,
              column,
              value: data[`${getColumnName(column)}${row}`],
            });
            setEditCell(null);
          }
          break;
        case "Delete":
          if (selectedCell && !editCell) {
            setCellValue({
              row: selectedCell.row,
              column: getColumnName(selectedCell.column),
              value: "",
            });
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    numberOfRow,
    numberOfColumn,
    getColumnName,
    editCell,
    setEditCell,
    setCellValue,
    originalCellValue,
    setOriginalCellValue,
    data,
    selectedCell,
    setSelectedCell,
  ]);

  useEffect(() => {}, [numberOfRow, numberOfColumn]);

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
                      setCellValue={setCellValue}
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
