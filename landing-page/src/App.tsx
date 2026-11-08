import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PageLayout from "./components/Layout/PageLayout";
import Home from "./components/pages/HomePage";
import AboutUs from "./components/pages/AboutUs";
import TermsOfService from "./components/pages/Terms of Service";
import PrivacyPolicy from "./components/pages/Privacy Policy";
import RefundPolicy from "./components/pages/Refund Policy";
import ScrollToTop from "./components/ScrollToTop";
import PageMeta from "./components/PageMeta";
import FaqSection from "./components/pages/FAQs";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="overflow-x-hidden w-full">
      <ScrollToTop />
      <PageMeta />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
        </Route>
        <Route element={<PageLayout />}>
          <Route path="/tos" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/faqs" element={<FaqSection />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

      <WhatsAppFloatingButton />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
