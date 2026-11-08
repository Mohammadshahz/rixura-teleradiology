import React from 'react';
import './ReportTemplate.css';

// Helper function to format date
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// Main component that generates HTML to be converted to PDF
const ReportTemplate = ({ patient, centre, report, templateData, footerItems = [] }) => {
  // Clean HTML string if necessary
  const sanitizeHTML = (html) => {
    if (!html) return '';
    
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  };

  const footerText = footerItems.length
    ? `Services Offered: ${footerItems.join(" | ")}`
    : "";

  return (
    <div className="report-container">
      {/* Header with Center Information */}
      <div className="report-header">
        <div className="header-content">
          <h1 className="center-name">{centre.name}</h1>
          <p className="center-tag">Diagnostic center and speciality clinic</p>
          <p className="center-details">{centre.address}</p>
          <p className="center-details">
            Phone: {Array.isArray(centre.contacts) ? centre.contacts.join(" / ") : centre.contacts}
          </p>
        </div>
        {centre.logoVisible && (
          <div className="logo-container">
            <img 
              src={centre.logo} 
              alt="Center Logo" 
              className="center-logo"
              crossOrigin="anonymous"
            />
          </div>
        )}
      </div>

      <div className="divider"></div>

      {/* Patient Information Card */}
      <div className="patient-card">
        <div className="info-row">
          <div className="info-item">
            <span className="info-label">Patient Name:</span>
            <span className="info-value">{patient.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">PID:</span>
            <span className="info-value">{patient.id}</span>
          </div>
        </div>
        <div className="info-row">
          <div className="info-item">
            <span className="info-label">Refer By:</span>
            <span className="info-value">{patient.referredBy}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Age / Gender:</span>
            <span className="info-value">{patient.age} Yrs / {patient.gender}</span>
          </div>
        </div>
        <div className="info-row">
          <div className="info-item">
            <span className="info-label">Department:</span>
            <span className="info-value">{report.xRayType}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date:</span>
            <span className="info-value">{formatDate(new Date())}</span>
          </div>
        </div>
      </div>

      {/* Report Title */}
      <h2 className="report-title">
        {report.title || "CHEST X-RAY PA VIEW Report"}
      </h2>

      {/* Report Content */}
      <div className="report-content" 
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(templateData) }}>
      </div>

      {/* Signature and Footer */}
      <div className="signature-section">
        <img 
          src={patient.signature} 
          alt="Doctor's Signature" 
          className="signature"
          crossOrigin="anonymous"
        />
        <p className="issued-by">
          Issued by: {patient.referredBy}
        </p>
        <p className="issued-by">
          Date: {formatDate(new Date())}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer">
        <p>
          Disclaimer: This is a generated radiology report based on images and clinical inputs provided by the referring center. 
          It is intended for use by qualified healthcare professionals. All findings should be correlated with clinical evaluation 
          and other investigations.
        </p>
        <p>
          The reporting radiologist and diagnostic center are not responsible for decisions made solely on the basis of this report. 
          A digital signature is included for verification.
        </p>
      </div>

      {/* Footer Services */}
      {footerText && (
        <div className="footer">
          <p>{footerText}</p>
        </div>
      )}
    </div>
  );
};

export default ReportTemplate;
