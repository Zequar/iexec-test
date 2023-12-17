import "./App.css";
import { Route, Routes } from "react-router-dom";

import AuthorizePage from "./components/AuthorizePage";

function App() {
  return (
    <Routes>
      <Route path="/authorize" element={<AuthorizePage />} />
      <Route path="/" element={<AuthorizePage />} />
    </Routes>
  );
}

export default App;
