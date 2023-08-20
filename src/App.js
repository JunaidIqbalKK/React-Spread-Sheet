import React from "react";
import { Reset } from "styled-reset";

import Sheet from "./components/Sheet";

const App = () => {
  return (
    <>
      <Reset />
      <Sheet numberOfRows={15} numberOfColumns={15} />
    </>
  );
};

export default App;
