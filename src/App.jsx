import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import ColorBlobBackground from "./components/ColorBlobBackground";
import Form from "./components/Form";
function App() {
  return (
    <div className="bg-white text-black absolute flex justify-center">
      <ColorBlobBackground />
      <Form />
    </div>
  );
}

export default App;
