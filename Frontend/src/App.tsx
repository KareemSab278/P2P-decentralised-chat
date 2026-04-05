import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignIn } from "./Pages/SignIn";
import { Home } from "./Pages/Home";
import { Chat } from "./Pages/Chat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
