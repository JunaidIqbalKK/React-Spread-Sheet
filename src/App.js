import React from "react";
import { Reset } from "styled-reset";

import { SheetData } from "./components/context/SheetData";
import Sheet from "./components/Sheet";

const App = () => {
  return (
    <SheetData>
      <Reset />
      <Sheet numberOfRows={15} numberOfColumns={15} />
    </SheetData>
  );
};

export default App;
