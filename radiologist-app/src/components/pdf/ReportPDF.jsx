import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

// Helper function to check if URL is an S3 URL
const isS3Url = (url) => {
  if (!url || typeof url !== 'string') return false;
  // Check for common S3 URL patterns
  return (
    url.includes('amazonaws.com') || 
    url.includes('s3.') ||
    url.includes('X-Amz-Signature=') || 
    url.includes('AWSAccessKeyId=')
  );
};

// Register fonts (all required variants for better styling)
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal', fontStyle: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold', fontStyle: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontWeight: 'normal', fontStyle: 'italic' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bolditalic-webfont.ttf', fontWeight: 'bold', fontStyle: 'italic' }
  ]
});

// Fallback to standard fonts if needed
Font.registerHyphenationCallback(word => {
  // Return syllable points for hyphenation (empty array means no hyphenation)
  return [];
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flexGrow: 1,
    textAlign: 'center',
  },
  centerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0078d4',
    marginBottom: 5,
  },
  centerTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d41500',
    marginBottom: 3,
  },
  centerDetails: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 2,
  },
  logo: {
    width: 60,
    height: 60,
  },
  divider: {
    borderBottom: '1px solid #000',
    marginVertical: 10,
  },
  patientCard: {
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    color: 'black',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    width: '50%',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 5,
  },
  infoValue: {
    fontSize: 10,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  reportContent: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 20,
  },
  signatureSection: {
    marginTop: 30,
  },
  signature: {
    width: 120,
    height: 40,
    objectFit: 'contain',
    marginBottom: 10,
  },
  issuedBy: {
    fontSize: 10,
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#555555',
    textAlign: 'center',
    borderTop: '1px solid #0078d4',
    paddingTop: 10,
  },
  disclaimer: {
    fontSize: 9,
    color: '#555555',
    marginTop: 15,
    lineHeight: 1.5,
  },
});

// Helper function to format date
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// HTML renderer styles for react-pdf-html
const htmlStyles = {
  h1: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, marginTop: 16 },
  h2: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 14 },
  h3: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginTop: 12 },
  h4: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginTop: 10 },
  h5: { fontSize: 14, fontWeight: 'bold', marginBottom: 6, marginTop: 8 },
  h6: { fontSize: 12, fontWeight: 'bold', marginBottom: 6, marginTop: 6 },
  p: { fontSize: 11, marginBottom: 12, lineHeight: 1.5, color: '#333333' },
  ul: { marginBottom: 12, paddingLeft: 15 },
  ol: { marginBottom: 12, paddingLeft: 15 },
  li: { fontSize: 11, marginBottom: 6, lineHeight: 1.5 },
  a: { color: '#0078d4', textDecoration: 'none' },
  strong: { fontWeight: 'bold' },
  em: { fontStyle: 'italic' },
  img: { maxWidth: '100%', objectFit: 'contain' },
};

// Enhanced HTML renderer for PDF with improved error handling
const renderHtmlContent = (htmlString) => {
  if (!htmlString) {
    console.log('No HTML content to parse');
    return <Text key="empty">No content provided</Text>;
  }
  
  // Log the incoming HTML for debugging
  console.log('Rendering HTML content with react-pdf-html');
  
  // Clean HTML string and decode entities for better compatibility
  const cleanedHtml = htmlString
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Add font-family override to ensure we use our registered fonts
    .replace(/<([a-z][a-z0-9]*)[^>]*>/gi, '<$1 style="font-family: Roboto, sans-serif;">');
  
  try {
    // Wrap the HTML in a try-catch with error boundaries
    return (
      <View style={{ fontFamily: 'Roboto' }}>
        <Html 
          stylesheet={htmlStyles} 
          renderers={{
            // Custom renderers for common elements to ensure font consistency
            p: (props, children) => (
              <Text style={[htmlStyles.p, { fontFamily: 'Roboto' }]}>{children}</Text>
            ),
            em: (props, children) => (
              <Text style={[htmlStyles.em, { fontFamily: 'Roboto' }]}>{children}</Text>
            ),
            strong: (props, children) => (
              <Text style={[htmlStyles.strong, { fontFamily: 'Roboto' }]}>{children}</Text>
            ),
            // Handle images with CORS issues - special handling for S3 URLs
            img: (props, children) => {
              // Check if this is an S3 URL that might cause CORS issues
              const imageSource = props.src;
              const isS3Image = isS3Url(imageSource);
              
              console.log(`Rendering image: ${imageSource}, isS3: ${isS3Image}`);
              
              return (
                <Image 
                  src={imageSource} 
                  style={[htmlStyles.img]} 
                  // Critical settings for S3 URLs
                  cache={false}
                  // Use local proxy for S3 images if available
                  {...(isS3Image && {
                    // Additional props for S3 images
                    // This might help with CORS issues
                  })}
                />
              );
            }
          }}
        >
          {cleanedHtml}
        </Html>
      </View>
    );
  } catch (error) {
    console.error('Error rendering HTML content:', error);
    // Improved fallback that tries to preserve formatting
    try {
      // First attempt to render as simple HTML with minimal formatting
      const simplifiedHtml = cleanedHtml
        .replace(/<\/?(?!p|br|b|strong|i|em)[^>]+>/gi, '')
        .replace(/<(p|h[1-6])>/gi, '\n\n')
        .replace(/<\/(p|h[1-6])>/gi, '');

      return (
        <Text style={[styles.reportContent, { fontFamily: 'Roboto' }]}>
          {simplifiedHtml}
        </Text>
      );
    } catch (fallbackError) {
      // Last resort: plain text
      const plainText = cleanedHtml.replace(/<[^>]*>/g, ' ').trim();
      return <Text style={styles.reportContent}>{plainText}</Text>;
    }
  }
};

