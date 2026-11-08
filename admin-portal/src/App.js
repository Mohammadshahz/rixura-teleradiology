import { Route, Routes } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/auth/Login";
import PrivateRoute from "./components/PrivateRoutes";
import Layout from "./components/AppLayout";
import Patients from "./pages/Patient/Patients";
import AddPatient from "./pages/Patient/AddPatient";
import EditPatient from "./pages/Patient/EditPatient";
import Profile from "./pages/Profile";
import Centre from "./pages/Centre/Centre";
import AddCentre from "./pages/Centre/AddCentre";
import EditCentre from "./pages/Centre/EditCentre";
import Radiologist from "./pages/Radiologist/Radiologist";
import AddRadiologist from "./pages/Radiologist/AddRadiologist";
import EditRadiologist from "./pages/Radiologist/EditRadiologist";
import Feedback from "./pages/Feedback/Feedback";
import Templates from "./pages/Templates/Templates";
import FeedbackDetails from "./pages/Feedback/FeedbackDetails";
import AddTemplate from "./pages/Templates/AddTemplate";
import EditTemplate from "./pages/Templates/EditTemplate";
import Dashboard from "./pages/Dashboard/Dashboard";
import Reports from "./pages/Reports/Reports";
import Invoices from "./pages/Invoices";
import ResetPassword from "./pages/Profile/ResetPassword";
import DwvComponent from "./DwvComponent";
import InvoiceById from "./pages/Invoices/InvoiceById";
import Contact from "./pages/Contact/Contact";
import ContactDetails from "./pages/Contact/ContactDetails";

function App() {
  return (
    <div className={"text-black bg-white dark:bg-black dark:text-white"}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />

            <Route path="patients" element={<Patients />} />
            <Route path="patients/add" element={<AddPatient />} />
            <Route path="patients/edit/:id" element={<EditPatient edit />} />

            <Route path="center" element={<Centre />} />
            <Route path="center/add" element={<AddCentre />} />
            <Route path="center/edit/:id" element={<EditCentre edit />} />
            <Route path="center/reset-password" element={<ResetPassword />} />
            <Route path="center/invoice/:userId" element={<InvoiceById />} />

            <Route path="radiologist" element={<Radiologist />} />
            <Route path="radiologist/add" element={<AddRadiologist />} />
            <Route path="radiologist/edit/:id" element={<EditRadiologist />} />
            <Route
              path="radiologist/reset-password"
              element={<ResetPassword />}
            />
            <Route
              path="radiologist/invoice/:userId"
              element={<InvoiceById />}
            />

            <Route path="feedback" element={<Feedback />} />
            <Route path="feedback/:id" element={<FeedbackDetails />} />

            <Route path="profile" element={<Profile />} />
            <Route path="profile/reset-password" element={<ResetPassword />} />

            <Route path="templates" element={<Templates />} />
            <Route path="templates/add" element={<AddTemplate />} />
            <Route path="templates/edit/:id" element={<EditTemplate />} />

            <Route path="invoice" element={<Invoices />} />
            <Route path="invoice/:userId" element={<InvoiceById />} />

            <Route path="reports" element={<Reports />} />

            <Route path="contact" element={<Contact />} />
            <Route path="contact/:id" element={<ContactDetails />} />
          </Route>
          <Route path="diacom-viewer/:id" element={<DwvComponent />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
