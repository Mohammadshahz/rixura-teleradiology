import LegalPage from "../../LegalPage";

const PrivacyPolicy = () => {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="How Rixura collects, uses and protects your personal and health information."
      contactHeading="Questions about your privacy?"
    >
      <p>
        At Rixura, we value your privacy and are committed to protecting your personal and health information. This Privacy Policy outlines how we collect, use, and safeguard the information you provide to us.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li>Personal details (name, email, phone number)</li>
        <li>Medical records and images shared for radiological reporting</li>
        <li>Usage data such as device info, browser, IP address</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>The data we collect is used to:</p>
      <ul>
        <li>Deliver accurate and timely radiology reports</li>
        <li>Provide customer support and improve our services</li>
        <li>Ensure compliance with medical and data privacy regulations</li>
      </ul>

      <h2>3. Data Sharing &amp; Confidentiality</h2>
      <p>
        We do not sell, rent, or share your personal or medical data with third parties without your explicit consent, except:
      </p>
      <ul>
        <li>To authorized healthcare professionals involved in your care</li>
        <li>To comply with legal or regulatory obligations</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We use secure servers, data encryption, access controls, and other industry-standard safeguards to protect your personal and medical data from unauthorized access or disclosure.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your data only as long as necessary to fulfill the purposes outlined in this policy or as required by law and healthcare regulations.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You have the right to access, update, or delete your personal data at any time. You may also request a copy of your health records shared with us.
      </p>

      <h2>7. Cookies &amp; Tracking</h2>
      <p>
        Our website may use cookies for session management and analytics. You can modify your browser settings to decline cookies if you prefer.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated effective date.
      </p>
    </LegalPage>
  );
};

export default PrivacyPolicy;