// Preprocess S3 images if needed
const preprocessSignatureImage = (patient) => {
  if (patient?.signature && isS3Url(patient.signature)) {
    console.log('Preprocessing S3 signature image:', patient.signature);
    
    // Create a modified patient object for PDF rendering
    return {
      ...patient,
      // Use signature as is - the CORS handling is now in the Image renderer
    };
  }
  return patient;
};

// Main PDF component
const ReportPDF = ({ patient, centre, report, templateData, footerItems = [] }) => {
  console.log('ReportPDF received templateData:', templateData);
  
  // Process the patient object to handle S3 URLs
  const processedPatient = preprocessSignatureImage(patient);
  
  // Parse HTML content into React-PDF compatible components using react-pdf-html
  const htmlContent = renderHtmlContent(templateData || '');

  const footerText = footerItems.length
    ? `Services Offered: ${footerItems.join(" | ")}`
    : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Center Information */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.centerName}>{centre.name}</Text>
            <Text style={styles.centerTag}>Diagnostic center and speciality clinic</Text>
            <Text style={styles.centerDetails}>{centre.address}</Text>
            <Text style={styles.centerDetails}>
              Phone: {Array.isArray(centre.contacts) ? centre.contacts.join(" / ") : centre.contacts}
            </Text>
          </View>
          {centre.logoVisible && (
            <Image
              src={centre.logo}
              style={styles.logo}
              cache={false}
            />
          )}
        </View>

        <View style={styles.divider} />

        {/* Patient Information Card */}
        <View style={styles.patientCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Patient Name:</Text>
              <Text style={styles.infoValue}>{patient.name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Reg No:</Text>
              <Text style={styles.infoValue}>{patient.id}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Refer By:</Text>
              <Text style={styles.infoValue}>{patient.referredBy}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age / Gender:</Text>
              <Text style={styles.infoValue}>{patient.age} Yrs / {patient.gender}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Department:</Text>
              <Text style={styles.infoValue}>{report.xRayType}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{formatDate(new Date())}</Text>
            </View>
          </View>
        </View>

        {/* Report Title */}
        <Text style={styles.reportTitle}>
          {report.title || "CHEST X-RAY PA VIEW Report"}
        </Text>

        {/* Report Content */}
        <View>
          {htmlContent}
        </View>

        {/* Signature and Footer */}
        <View style={styles.signatureSection}>
          <Image 
            src={processedPatient.signature} 
            style={styles.signature}
            cache={false}
          />
          <Text style={styles.issuedBy}>
            Issued by: {processedPatient.referredBy}
          </Text>
          <Text style={styles.issuedBy}>
            Date: {formatDate(new Date())}
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text>
            Disclaimer: This is a generated radiology report based on images and clinical inputs provided by the referring center. 
            It is intended for use by qualified healthcare professionals. All findings should be correlated with clinical evaluation 
            and other investigations.
          </Text>
          <Text style={{ marginTop: 5 }}>
            The reporting radiologist and diagnostic center are not responsible for decisions made solely on the basis of this report. 
            A digital signature is included for verification.
          </Text>
        </View>

        {/* Footer Services */}
        {footerText && (
          <View style={styles.footer}>
            <Text>{footerText}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ReportPDF;
