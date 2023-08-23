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

  const getColumnName = (index) => String.fromCharCode(64 + index);

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

  const addRowAbove = (rowIndex) => {
    const newData = { ...data };
    for (let colIndex = 0; colIndex < numberOfColumn; colIndex++) {
      for (let i = numberOfRow; i > rowIndex; i--) {
        const currentValue = newData[`${getColumnName(colIndex)}${i - 1}`];
        newData[`${getColumnName(colIndex)}${i}`] = currentValue;
      }
      newData[`${getColumnName(colIndex)}${rowIndex}`] = "";
    }
    setData(newData);
    setNumberOfRow(numberOfRow + 1);
  };

  const addRowBelow = (rowIndex) => {
    const newData = { ...data };
    for (let colIndex = 0; colIndex < numberOfColumn; colIndex++) {
      for (let i = numberOfRow; i >= rowIndex; i--) {
        const currentValue = newData[`${getColumnName(colIndex)}${i}`];
        newData[`${getColumnName(colIndex)}${i + 1}`] = currentValue;
      }
      newData[`${getColumnName(colIndex)}${rowIndex + 1}`] = "";
    }
    setData(newData);
    setNumberOfRow(numberOfRow + 1);
  };

  const deleteRow = (rowIndex) => {
    if (numberOfRow > 1) {
      const newData = { ...data };
      for (let colIndex = 0; colIndex < numberOfColumn; colIndex++) {
        for (let i = rowIndex; i < numberOfRow - 1; i++) {
          const currentValue = newData[`${getColumnName(colIndex)}${i + 1}`];
          newData[`${getColumnName(colIndex)}${i}`] = currentValue;
        }
        delete newData[`${getColumnName(colIndex)}${numberOfRow - 1}`];
      }
      setData(newData);
      setNumberOfRow(numberOfRow - 1);
    }
  };

  const addColumnBefore = (columnIndex) => {
    const newData = { ...data };
    for (let rowIndex = 0; rowIndex < numberOfRow; rowIndex++) {
      for (let j = numberOfColumn; j > columnIndex; j--) {
        const currentValue = newData[`${getColumnName(j - 1)}${rowIndex}`];
        newData[`${getColumnName(j)}${rowIndex}`] = currentValue;
      }
      newData[`${getColumnName(columnIndex)}${rowIndex}`] = "";
    }
    setData(newData);
    setNumberOfColumn(numberOfColumn + 1);
  };

  const addColumnAfter = (columnIndex) => {
    const newData = { ...data };
    for (let rowIndex = 0; rowIndex < numberOfRow; rowIndex++) {
      for (let j = numberOfColumn; j >= columnIndex; j--) {
        const currentValue = newData[`${getColumnName(j)}${rowIndex}`];
        newData[`${getColumnName(j + 1)}${rowIndex}`] = currentValue;
      }
      newData[`${getColumnName(columnIndex + 1)}${rowIndex}`] = "";
    }
    setData(newData);
    setNumberOfColumn(numberOfColumn + 1);
  };

  const deleteColumn = (columnIndex) => {
    if (numberOfColumn > 1) {
      const newData = { ...data };
      for (let rowIndex = 0; rowIndex < numberOfRow; rowIndex++) {
        for (let j = columnIndex; j < numberOfColumn - 1; j++) {
          const currentValue = newData[`${getColumnName(j + 1)}${rowIndex}`];
          newData[`${getColumnName(j)}${rowIndex}`] = currentValue;
        }
        delete newData[`${getColumnName(numberOfColumn - 1)}${rowIndex}`];
      }
      setData(newData);
      setNumberOfColumn(numberOfColumn - 1);
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
        computeCell,
        addRowAbove,
        addRowBelow,
        deleteRow,
        addColumnBefore,
        addColumnAfter,
        deleteColumn,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}
