import React, { useState, useCallback, Fragment, useEffect } from "react";
import { create, all } from "mathjs";

import Cell from "./Cell";
import { Sheet as StyledSheet } from "./styles";

const math = create(all);

const getColumnName = (index) => String.fromCharCode(64 + index);

const Sheet = ({ numberOfRows, numberOfColumns }) => {
  const [data, setData] = useState({});
  const [selectedCell, setSelectedCell] = useState({ row: 1, column: 1 });
  const [editCell, setEditCell] = useState(null);

  const setCellValue = useCallback(
    ({ row, column, value }) => {
      const newData = { ...data };
      newData[`${column}${row}`] = value;
      setData(newData);
    },
    [data, setData]
  );

  const computeCell = useCallback(
    ({ row, column }) => {
      const cellContent = data[`${column}${row}`];

      if (!cellContent) {
        return "";
      }

      if (cellContent.startsWith("=")) {
        const formula = cellContent.substring(1); // Removing the "="

        try {
          const evaluatedFormula = formula
            .split(/([+*-/%])/g)
            .map((part) => {
              if (/^[A-Za-z][0-9]$/g.test(part)) {
                const referencedValue = data[part.toUpperCase()] || 0;
                return referencedValue;
              }
              return part;
            })
            .join("");

          const evaluatedValue = math.evaluate(evaluatedFormula, data);
          return evaluatedValue.toString();
        } catch (error) {
          return "ERROR!";
        }
      }

      return cellContent;
    },
    [data]
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
              row: Math.min(prevSelectedCell.row + 1, numberOfRows - 1),
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
              column: Math.min(
                prevSelectedCell.column + 1,
                numberOfColumns - 1
              ),
            }));
          }
          break;
        case "F2":
          setEditCell(selectedCell);
          break;
        case "Escape":
          if (editCell) {
            setEditCell(null);
            const { row, column } = editCell;
            setCellValue({
              row,
              column,
              value: data[`${getColumnName(column)}${row}`],
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
          if (selectedCell) {
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
    numberOfRows,
    numberOfColumns,
    editCell,
    setCellValue,
    data,
    selectedCell,
  ]);

  return (
    <StyledSheet numberofcolumns={numberOfColumns}>
      {Array(numberOfRows)
        .fill()
        .map((m, i) => {
          return (
            <Fragment key={i}>
              {Array(numberOfColumns)
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
                      computeCell={computeCell}
                      setSelectedCell={setSelectedCell}
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
