
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import "./App.css";
import Layout from "./components/AppLayout";

import HistoryReports from "./pages/History/HistoryReports";
import Invoices from "./pages/Invoices";
import DwvComponent from "./DwvComponent";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Profile from "./pages/Profile/Profile";
import Reports from "./pages/Report/Reports";
import AddReport from "./pages/Report/AddReport";
import Patients from "./pages/Patient/Patients";
import AddPatient from "./pages/Patient/AddPatient";
import EditPatient from "./pages/Patient/EditPatient";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Reports />} />
          <Route path="/reports/add" element={<AddReport />} />
          <Route path="/reports/edit/:reportId" element={<AddReport edit />} />

          <Route path="patients" element={<Patients />} />
          <Route path="patients/add" element={<AddPatient />} />
          <Route path="patients/edit/:id" element={<EditPatient edit />} />

          <Route path="history" element={<HistoryReports />} />

          <Route path="invoice" element={<Invoices />} />

          {/* Profile link routes */}
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Diacom route */}
        <Route path="/diacom-viewer/:id" element={<DwvComponent />} />
        {/* Catch all redirect to 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
