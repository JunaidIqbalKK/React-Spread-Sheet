import React, {
  useCallback,
  useState,
  memo,
  useMemo,
  useEffect,
  useRef,
} from "react";

import { Input, Header } from "./styles";

const Cell = ({
  rowIndex,
  columnIndex,
  columnName,
  setCellValue,
  computeCell,
  currentValue,
  originalCellValue,
  setOriginalCellValue,
  setSelectedCell,
  setEditCell,
  isEditing,
  selected,
}) => {
  const [edit, setEdit] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const inputRef = useRef(null);

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    setSelectedCell({
      row: rowIndex,
      column: columnIndex,
    });
    setOriginalCellValue(currentValue);

    setTimeout(() => {
      if (clickCount === 1) {
        setEdit(true);
        setEditCell({
          row: rowIndex,
          column: columnIndex,
        });
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
    if (event.key === "Escape" && edit) {
      setEdit(false);
      setCellValue({
        row: rowIndex,
        column: columnName,
        value: originalCellValue,
      });
    }
  };

  const value = useMemo(() => {
    if (edit || isEditing) {
      return currentValue || "";
    }
    return computeCell({ row: rowIndex, column: columnName });
  }, [edit, isEditing, currentValue, rowIndex, columnName, computeCell]);

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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

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
      ref={inputRef}
      onBlur={handleBlur}
      readOnly={!edit && !isEditing}
      value={value}
      type="text"
      onChange={handleChange}
      style={{
        backgroundColor:
          selected || edit || isEditing ? "#e7f2f8" : "transparent",
        border: edit ? "1px solid #1581ba" : "1px solid #ccc",
        outline: selected ? "2px solid #1581ba" : "none",
      }}
    />
  );
};

export default memo(Cell);
