import LegalPage from "../../LegalPage";

const RefundPolicy = () => {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund Policy"
      subtitle="When refunds apply and how to request one."
      contactHeading="Need help with a refund?"
    >
      <p>
        At Rixura, we strive to provide high-quality, timely, and accurate teleradiology services. We understand that sometimes issues may arise, and we aim to address them fairly. This Refund Policy outlines the terms under which refunds may be considered.
      </p>

      <h2>1. Eligibility for Refunds</h2>
      <p>Refunds are only considered in the following scenarios:</p>
      <ul>
        <li>Duplicate payment for the same report or service</li>
        <li>Technical issues on our platform that prevent report delivery</li>
        <li>Service not delivered within the guaranteed turnaround time without prior notification or valid reason</li>
      </ul>

      <h2>2. Non-Refundable Situations</h2>
      <p>Refunds will not be issued for the following:</p>
      <ul>
        <li>Change of mind after the report has been initiated or delivered</li>
        <li>Delays caused by incomplete, poor-quality, or incorrect imaging data</li>
        <li>Services provided free of charge or as a complimentary benefit</li>
      </ul>

      <h2>3. Requesting a Refund</h2>
      <p>
        To request a refund, please contact our support team within <strong>7 days</strong> of the transaction. You must provide:
      </p>
      <ul>
        <li>Transaction ID</li>
        <li>Patient name and report reference</li>
        <li>Detailed reason for the refund request</li>
      </ul>
      <p>
        Refund requests will be reviewed within 5–7 business days. If approved, the amount will be credited back to your original payment method within 7–10 working days.
      </p>
    </LegalPage>
  );
};

export default RefundPolicy;
