import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoutes";
import LoginPage from "./pages/auth/Login";
import "./App.css";
import Layout from "./components/AppLayout";
import { useThemeContext } from "./context/ThemeContext";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import HistoryReports from "./pages/Reports/HistoryReports";
import Invoices from "./pages/Invoices";

function App() {
  const { theme } = useThemeContext();

  const isDarkMode = theme === "dark";

  const appClassName = isDarkMode ? "text-white bg-black" : "";
  return (
    <div className={"text-black bg-white dark:bg-black dark:text-white"}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Reports />} />
              <Route path="history" element={<HistoryReports />} />
              <Route path="invoices" element={<Invoices />} />

              {/* Profile link routes */}
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
