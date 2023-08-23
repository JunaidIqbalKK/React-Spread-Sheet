import React, {
  useCallback,
  useState,
  memo,
  useMemo,
  useEffect,
  useRef,
  useContext,
} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { SheetContext } from "./context/SheetData";
import { Input } from "./styles";

const Cell = ({
  rowIndex,
  columnIndex,
  columnName,
  setCellValue,
  currentValue,
  isEditing,
  selected,
}) => {
  const [edit, setEdit] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const {
    setSelectedCell,
    setEditCell,
    originalCellValue,
    setOriginalCellValue,
    computeCell,
    addRowAbove,
    addRowBelow,
    deleteRow,
    addColumnBefore,
    addColumnAfter,
    deleteColumn,
  } = useContext(SheetContext);

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
    return (
      <Button
        variant="secondary"
        style={{ width: "70px", borderRadius: "0px" }}
      ></Button>
    );
  }

  if (columnIndex === 0) {
    return (
      <Dropdown as={ButtonGroup} style={{ width: "70px", height: "25px" }}>
        <Button variant="secondary" size="sm" style={{ borderRadius: "0px" }}>
          {rowIndex}
        </Button>
        <Dropdown.Toggle
          split
          variant="secondary"
          size="sm"
          id="dropdown-split-basic"
          style={{ borderRadius: "0px" }}
        />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => addRowAbove(rowIndex)}>
            Add a row above
          </Dropdown.Item>
          <Dropdown.Item onClick={() => addRowBelow(rowIndex)}>
            Add a row below
          </Dropdown.Item>
          <Dropdown.Item onClick={() => deleteRow(rowIndex)}>
            Delete row
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  if (rowIndex === 0) {
    return (
      <Dropdown as={ButtonGroup}>
        <Button variant="secondary" size="sm" style={{ borderRadius: "0px" }}>
          {columnName}
        </Button>
        <Dropdown.Toggle
          split
          variant="secondary"
          size="sm"
          id="dropdown-split-basic"
          style={{ borderRadius: "0px" }}
        />
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => addColumnBefore(columnIndex)}>
            Add a column before
          </Dropdown.Item>
          <Dropdown.Item onClick={() => addColumnAfter(columnIndex)}>
            Add a column after
          </Dropdown.Item>
          <Dropdown.Item onClick={() => deleteColumn(columnIndex)}>
            Delete column
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
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
