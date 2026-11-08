import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoutes";
import LoginPage from "./pages/auth/Login";
import "./App.css";
import Layout from "./components/AppLayout";
import Reports from "./pages/Reports/Reports";
import Profile from "./pages/Profile";
import HistoryReports from "./pages/History/HistoryReports";
import Invoices from "./pages/Invoices";
import NotFound from "./pages/NotFound";
import DwvComponent from "./DwvComponent/index";
import Templates from "./pages/Templates/Templates";
import AddTemplate from "./pages/Templates/AddTemplate";
import EditTemplate from "./pages/Templates/EditTemplate";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected block */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Reports />} />
          <Route path="history" element={<HistoryReports />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="profile" element={<Profile />} />
          <Route path="templates" element={<Templates />} />
          <Route path="templates/add" element={<AddTemplate />} />
          <Route path="templates/edit/:id" element={<EditTemplate />} />
        </Route>
      </Route>

      {/* Public/Fallback routes (not protected) */}
      <Route path="/diacom-viewer/:id" element={<DwvComponent />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
