import React, { useState, useEffect } from 'react';
import { PDFViewer as ReactPDFViewer, PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import Button from '../layout-ui/Button';

const PDFViewerComponent = ({ patient, centre, report, templateData, footerItems }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  console.log('PDFViewer templateData:', templateData);
  
  // Set loading to false after a short delay to give the PDF time to render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Create PDF document component to reuse
  const pdfDocument = (
    <ReportPDF 
      patient={patient}
      centre={centre}
      report={report}
      templateData={templateData}
      footerItems={footerItems}
    />
  );

  // For mobile devices - provide a download or open in browser options
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <p className="text-yellow-700 font-medium">PDF preview is not available on mobile devices</p>
          <p className="text-yellow-600 text-sm">Please use one of the options below to view your PDF:</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Download option */}
          <PDFDownloadLink
            document={pdfDocument}
            fileName={`Report_${patient.name || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`}
            className="no-underline flex-1"
          >
            {({ blob, url, loading, error }) => (
              <Button
                type="button"
                fullWidth
                size="md"
                rounded="md"
                disabled={loading}
              >
                {loading ? 'Preparing Download...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
          
          {/* Open in new tab option */}
          <BlobProvider document={pdfDocument}>
            {({ blob, url, loading, error }) => (
              <Button
                type="button"
                variant="outlined"
                fullWidth
                size="md"
                rounded="md"
                disabled={loading}
                onClick={() => {
                  if (url) window.open(url, '_blank');
                }}
              >
                {loading ? 'Preparing Preview...' : 'Open in Browser'}
              </Button>
            )}
          </BlobProvider>
        </div>
      </div>
    );
  }
  
  // For desktop - show the PDF viewer
  return (
    <div className="flex flex-col space-y-4 scale-90 pb-8">
      <div className="flex flex-row space-x-2 justify-end">
        {/* Download Button */}
        <PDFDownloadLink
          document={pdfDocument}
          fileName={`Report_${patient.name || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`}
          className="no-underline"
        >
          {({ blob, url, loading, error }) => (
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="md"
              rounded="md"
              disabled={loading}
            >
              {loading ? 'Preparing Download...' : 'Download PDF'}
            </Button>
          )}
        </PDFDownloadLink>

        {/* Open in Browser Button */}
        <BlobProvider document={pdfDocument}>
          {({ blob, url, loading, error }) => (
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              size="md"
              rounded="md"
              disabled={loading}
              onClick={() => {
                if (url) window.open(url, '_blank');
              }}
            >
              {loading ? 'Preparing...' : 'Open in Browser'}
            </Button>
          )}
        </BlobProvider>
      </div>
      
      <div className="w-full max-w-4xl mx-auto border border-gray-300 rounded" style={{ height: 'calc(100vh - 150px)', maxHeight: 'calc(100vh - 150px)' }}>
        {isLoading && (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <p className="text-gray-700">Preparing PDF preview...</p>
          </div>
        )}
        <ReactPDFViewer 
          style={{ width: '100%', height: '100%', display: isLoading ? 'none' : 'block' }}
          showToolbar={true}
        >
          {pdfDocument}
        </ReactPDFViewer>
      </div>
    </div>
  );
};

export default PDFViewerComponent;
