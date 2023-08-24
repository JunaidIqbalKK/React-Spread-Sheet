import { createContext, useState, useCallback } from "react";
import { create, all } from "mathjs";

const math = create(all);

export const SheetContext = createContext(null);

export function SheetData({ children }) {
  const [data, setData] = useState({});
  const [selectedCell, setSelectedCell] = useState({ row: 1, column: 1 });
  const [editCell, setEditCell] = useState(null);
  const [originalCellValue, setOriginalCellValue] = useState(null);
  const [numberOfRow, setNumberOfRow] = useState(15);
  const [numberOfColumn, setNumberOfColumn] = useState(15);

  const getColumnName = (index) => {
    let columnName = "";
    while (index > 0) {
      const remainder = (index - 1) % 26;
      columnName = String.fromCharCode(65 + remainder) + columnName;
      index = Math.floor((index - 1) / 26);
    }
    return columnName;
  };

  const setCellValue = useCallback(
    ({ row, column, value }) => {
      const newData = { ...data };
      newData[`${column}${row}`] = value;
      setData(newData);
    },
    [data]
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

  const handleRow = (rowIndex, action) => {
    const newData = { ...data };

    for (let colIndex = 0; colIndex < numberOfColumn; colIndex++) {
      if (action === "addAbove") {
        for (let i = numberOfRow; i > rowIndex; i--) {
          const currentValue = newData[`${getColumnName(colIndex)}${i - 1}`];
          newData[`${getColumnName(colIndex)}${i}`] = currentValue;
        }
        newData[`${getColumnName(colIndex)}${rowIndex}`] = "";
      }
      if (action === "addBelow") {
        for (let i = numberOfRow; i >= rowIndex; i--) {
          const currentValue = newData[`${getColumnName(colIndex)}${i}`];
          newData[`${getColumnName(colIndex)}${i + 1}`] = currentValue;
        }
        newData[`${getColumnName(colIndex)}${rowIndex + 1}`] = "";
      }
      if (action === "delete") {
        for (let i = rowIndex; i < numberOfRow - 1; i++) {
          const currentValue = newData[`${getColumnName(colIndex)}${i + 1}`];
          newData[`${getColumnName(colIndex)}${i}`] = currentValue;
        }
        delete newData[`${getColumnName(colIndex)}${numberOfRow - 1}`];
      }
    }

    setData(newData);
    setNumberOfRow(action === "delete" ? numberOfRow - 1 : numberOfRow + 1);
  };

  const handleColumn = (columnIndex, action) => {
    const newData = { ...data };
    for (let rowIndex = 0; rowIndex < numberOfRow; rowIndex++) {
      if (action === "addBefore") {
        for (let j = numberOfColumn; j > columnIndex; j--) {
          const currentValue = newData[`${getColumnName(j - 1)}${rowIndex}`];
          newData[`${getColumnName(j)}${rowIndex}`] = currentValue;
        }
        newData[`${getColumnName(columnIndex)}${rowIndex}`] = "";
      }
      if (action === "addAfter") {
        for (let j = numberOfColumn; j >= columnIndex; j--) {
          const currentValue = newData[`${getColumnName(j)}${rowIndex}`];
          newData[`${getColumnName(j + 1)}${rowIndex}`] = currentValue;
        }
        newData[`${getColumnName(columnIndex + 1)}${rowIndex}`] = "";
      }
      if (action === "delete") {
        for (let j = columnIndex; j < numberOfColumn - 1; j++) {
          const currentValue = newData[`${getColumnName(j + 1)}${rowIndex}`];
          newData[`${getColumnName(j)}${rowIndex}`] = currentValue;
        }
        delete newData[`${getColumnName(numberOfColumn - 1)}${rowIndex}`];
      }
    }
    setData(newData);
    setNumberOfColumn(
      action === "delete" ? numberOfColumn - 1 : numberOfColumn + 1
    );
  };

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

  return (
    <SheetContext.Provider
      value={{
        data,
        setData,
        selectedCell,
        setSelectedCell,
        editCell,
        setEditCell,
        originalCellValue,
        setOriginalCellValue,
        numberOfRow,
        setNumberOfRow,
        numberOfColumn,
        setNumberOfColumn,
        getColumnName,
        setCellValue,
        computeCell,
        handleRow,
        handleColumn,
        handleKeyDown,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}
