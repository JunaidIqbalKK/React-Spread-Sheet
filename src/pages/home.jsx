import React from "react";
import { Reset } from "styled-reset";

import { SheetData } from "./context/SheetData";
import Sheet from "./components/Sheet";

const Home = () => {
  return (
    <SheetData>
      <Reset />
      <Sheet />
    </SheetData>
  );
};

export default Home;
