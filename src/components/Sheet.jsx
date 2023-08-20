import React, { useState, useCallback, Fragment } from "react";
import { create, all } from "mathjs";

import Cell from "./Cell";
import { Sheet as StyledSheet } from "./styles";

const math = create(all);

const getColumnName = (index) => String.fromCharCode(64 + index);

const Sheet = ({ numberOfRows, numberOfColumns }) => {
  const [data, setData] = useState({});

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
        const formula = cellContent.substring(1); // Remove the "="

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
