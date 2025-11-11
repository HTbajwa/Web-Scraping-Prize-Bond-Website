import React from "react";
import {BrowserRouter,Route,Routes} from "react-router-dom"
import BondCheck from "./BondCheck";
import Newfile1 from "./newfile1";
const App = () => {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<BondCheck />} />
         <Route path="/newfile1" element={<Newfile1 />} />
    </Routes>
    </BrowserRouter>
  
    </>
  );
};

export default App;
