import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SubjectShow from "./pages/SubjectShow";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subjects/:id" element={<SubjectShow />} />
      </Routes>
    </BrowserRouter>
  );
}
