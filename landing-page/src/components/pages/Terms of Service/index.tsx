import { Link } from "react-router-dom";
import LegalPage from "../../LegalPage";

const TermsOfService = () => {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using Rixura's website and teleradiology services."
      contactHeading="Questions about these terms?"
    >
      <p>
        Welcome to Rixura. By accessing or using our website and services, you agree to be bound by the following Terms of Service. If you do not agree to these terms, please do not use our platform.
      </p>

      <h2>1. Use of Services</h2>
      <p>
        Rixura provides teleradiology services to licensed healthcare institutions and professionals. You agree to use our services only for lawful and authorized purposes, and in accordance with all applicable laws and medical regulations.
      </p>

      <h2>2. User Responsibilities</h2>
      <p>
        You are responsible for maintaining the confidentiality of your access credentials and for any activities that occur under your account. Any misuse or unauthorized access should be reported immediately.
      </p>

      <h2>3. Medical Disclaimer</h2>
      <p>
        Rixura does not provide medical treatment. Our services are limited to radiological interpretations provided by qualified radiologists. All medical decisions and patient care remain the responsibility of the treating physician or institution.
      </p>

      <h2>4. Intellectual Property</h2>
      <p>
        All content on this site, including logos, graphics, software, and reports, are the property of Rixura and are protected by copyright and intellectual property laws. You may not reproduce, distribute, or use any content without written consent.
      </p>

      <h2>5. Privacy Policy</h2>
      <p>
        By using our services, you also agree to our <Link to="/privacy">Privacy Policy</Link>. We take data protection seriously and ensure compliance with HIPAA and other relevant regulations.
      </p>

      <h2>6. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your access to our services at any time, without prior notice, if we believe you have violated these terms or engaged in unlawful activities.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        Rixura will not be liable for any indirect, incidental, or consequential damages arising out of your use or inability to use our services. Our total liability is limited to the amount paid for the service in question.
      </p>

      <h2>8. Changes to Terms</h2>
      <p>
        We may update these Terms of Service at any time. It is your responsibility to review this page periodically. Continued use of our services constitutes acceptance of any changes.
      </p>
    </LegalPage>
  );
};

export default TermsOfService;
