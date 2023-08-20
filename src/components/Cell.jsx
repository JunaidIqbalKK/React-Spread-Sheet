import React, { useCallback, useState, memo, useMemo } from "react";

import { Input, Header } from "./styles";

const Cell = ({
  rowIndex,
  columnIndex,
  columnName,
  setCellValue,
  computeCell,
  currentValue,
}) => {
  const [edit, setEdit] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);

    setTimeout(() => {
      if (clickCount === 1) {
        setEdit(true);
      }
      setClickCount(0);
    }, 300);

    if (clickCount === 2) {
      setEdit(true);
      setClickCount(0);
    }
  };

  const handleBlur = () => {
    setEdit(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setEdit(false);
    }
  };

  const value = useMemo(() => {
    if (edit) {
      return currentValue || "";
    }
    return computeCell({ row: rowIndex, column: columnName });
  }, [edit, currentValue, rowIndex, columnName, computeCell]);

  const handleChange = useCallback(
    (event) => {
      setCellValue({
        row: rowIndex,
        column: columnName,
        value: event.target.value,
      });
    },
    [rowIndex, columnName, setCellValue]
  );

  if (columnIndex === 0 && rowIndex === 0) {
    return <Header />;
  }

  if (columnIndex === 0) {
    return <Header>{rowIndex}</Header>;
  }

  if (rowIndex === 0) {
    return <Header>{columnName}</Header>;
  }

  return (
    <Input
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      readOnly={!edit}
      value={value}
      type="text"
      onChange={handleChange}
      style={{
        backgroundColor: edit ? "#e7f2f8" : "transparent",
        border: edit ? "1px solid #1581ba" : "1px solid #ccc",
      }}
    />
  );
};

export default memo(Cell);
