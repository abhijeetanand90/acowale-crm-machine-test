import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import FeedbackPage from "./pages/FeedbackPage";
import AdminDashboard from "./pages/AdminDashboard";
import WithNav from "./component/WithNav";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<WithNav />}>
            <Route path="/" element={<FeedbackPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;