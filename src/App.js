import React, { useState } from "react";
import { Reset } from "styled-reset";

import Sheet from "./components/Sheet";

const App = () => {
  const [numberOfRows, setNumberOfRows] = useState(15);
  const [numberOfColumns, setNumberOfColumns] = useState(15);

  const addRow = () => {
    setNumberOfRows(numberOfRows + 1);
  };

  const deleteRow = () => {
    if (numberOfRows > 1) {
      setNumberOfRows(numberOfRows - 1);
    }
  };

  const addColumn = () => {
    setNumberOfColumns(numberOfColumns + 1);
  };

  const deleteColumn = () => {
    if (numberOfColumns > 1) {
      setNumberOfColumns(numberOfColumns - 1);
    }
  };

  return (
    <>
      <Reset />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div style={{ marginLeft: "300px" }}>
          <button onClick={addRow}>Add Row</button>
          <button onClick={deleteRow}>Delete Row</button>
        </div>
        <div style={{ marginLeft: "auto", marginRight: "300px" }}>
          <button onClick={addColumn}>Add Column</button>
          <button onClick={deleteColumn}>Delete Column</button>
        </div>
      </div>
      <Sheet numberOfRows={numberOfRows} numberOfColumns={numberOfColumns} />
    </>
  );
};

export default App;
